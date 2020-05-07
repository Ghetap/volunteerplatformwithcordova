import { Component, OnInit, Input } from '@angular/core';
import { User } from '../auth/user.model';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  @Input() user:User;
  constructor() { }

  ngOnInit() {
  }

}
