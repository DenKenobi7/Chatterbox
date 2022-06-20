import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from "@angular/core";
import { AuthService } from "../../core/services/auth.service";
import { JWTinfo } from "../../auth/models/JWTInfo";
import { ChatGetDto } from "src/app/core/models/ChatGetDto";
import { ChatService } from "../services/chats.service";
import { UserDto } from "src/app/core/models/UserDto";
import { Chat } from "src/app/core/models/Chat";
import { ApiService } from "src/app/core/services/http-api.service";
import { Subscription } from "rxjs";
import { HubService } from "../services/hub.service";
import { MessageGetDto } from "src/app/core/models/MessageGetDto";

@Component({
    selector: 'messages',
    templateUrl: './messages.component.html'
})
export class MessagesComponent implements OnInit{ 
    @Input() chat:Chat|null
    selectedUser:UserDto
    currentUser:JWTinfo | null
    message:string
    subscriptionForUpdates: Subscription;
    
    constructor(private authService:AuthService,
                private chatService:ChatService,
                private hubService:HubService,
                private apiService:ApiService){        
    }

    send(){
        if (this.message){
            this.hubService.sendMessage(this.message).then((mes:MessageGetDto) => {
                this.chat?.messages.push(mes)
                this.message=''
            } );
        }       
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['chat'].currentValue) {
            let chat:Chat = changes['chat'].currentValue
            this.hubService.setNewChat(chat.id)
            this.subscribeForUpdates();
        }
      }

    private subscribeForUpdates = () => {
        if (this.subscriptionForUpdates) {
          this.subscriptionForUpdates.unsubscribe();
        }
        this.subscriptionForUpdates = this.hubService.initReceivingMessagesSubscription().subscribe(message => {
            this.chat!.messages = [...this.chat!.messages, message];
        })
        
      }

    ngOnInit(): void {
        this.currentUser = this.authService.currentUser;
    }
    
  
}