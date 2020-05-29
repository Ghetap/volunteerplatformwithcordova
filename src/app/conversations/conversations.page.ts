import { Component, OnInit } from '@angular/core';
import { Conversation } from './conversation-item/conversation.model';
import { IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.page.html',
  styleUrls: ['./conversations.page.scss'],
})
export class ConversationsPage implements OnInit {

  conversations:Conversation[];
  constructor() { }

  ngOnInit() {
  }
  onGoToChat(email:string,slidingChat:IonItemSliding){

  }
}
