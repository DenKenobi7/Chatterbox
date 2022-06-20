import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpTransportType, HubConnection, HubConnectionBuilder, JsonHubProtocol, LogLevel } from "@microsoft/signalr";

import { Observable, Subject } from "rxjs";
import { JWTinfo } from "src/app/auth/models/JWTInfo";
import { Chat } from "src/app/core/models/Chat";
import { ChatCreateDto } from "src/app/core/models/ChatCreateDto";
import { ChatGetDto } from "src/app/core/models/ChatGetDto";
import { MessageGetDto } from "src/app/core/models/MessageGetDto";
import { UserDto } from "src/app/core/models/UserDto";
import { AuthService } from "src/app/core/services/auth.service";
import { ApiService } from "src/app/core/services/http-api.service";
import { Result } from "src/app/core/wrappers/Result";
import { environment } from "src/environments/environment";
declare var require: any

@Injectable({
    providedIn:'root'
})
export class HubService{
    private connection: HubConnection | null;
    private chatId: string | null;
    private chatSubject: Subject<ChatGetDto> = new Subject<ChatGetDto>()
    private messageSubject: Subject<MessageGetDto> = new Subject<MessageGetDto>()
    private chats: ChatGetDto[]
    constructor(
        private router:Router,
        private apiService:ApiService,
        private authService:AuthService){
                
    }

    public setNewChat(chId:string){
        if(this.connection && this.chatId){
            this.disconectChat(this.chatId)
        }
        this.activateChat(chId);
    }

    establishConnection() {
        if (!this.connection) {
          let url = `${environment.apiUrl}hubSocket`;
          this.connection = new HubConnectionBuilder()
            .configureLogging(LogLevel.Information)
            .withUrl(url, {
              transport: HttpTransportType.LongPolling
            })
            .withHubProtocol(new JsonHubProtocol())
            .build();
          
          this.connection.start()
            .then(() => {
              console.log('hub connected')              
            })
            .catch(err => {
              console.log('hub error')
              console.error(err.toString())
            })
        } 
      }
    
    disconectChat(chatId: string) {
        console.log('chat disconnected'+chatId) 
        this.connection?.invoke("DeactivateChat", chatId)  
        this.chatId = null;
    }
    
    disconect() {
        if (this.connection) {
          this.connection.stop();
          this.connection = null;
          console.log('hub disconnected') 
        }
    }

    initiateChat(user:UserDto){
      debugger;
        var ObjectID = require("bson-objectid");
        let newChatId = ObjectID().toString();
        debugger;
        let model = new ChatCreateDto(this.authService.getCurrentUser()!.id, user.id,newChatId);
        let chatDto:ChatGetDto = {
            id: newChatId,
            lastUsed: new Date(),
            userName:user.userName,
            companionId:user.id
        }
        this.chatSubject.next(chatDto)
        console.log('chat initiated')
        this.connection?.invoke("InitiateChat", model)
        .then(() =>{
          console.log('chat initiated')
        });
         
    }

    activateChat(chatId:string){
        this.chatId = chatId;
        this.connection?.invoke("ActivateChat", chatId);
        console.log('chat connected'+chatId) 
    }
    
    initReceivingMessagesSubscription(): Observable<MessageGetDto> {
        this.connection?.on("ReceiveMessage", args => {
          const message: MessageGetDto = {...args};
          //const text = this.chatKeyHelper.decrypt(message.text);
          //message.text = text;
          this.messageSubject.next(message);
        });
        
        return this.messageSubject;
    }

    initReceivingChatsSubscription(): Observable<ChatGetDto> {
        this.connection?.on("ReceiveChatInvitation", args => {
          debugger;
          const chat: ChatGetDto = {...args};
          //const text = this.chatKeyHelper.decrypt(message.text);
          //message.text = text;
          this.chatSubject.next(chat);
        });
        
        return this.chatSubject;
    }
    
    async sendMessage(textMes: string){
        //const encryptedText = this.chatKeyHelper.encrypt(text);
        
        var ObjectID = require("bson-objectid");
        
        let selfMessageId = ObjectID().toString()
        
        let userId = this.authService.getCurrentUser()!.id;
        let messageSelf:MessageGetDto = {
            id:selfMessageId,
            status:'Sent',
            senderId: userId,
            text: textMes,
            dateCreated: new Date()
        }
        let messageComp:MessageGetDto = {
            id:'',
            status:'Sent',
            senderId: userId,
            text: textMes,
            dateCreated: new Date()
        }
        let messages = {
          chatId: this.chatId,
          messageSelfEncr: messageSelf,
          messageCompEncr: messageComp
        };
        this.messageSubject.next(messageSelf)
        this.connection?.invoke("SendMessage", messages);
    }


}