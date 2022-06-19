import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ChatGetDto } from "src/app/core/models/ChatGetDto";
import { Chat } from "../core/models/Chat";
import { ChatCreateDto } from "../core/models/ChatCreateDto";
import { UserDto } from "../core/models/UserDto";
import { AuthService } from "../core/services/auth.service";
import { ApiService } from "../core/services/http-api.service";
import { Result } from "../core/wrappers/Result";
import { ChatService } from "./services/chats.service";
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
    constructor(private authService:AuthService,
                private apiService:ApiService,
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
    }
    
    onSelectedChat(chat: ChatGetDto) {
        this.selectedChat = chat;
        this.chatService.getChat(this.authService.currentUser!.id,chat.id).subscribe((received:Chat) => this.detailedChat = received);
    }

    onSelectedUser(user: UserDto){
        let existingChat: ChatGetDto|undefined = this.chats.find(e => {
            if(e.companionId === user.id) return true;
            return false;
        })
        if (existingChat){
            this.selectedChat=existingChat;
        }
        else {
            let currUser = this.authService.getCurrentUser()
            let chatCreateDto = new ChatCreateDto(currUser?.id!,user.id); 
            this.chatService.createChat(chatCreateDto).subscribe((chat:ChatGetDto) => {
                debugger;
                this.chats.unshift(chat)
            });
        }
    }
}