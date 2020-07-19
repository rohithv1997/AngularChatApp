import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomErrorStateMatcher } from 'src/services/CustomErrorStateMatcher.service';
import { FireBaseService } from 'src/services/firebase.service';
import { Constants } from 'src/helpers/constants';

@Component({
  selector: 'app-addroom',
  templateUrl: './addroom.component.html',
  styleUrls: ['./addroom.component.css']
})
export class AddroomComponent implements OnInit {
  roomForm: FormGroup;
  nickname = '';
  roomname = '';
  constructor(
    public customErrorStateMatcher: CustomErrorStateMatcher,
    private firebaseSerivce: FireBaseService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.roomForm = new FormGroup({
      roomname: new FormControl('', Validators.required)
    });
  }

  onFormSubmit(): void {
    this.firebaseSerivce.listenOnceToFirebase(
      Constants.Roomname,
      this.roomForm.value[Constants.Roomname],
      Constants.Rooms,
      this.roomForm.value[Constants.Roomname],
      this.onSnackbarExists.bind(this),
      this.navigateToRoomList.bind(this)
    );
  }

  private onSnackbarExists(): void {
    this.snackBar.open('Room name already exists!');
  }

  private navigateToRoomList(): void {
    this.router.navigate(['/roomlist', '']);
  }
}
