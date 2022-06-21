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
import { RSAService } from "src/app/core/services/RSA.service";
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
        private authService:AuthService,
        private rsaService:RSAService){
                
    }

    public async setNewChat(chId:string, companionId:string){
        if(this.connection && this.chatId){
            this.disconectChat(this.chatId)
        }
        await this.activateChat(chId, companionId);
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

    async initiateChat(user:UserDto){
        var ObjectID = require("bson-objectid");
        let newChatId = ObjectID().toString();
        debugger;
        const currentUserId = this.authService.getCurrentUser()!.id;
        let model = new ChatCreateDto(currentUserId, user.id,newChatId);
        let chatDto:ChatGetDto = {
            id: newChatId,
            lastUsed: new Date(),
            userName:user.userName,
            companionId:user.id
        }
        this.chatSubject.next(chatDto)
        this.connection?.invoke("InitiateChat", model)
        .then(async () =>{
          console.log('chat initiated')
          await this.rsaService.initChatKey(currentUserId, user.id, newChatId)
        });
         
    }

    async activateChat(chatId:string, companionId:string){
        this.chatId = chatId;
        this.connection?.invoke("ActivateChat", chatId);
        await this.rsaService.getCompanionKey(this.authService.getCurrentUser()!.id,companionId,chatId)
        console.log('chat connected'+chatId) 
    }
    
    initReceivingMessagesSubscription(): Observable<MessageGetDto> {
      
        this.connection?.on("ReceiveMessage", args => {
          const message: MessageGetDto = {...args};
          const text = this.rsaService.decrypt(message.text, this.authService.getCurrentUser()!.id, this.chatId!);
          message.text = text;
          this.messageSubject.next(message);
        });
        
        return this.messageSubject;
    }

    initReceivingChatsSubscription(): Observable<ChatGetDto> {
        this.connection?.on("ReceiveChatInvitation", args => {
          debugger;
          const chat: ChatGetDto = {...args};
          this.rsaService.initChatKey(this.authService.getCurrentUser()!.id, chat.companionId, chat.id)
          this.chatSubject.next(chat);
        });
        
        return this.chatSubject;
    }
    
    async sendMessage(textMes: string, companionId: string){
      debugger;
        let userId = this.authService.getCurrentUser()!.id;
        
        const companionEncryptedText = this.rsaService.encrypt(textMes, companionId, this.chatId!);
        const selfEncryptedText = this.rsaService.encrypt(textMes, userId, this.chatId!);
        var ObjectID = require("bson-objectid");
        
        let selfMessageId = ObjectID().toString()
        
        
        let messageSelf:MessageGetDto = {
            id:selfMessageId,
            status:'Sent',
            senderId: userId,
            text: selfEncryptedText,
            dateCreated: new Date()
        }
        let messageComp:MessageGetDto = {
            id:'',
            status:'Sent',
            senderId: userId,
            text: companionEncryptedText,
            dateCreated: new Date()
        }
        let messages = {
          chatId: this.chatId,
          messageSelfEncr: messageSelf,
          messageCompEncr: messageComp
        };
        
        
        this.connection?.invoke("SendMessage", messages).then(() =>{
          messageSelf.text = textMes;
          this.messageSubject.next(messageSelf)
        });
    }


}