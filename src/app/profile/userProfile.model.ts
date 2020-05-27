interface Notification{
  title:string,
  text:string
}
export class UserProfile {
    constructor(
      public id: string,
      public email: string,
      public firstname:string,
      public lastname:string,
      public profession:string,
      public where:string,
      public imageUrl?:string,
      public description?:string,
      public notifications?:Notification[]
    ) {}
}