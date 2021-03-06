export class Announcement{
    constructor(
        public id:string,
        public title:string,
        public description:string,
        public price:number,
        public startDate:Date,
        public endDate:Date,
        public userId:string,
        public phone:string,
        public city:string,
        public street:string,
        public category:string,
        public numberOfVisualisations:number,
        public announcementPictureUrl:string
    ){};
}