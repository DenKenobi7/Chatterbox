import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable} from "rxjs";
import { map } from "rxjs/operators";
import { ApiService } from "./http-api.service";
import { JWTinfo } from "../../auth/models/JWTInfo";
import { RegisterModel } from "../../auth/models/RegisterModel";
import { LoginModel } from "../../auth/models/LoginModel";
import { Router } from "@angular/router";
import { ErrorResult } from "../wrappers/ErrorResult";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn:'root'
})
export class AuthService{
    httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
        observe: 'response' as 'body',
        params: new HttpParams(),
        withCredentials:true
      }
    constructor(private apiService:ApiService,
        private httpService:HttpClient,
        private router:Router){
        this.currentUser=null
        this.currentUserSubject = new BehaviorSubject<JWTinfo|null>(localStorage.getItem('user')==null ? localStorage.getItem('user') : 
                                                                                                         JSON.parse(localStorage.getItem('user') ?? "{}"));
        if(this.currentUserSubject.value!=null && new Date(this.currentUserSubject.value.expiration)<new Date()){
            this.currentUserSubject.next(null)
        }                                                                                                 
        this.currentUserSubject.subscribe(x=>this.currentUser=x)
        
    }
    public currentUserSubject: BehaviorSubject<JWTinfo|null>;
    public currentUser: JWTinfo|null;

    public get currentUserValue(): JWTinfo|null {
        return this.currentUserSubject.value;
    }

    getCurrentUser():JWTinfo|null{
        if (this.currentUser) return this.currentUser;
        else return localStorage.getItem('user')==null ? localStorage.getItem('user') : 
        JSON.parse(localStorage.getItem('user') ?? "{}")
    }

    

    logout():void {
        // remove user from local storage to log user out
        localStorage.removeItem('user');
        this.currentUserSubject.next(null);
        this.router.navigateByUrl('/user/login');
    }
    login(loginModel:LoginModel):Observable<JWTinfo | ErrorResult>{
        return this.httpService.post<any>(`${environment.apiUrl}user/login`,
        JSON.stringify(loginModel),this.httpOptions)
            .pipe(map((res:Response) => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                if(res.ok){
                    localStorage.setItem('user', JSON.stringify(res.body));
                    let jwt:JWTinfo = res.body as unknown as JWTinfo;
                    this.currentUserSubject.next(jwt);
                    return jwt;
                }
                return res.body as unknown as ErrorResult;
                
            }));
    }
    register(registerModel:RegisterModel):Observable<any>{
        return this.httpService.post<any>(`${environment.apiUrl}user/register`,
        JSON.stringify(registerModel),this.httpOptions).pipe(map((res:Response)=>{
            if(!res.ok ){
                return res.body as unknown as ErrorResult;
            }
            return res.body
        }))
    }
}