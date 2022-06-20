import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Subscription } from "rxjs";
import { ChatGetDto } from "src/app/core/models/ChatGetDto";
import { Chat } from "../core/models/Chat";
import { ChatCreateDto } from "../core/models/ChatCreateDto";
import { UserDto } from "../core/models/UserDto";
import { AuthService } from "../core/services/auth.service";
import { ApiService } from "../core/services/http-api.service";
import { Result } from "../core/wrappers/Result";
import { ChatService } from "./services/chats.service";
import { HubService } from "./services/hub.service";
import { UserService } from "./services/users.service";

@Component({
    selector: 'main-page',
    templateUrl: './main-page.component.html'
})
export class MainPageComponent implements OnInit{ 
    chats:ChatGetDto[] = []
    users:UserDto[] = []
    detailedChat:Chat|null = null
    selectedChat:ChatGetDto|null = null
    subscriptionForUpdates: Subscription
    constructor(private authService:AuthService,
                private apiService:ApiService,
                private hubService:HubService,
                private userService:UserService,
                private chatService:ChatService){      
        this.chats = new Array<ChatGetDto>()  
    }

    ngOnInit(): void {
        this.userService.getAvailableUsers().subscribe((receivedUsers:UserDto[]) =>{
            this.users=receivedUsers})
        this.chatService.getUserChats().subscribe((receivedChats:ChatGetDto[]) => {
            this.chats=receivedChats
        })
        this.hubService.establishConnection();
        this.subscribeOnNewChats();
    }

    private subscribeOnNewChats = () => {
        if (this.subscriptionForUpdates) {
            this.subscriptionForUpdates.unsubscribe();
        }
        this.subscriptionForUpdates = this.hubService.initReceivingChatsSubscription().subscribe((chatDto:ChatGetDto) => {
            
            this.chats = [chatDto, ...this.chats];
            //this.scroller.nativeElement.scrollTop = this.scroller.nativeElement.scrollHeight;
        })
    }
    
    onSelectedChat(chat: ChatGetDto) {
        debugger;
        this.selectedChat = chat;
        this.chatService.getChat(this.authService.currentUser!.id,chat.id).subscribe((received:Chat) => this.detailedChat = received);
    }

    onSelectedUser(user: UserDto){
        debugger;
        let existingChat: ChatGetDto|undefined = this.chats.find(e => {
            if(e.companionId === user.id) return true;
            return false;
        })
        if (existingChat){
            this.selectedChat=existingChat;
        }
        else {
            this.hubService.initiateChat(user);
        }
    }
}