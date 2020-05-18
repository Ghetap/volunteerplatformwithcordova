export class Message{
    constructor(
        public text:string,
        public senderEmail:string,
        public receiverEmail:string,
        public createdAt:Date
    ){};
}