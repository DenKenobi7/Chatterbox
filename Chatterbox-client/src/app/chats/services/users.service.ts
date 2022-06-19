import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { UserDto } from "src/app/core/models/UserDto";
import { ApiService } from "src/app/core/services/http-api.service";

@Injectable({
    providedIn:'root'
})
export class UserService{
    constructor(
        private router:Router,
        private apiService:ApiService){                
    }

    getAvailableUsers():Observable<UserDto[]>{
        return this.apiService.get<UserDto[]>("user/getAvailableUsers");
    }
}