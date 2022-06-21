import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Chat } from "src/app/core/models/Chat";
import { ChatCreateDto } from "src/app/core/models/ChatCreateDto";
import { ChatGetDto } from "src/app/core/models/ChatGetDto";
import { ApiService } from "src/app/core/services/http-api.service";

@Injectable({
    providedIn:'root'
})
export class ChatService{
    constructor(
        private apiService:ApiService){                
    }

    getUserChats():Observable<ChatGetDto[]>{
        return this.apiService.get<ChatGetDto[]>("chat/getUserChats");        
    }

    createChat(dto:ChatCreateDto):Observable<ChatGetDto>{
        return this.apiService.post<ChatGetDto>("chat/create", dto);
    }

    getChat(userId:string, chatId:string){
        return this.apiService.get<Chat>(`chat?userId=${userId}&chatId=${chatId}`);
    }

}