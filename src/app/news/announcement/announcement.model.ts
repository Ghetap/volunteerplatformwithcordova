import { Message } from '@angular/compiler/src/i18n/i18n_ast';

export class Announcement{
    constructor(
        public id:string,
        public title:string,
        public description:string,
        public price:number,
        public startDate:Date,
        public endDate:Date,
        public userId:string,
        public userPictureUrl:string,
        public phone:string,
        public message?:Message[]
    ){};
}