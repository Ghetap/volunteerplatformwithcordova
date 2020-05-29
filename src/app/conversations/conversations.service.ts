import { Injectable } from '@angular/core';
import { ChatService } from '../news/chat/chat.service';

@Injectable({
  providedIn: 'root'
})
export class ConversationsService {

  constructor(private chatService:ChatService) { }
  getConversations(email:string,docId:string){
  
  }
}
