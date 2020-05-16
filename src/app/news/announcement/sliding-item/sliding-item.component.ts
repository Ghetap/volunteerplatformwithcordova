import { Component, OnInit, Input } from '@angular/core';
import { UserProfile } from 'src/app/profile/userProfile.model';

@Component({
  selector: 'app-sliding-item',
  templateUrl: './sliding-item.component.html',
  styleUrls: ['./sliding-item.component.scss'],
})
export class SlidingItemComponent implements OnInit {

  @Input() user:UserProfile;
  constructor() { }

  ngOnInit() {}

}
