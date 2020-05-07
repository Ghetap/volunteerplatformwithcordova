export class Message{
    constructor(
        public id:string,
        public text:string,
        public timestamp:Date,
        public authorId:string,
        public authorURL:string,
        public seen:boolean,
        public announcementId:string,
        public sendToAuthorId:string,
    ){};
}