export class Message{
    constructor(
        public receiverId:string,
        public senderId:string,
        public text:string,
        public emailReceiver:string,
        public emailSender:string,
        public createdAt:Date
    ){};
}