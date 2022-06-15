import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable} from "rxjs";
import { map } from "rxjs/operators";
import { ApiService } from "./http-api.service";
import { JWTinfo } from "../../auth/models/JWTInfo";
import { RegisterModel } from "../../auth/models/RegisterModel";
import { LoginModel } from "../../auth/models/LoginModel";
import { Router } from "@angular/router";
import { ErrorResult } from "../wrappers/ErrorResult";

@Injectable({
    providedIn:'root'
})
export class AuthService{
    constructor(private apiService:ApiService,
        private router:Router){
        this.currentUser=null
        this.currentUserSubject = new BehaviorSubject<JWTinfo|null>(localStorage.getItem('user')==null ? localStorage.getItem('user') : 
                                                                                                         JSON.parse(localStorage.getItem('user') ?? "{}"));
        if(this.currentUserSubject.value!=null && new Date(this.currentUserSubject.value.ValidTo)<new Date()){
            this.currentUserSubject.next(null)
        }                                                                                                 
        this.currentUserSubject.subscribe(x=>this.currentUser=x)
        
    }
    public currentUserSubject: BehaviorSubject<JWTinfo|null>;
    public currentUser: JWTinfo|null;

    public get currentUserValue(): JWTinfo|null {
        return this.currentUserSubject.value;
    }

    

    logout():void {
        // remove user from local storage to log user out
        localStorage.removeItem('user');
        this.currentUserSubject.next(null);
    }
    login(loginModel:LoginModel):Observable<JWTinfo | ErrorResult>{
        return this.apiService.post<any>("auth/login",loginModel)
            .pipe(map((res:Response) => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(res.body));
                if(res.ok){
                    this.currentUserSubject.next(res.body as unknown as JWTinfo);
                
                    return (res.body as unknown as JWTinfo);
                }
                return res.body as unknown as ErrorResult;
                
            }));
    }
    register(registerModel:RegisterModel):Observable<any>{
        return this.apiService.post<any>("auth/register",registerModel).pipe(map((res:Response)=>{
            if(res.ok ){
                this.router.navigateByUrl("/auth/login");
            }
            return res.body as unknown as ErrorResult;
        }))
    }
}