import { Component, OnInit } from '@angular/core';
import { CustomErrorStateMatcher } from 'src/services/CustomErrorStateMatcher.service';
import { FireBaseService } from 'src/services/firebase.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalStorageService } from 'src/services/localstorage.service';
import { Constants } from 'src/helpers/constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private firebaseService: FireBaseService,
    private localStorageService: LocalStorageService,
    public customErrorStateMatcher: CustomErrorStateMatcher,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  loginForm: FormGroup;
  nickname = '';

  ngOnInit(): void {

    this.loginForm = new FormGroup({
      nickname: new FormControl('', Validators.required)
    });

    if (this.localStorageService.checkItemExists(Constants.nickname)) {
      this.loginForm.patchValue({nickname: this.localStorageService.getItem(Constants.nickname)});
    }
  }

  public getNicknameControl(): AbstractControl {
    return this.loginForm.get(Constants.nickname);
  }

  onFormSubmit(): void {
    this.firebaseService.addOrEdit(
      Constants.Routes.users,
      Constants.nickname,
      this.loginForm.value,
      this.navigateToRoomList.bind(this),
      this.navigateToRoomList.bind(this));
  }

  private navigateToRoomList(nickname: string): void {
    this.router.navigate(['/roomlist', nickname]);
  }

}
