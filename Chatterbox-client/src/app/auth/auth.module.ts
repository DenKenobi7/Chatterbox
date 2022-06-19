import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
//import { SharedModule } from "../shared/shared.module";
import { authRoutes } from "./auth.routes";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
//import { RegisterComponent } from "./register.component";

@NgModule({
    declarations:[LoginComponent, RegisterComponent],
    imports: [      
        CommonModule,
        SharedModule,
        RouterModule.forChild(authRoutes)
    ],
    providers: [     
      
    ],    
  })  
export class AuthModule {    
}
