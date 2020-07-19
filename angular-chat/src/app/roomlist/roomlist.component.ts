import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FireBaseService } from 'src/services/firebase.service';
import { LocalStorageService } from 'src/services/localstorage.service';
import { Constants } from 'src/helpers/constants';
import { Chat } from 'src/helpers/chat.model';
import { RoomUser } from 'src/helpers/roomuser.model';

@Component({
  selector: 'app-roomlist',
  templateUrl: './roomlist.component.html',
  styleUrls: ['./roomlist.component.css']
})
export class RoomlistComponent implements OnInit {

  nickname = '';
  displayedColumns: string[] = ['roomname'];
  rooms = [];
  isLoadingResults = true;

  constructor(
    private firebaseService: FireBaseService,
    private localStorageService: LocalStorageService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public datePipe: DatePipe
  ) {
    this.nickname = this.activatedRoute.snapshot.params.nickname;
    this.rooms = [];
  }

  ngOnInit(): void {
    this.loadRooms();
  }

  private loadRooms(): void {
    this.rooms = this.firebaseService.sendRequest(Constants.Routes.rooms);
    this.isLoadingResults = false;
  }

  public enterChatRoom(roomname: string): void {
    const chat = this.createChat(roomname);
    this.firebaseService.addItemToFirebase(Constants.Routes.chats, chat);
    const roomUser = this.firebaseService.subscribeToFirebase(Constants.Routes.roomusers, Constants.roomname, roomname);
    const user = roomUser.find(x => x.nickname === this.nickname);
    if (user !== undefined) {
      this.firebaseService.editItemInFirebase(Constants.Routes.roomusers + user.key, { status: 'online' });
    } else {
      const newroomuser = this.createRoomUser(roomname);
      this.firebaseService.addItemToFirebase(Constants.Routes.roomusers, newroomuser);
    }
    this.router.navigate(['/chatroom', this.nickname, roomname]);
  }

  private createRoomUser(roomname: string): RoomUser {
    const newroomuser = new RoomUser();
    newroomuser.roomname = roomname;
    newroomuser.nickname = this.nickname;
    newroomuser.status = 'online';
    return newroomuser;
  }

  private createChat(roomname: string): Chat {
    const chat = new Chat();
    chat.roomname = roomname;
    chat.nickname = this.nickname;
    chat.date = this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.message = `${this.nickname} enter the room`;
    chat.type = 'join';
    return chat;
  }

  public logout(): void {
    // this.localStorageService.removeItem(Constants.Nickname);
    this.router.navigate(['/login']);
  }
}
