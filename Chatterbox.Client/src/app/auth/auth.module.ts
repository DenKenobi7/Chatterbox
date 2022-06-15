import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
//import { SharedModule } from "../shared/shared.module";
import { authRoutes } from "./auth.routes";
import { LoginComponent } from "./login.component";
import { RegisterComponent } from "./register.component";

@NgModule({
    declarations:[LoginComponent,RegisterComponent],
    imports: [
        //SharedModule,
        RouterModule.forChild(authRoutes)
    ],
    providers: [     
      
    ],    
  })  
export class AuthModule {    
}
