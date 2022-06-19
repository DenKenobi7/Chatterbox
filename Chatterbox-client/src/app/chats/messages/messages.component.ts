import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AuthService } from "../../core/services/auth.service";
import { JWTinfo } from "../../auth/models/JWTInfo";
import { ChatGetDto } from "src/app/core/models/ChatGetDto";
import { ChatService } from "../services/chats.service";
import { UserDto } from "src/app/core/models/UserDto";
import { Chat } from "src/app/core/models/Chat";
import { ApiService } from "src/app/core/services/http-api.service";

@Component({
    selector: 'messages',
    templateUrl: './messages.component.html'
})
export class MessagesComponent implements OnInit{ 
    @Input() chat:Chat|null
    selectedUser:UserDto
    currentUser:JWTinfo | null
    message:string
    constructor(private authService:AuthService,
                private chatService:ChatService,
                private apiService:ApiService){        
    }

    send(){

    }

    ngOnInit(): void {
        this.currentUser = this.authService.currentUser;
    }
    
  
}