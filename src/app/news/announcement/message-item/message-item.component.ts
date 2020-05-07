import { Component, OnInit, Input } from '@angular/core';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.scss'],
})

export class MessageItemComponent implements OnInit {

  constructor() { }
  @Input() message:Message;
  ngOnInit() {}

}
