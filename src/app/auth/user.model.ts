export class User {
  constructor(
    public id: string,
    public email: string,
    private _token: string,
    private tokenExpirationDate: Date,
    public firstname?:string,
    public lastname?:string,
    public imageUrl?:string,
    public description?:string
  ) {}

  get token() {
    if (!this.tokenExpirationDate || this.tokenExpirationDate <= new Date()) {
      return null;
    }
    return this._token;
  }

  get tokenDuration() {
    if (!this.token) {
      return 0;
    }
    //return 2000;
    return this.tokenExpirationDate.getTime() - new Date().getTime();
  }
}
