import { Message } from '@angular/compiler/src/i18n/i18n_ast';

export class Announcement{
    constructor(
        public id:string,
        public title:string,
        public description:string,
        public price:number,
        public availableFrom:Date,
        public availableTo:Date,
        public userId:string,
        public userPictureUrl:string,
        public message?:Message[]
    ){};
}