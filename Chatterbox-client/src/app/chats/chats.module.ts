import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'primeng/api';
import { ListboxModule } from 'primeng/listbox';
import { AsideChatsComponent } from './aside-chats/aside-chats.component';
import { AsideUsersComponent } from './aside-users/aside-users.component';
import { chatRoutes } from './chats.routes';
import { HeaderComponent } from './header/header.component';
import { MainPageComponent } from './main-page.component';
import { MessagesComponent } from './messages/messages.component';
import { ChatService } from './services/chats.service';
import { UserService } from './services/users.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faMessage, fas, faUser, faUserAstronaut } from '@fortawesome/free-solid-svg-icons';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { HubService } from './services/hub.service';

@NgModule({
    declarations:[
        HeaderComponent, 
        AsideChatsComponent,
        AsideUsersComponent,
        MessagesComponent,     
        MainPageComponent,
    ],
    imports: [      
        FontAwesomeModule,                
        InputTextareaModule,
        ReactiveFormsModule,
        FormsModule,
        ListboxModule,
        ButtonModule,
        CommonModule,
        SharedModule,
        RouterModule.forChild(chatRoutes)
    ],
    providers: [     
        ChatService,
        UserService,
        HubService
    ],    
  })  
export class ChatsModule {  
    constructor(){
        library.add(fas ,faUser, faMessage, faUserAstronaut)
    }  
}