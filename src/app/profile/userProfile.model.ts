export class UserProfile {
    constructor(
      public id: string,
      public email: string,
      public firstname?:string,
      public lastname?:string,
      public imageUrl?:string,
      public description?:string
    ) {}
}