import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { FireBaseService } from 'src/services/firebase.service';
import { CustomErrorStateMatcher } from 'src/services/CustomErrorStateMatcher.service';
import { Chat } from 'src/helpers/chat.model';
import { Constants } from 'src/helpers/constants';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css']
})
export class ChatroomComponent implements OnInit {

  @ViewChild('chatcontent') chatcontent: ElementRef;
  scrolltop: number = null;

  chatForm: FormGroup;
  nickname = '';
  roomname = '';
  message = '';
  users = [];
  chats = [];

  constructor(
    private firebaseService: FireBaseService,
    public customErrorStateMatcher: CustomErrorStateMatcher,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public datepipe: DatePipe) {
    this.nickname = this.activatedRoute.snapshot.params.nickname;
    this.roomname = this.activatedRoute.snapshot.params.roomname;
  }

  private setScrollTop(): void {
    setTimeout(() => this.scrolltop = this.chatcontent.nativeElement.scrollHeight, 500);
  }

  ngOnInit(): void {
    this.resetChatForm();
    this.chats = this.firebaseService.sendRequest(Constants.Routes.chats, this.setScrollTop.bind(this));
    const allUsers = this.firebaseService.subscribeToFirebase(Constants.Routes.roomusers, Constants.roomname, this.roomname);
    this.users = allUsers.filter(x => x.status === 'online');
  }

  private resetChatForm(): void {
    this.chatForm = new FormGroup({
      message: new FormControl('', Validators.required)
    });
  }

  onFormSubmit(): void {
    const chat = this.createChat(this.chatForm.value.message, 'message');
    this.pushChatToFirebase(chat);
    this.resetChatForm();
  }

  private pushChatToFirebase(chat: Chat): void {
    this.firebaseService.addItemToFirebase(Constants.Routes.chats, chat);
  }

  exitChat(): void {
    const chat = this.createChat(`${this.nickname} leave the room`, 'exit');
    this.pushChatToFirebase(chat);

    const roomuser = this.firebaseService.subscribeToFirebase(Constants.Routes.roomusers, Constants.roomname, this.roomname);
    const user = roomuser.find(x => x.nickname === this.nickname);
    if (user !== undefined) {
      this.firebaseService.editItemInFirebase(Constants.Routes.roomusers + user.key, { status: 'offline' });
    }
    this.router.navigate(['/roomlist', this.nickname]);
  }

  private createChat(message: string, type: string): Chat {
    const chat = new Chat();
    chat.roomname = this.roomname;
    chat.nickname = this.nickname;
    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.message = message;
    chat.type = type;
    return chat;
  }
}
