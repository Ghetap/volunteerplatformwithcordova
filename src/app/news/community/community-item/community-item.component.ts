import { Component, OnInit, Input } from '@angular/core';
import { UserProfile } from 'src/app/profile/userProfile.model';

@Component({
  selector: 'app-community-item',
  templateUrl: './community-item.component.html',
  styleUrls: ['./community-item.component.scss'],
})
export class CommunityItemComponent implements OnInit {

  @Input() user:UserProfile;
  constructor() { }

  ngOnInit() {}

}
