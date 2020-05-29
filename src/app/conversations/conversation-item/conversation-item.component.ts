import { Component, OnInit, Input } from '@angular/core';
import { Conversation } from './conversation.model';

@Component({
  selector: 'app-conversation-item',
  templateUrl: './conversation-item.component.html',
  styleUrls: ['./conversation-item.component.scss'],
})
export class ConversationItemComponent implements OnInit {

  @Input() conversation:Conversation;
  constructor() { }

  ngOnInit() {}

}
