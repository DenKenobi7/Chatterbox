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
    this.currentUser= authService.getCurrentUser();
    this.authService.currentUserSubject.subscribe(x=>this.currentUser=x);
  }
  errorClick():void{
      debugger;
    throw {message:"Error message from denis"}
  }
  logout():void{
      this.authService.logout();
      this.router.navigate(['auth/login']);

  }
  ngOnInit(){
    this.currentUser= this.authService.getCurrentUser();
  }
}
