export class Notification{
    constructor(
        public id:string,
        public announcementId:string,
        public title:any,
        public text:any,
        public seen:boolean,
        public date:Date
    ){};
}