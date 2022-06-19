import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AuthService } from "../../core/services/auth.service";
import { JWTinfo } from "../../auth/models/JWTInfo";
import { ChatGetDto } from "src/app/core/models/ChatGetDto";
import { ChatService } from "../services/chats.service";

@Component({
    selector: 'aside-chats',
    templateUrl: './aside-chats.component.html'
})
export class AsideChatsComponent implements OnInit{ 
    @Input() chats:ChatGetDto[]
    @Input() initialChat:ChatGetDto | null
    @Output() onSelectedChat = new EventEmitter<ChatGetDto>();
    selectedChat:ChatGetDto|null
    constructor(private authService:AuthService,
                private chatService:ChatService){        
    }

    onSelectionChanged():void{
        if (this.selectedChat) {
            this.onSelectedChat.next(this.selectedChat);
        }
    }

    ngOnInit(): void {
        if (!this.selectedChat && this.initialChat){
            this.selectedChat=this.initialChat;
            this.onSelectionChanged();
        }
    }
    
  
}