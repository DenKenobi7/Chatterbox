import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { catchError, Observable, retry, throwError } from "rxjs";
import { JWTinfo } from "../auth/models/JWTInfo";
import { AuthService } from "./services/auth.service";
import { Result } from "./wrappers/Result";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService:AuthService,
        private activatedRoute:ActivatedRoute,
        private router:Router){

    }
    intercept(req: HttpRequest<any>,
              next: HttpHandler): Observable<HttpEvent<any>> {
        if(localStorage.getItem("user") && (JSON.parse(localStorage.getItem("user")??"")as JWTinfo)?.expiration>new Date()){
            this.authService.logout()
            this.router.navigateByUrl('auth/login')            
        }
        return next.handle(req)
            .pipe(catchError((error : HttpErrorResponse) => {
                if(error.status === 401) {
                    this.router.navigateByUrl('auth/login');   
                }
                
                let response: Result<boolean> = error.error as Result<boolean>;
                return throwError(() => response);   
                                      
            }));        
    }
}
