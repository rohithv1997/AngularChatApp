import { Component } from '@angular/core';
import { FireBaseService } from 'src/services/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-chat';
  constructor(private firebaseService: FireBaseService) { }
}
