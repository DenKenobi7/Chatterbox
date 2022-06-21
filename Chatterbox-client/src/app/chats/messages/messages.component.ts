import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { AuthService } from "../../core/services/auth.service";
import { JWTinfo } from "../../auth/models/JWTInfo";
import { ChatService } from "../services/chats.service";
import { UserDto } from "src/app/core/models/UserDto";
import { Chat } from "src/app/core/models/Chat";
import { ApiService } from "src/app/core/services/http-api.service";
import { Subscription } from "rxjs";
import { HubService } from "../services/hub.service";

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
    //@ViewChild('scroller') scroller: ElementRef<HTMLDivElement>;
    
    constructor(private authService:AuthService,
                private chatService:ChatService,
                private hubService:HubService,
                private apiService:ApiService){        
    }

    async send(){
        if (this.message){
            let sengingMessage = this.message;
            this.message = '';
            await this.hubService.sendMessage(sengingMessage, this.chat!.companionId);
        }       
    }

    async ngOnChanges(changes: SimpleChanges) {
        if (changes['chat'].currentValue) {
            let chat:Chat = changes['chat'].currentValue
            this.hubService.setNewChat(chat.id, chat.companionId)
            this.subscribeForUpdates();
        }
      }

    private subscribeForUpdates = () => {
        if (this.subscriptionForUpdates) {
          this.subscriptionForUpdates.unsubscribe();
        }
        this.subscriptionForUpdates = this.hubService.initReceivingMessagesSubscription().subscribe(message => {
            this.chat!.messages = [...this.chat!.messages, message];
            //this.scroller.nativeElement.scrollTop = this.scroller.nativeElement.scrollHeight;
        })
        
      }

    ngOnInit(): void {
        this.currentUser = this.authService.getCurrentUser();
        //this.scroller.nativeElement.scrollTop = this.scroller.nativeElement.scrollHeight;
    }

    formatDate(date:string) {
        let d = new Date(date)
        var month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            hour = '' + d.getHours(),
            minute = '' + d.getMinutes();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [month, day].join('/')+ ' ' + [hour, minute].join(':');
    }  
}