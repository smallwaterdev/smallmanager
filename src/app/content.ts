export class VideoUrl{
    resolution: string;
    videoUrl: string;
}
export class Content{
    id:string;
    domain:string;
    index:string;
    indexUrl:string;
    imgSummaryUrl:string;
    imgPreviewUrls:string[];
    title: string; 
    starnames:string[];
    genres:string[];
    studio: string; 
    director:string;
    videoDomain:string;
    videoUrl:string;
    videoUrls: VideoUrl[];
    duration:number; 
    notes:string;
    view: number;
    releaseDate: string;
    favorite:number;
    rating:number;
    status: number;
    createdAt: string;
    updatedAt: string;
    version: number;

    update(field, value){
        switch(field){
            case "index": this.index = value;break;
            case "title": this.title = value;break;
            case "imgSummaryUrl": this.imgSummaryUrl = value;break;
            default:break;
        }
        return true;
    }
    
}
