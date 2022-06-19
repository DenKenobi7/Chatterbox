import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AuthService } from "../../core/services/auth.service";
import { JWTinfo } from "../../auth/models/JWTInfo";
import { ChatGetDto } from "src/app/core/models/ChatGetDto";
import { ChatService } from "../services/chats.service";
import { UserDto } from "src/app/core/models/UserDto";

@Component({
    selector: 'aside-users',
    templateUrl: './aside-users.component.html'
})
export class AsideUsersComponent implements OnInit{ 
    @Input() users:UserDto[]
    @Output() onSelectedUser = new EventEmitter<UserDto>();
    selectedUser:UserDto|null
    constructor(private authService:AuthService,
                private chatService:ChatService){        
    }

    onSelectionChanged():void{
        if (this.selectedUser) {            
            this.onSelectedUser.next(this.selectedUser);
            this.selectedUser=null
        }
    }

    ngOnInit(): void {
        
    }
    
  
}