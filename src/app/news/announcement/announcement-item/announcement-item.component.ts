import { Component, OnInit, Input } from '@angular/core';
import { Announcement } from '../announcement.model';

@Component({
  selector: 'app-announcement-item',
  templateUrl: './announcement-item.component.html',
  styleUrls: ['./announcement-item.component.scss'],
})
export class AnnouncementItemComponent implements OnInit {

  @Input() announcement:Announcement;
  constructor() { }

  ngOnInit() {}

}
