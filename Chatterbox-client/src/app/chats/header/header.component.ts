import { Component } from "@angular/core";
import { AuthService } from "../../core/services/auth.service";
import { JWTinfo } from "../../auth/models/JWTInfo";
import { Router } from "@angular/router";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
  })
export class HeaderComponent { 
  currentUser?:JWTinfo|null
  constructor(private authService:AuthService,
    private router:Router){
    this.currentUser= authService.currentUser;
    this.authService.currentUserSubject.subscribe(x=>this.currentUser=x);
  }
  errorClick():void{
    throw {message:"Error message from denis"}
  }
  logout():void{
      this.authService.logout();

  }
  get f():string{
    return this.authService.getCurrentUser() ? `Bienvenido, ${this.authService.getCurrentUser()?.UserName}` : "Login"
  }
  
}
