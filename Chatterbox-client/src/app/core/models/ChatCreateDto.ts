export class ChatCreateDto{
    constructor(public userId:string,
        public companionId:string,
        public chatId:string){
    }
}