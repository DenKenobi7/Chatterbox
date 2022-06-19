import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/core/services/auth.service";
import { ErrorResult } from "src/app/core/wrappers/ErrorResult";
import { LoginModel } from "../models/LoginModel";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: []
})
export class LoginComponent implements OnInit {
    email: string | null
    password: string | null 
    error: string 
    form: FormGroup 
    
    constructor(private router: Router, 
      private formBuilder: FormBuilder, 
      private activatedRoute: ActivatedRoute,
      private auth: AuthService) { }
    
    
    ngOnInit(): void {
      this.form = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]]
      })
      let {email, password} = history.state;
      if (email && password) {
        this.form.setValue({email, password});
        delete history.state.password;
        delete history.state.email;
      }
    }
  
    
    login() {
      if (this.form.invalid) {
        this.form.markAsTouched();
        return;
      }
      this.error='';
      const loginRequest: LoginModel = this.form.value;
      this.auth.login(loginRequest)
      .subscribe({next:() => {
        const url = this.activatedRoute.snapshot.queryParams['returnUrl'] || '';
        this.router.navigate([url], {
          queryParams: {returnUrl: null},
          queryParamsHandling: 'merge'
        });
      }, error: (resp: ErrorResult) => {
        this.error = resp.ErrorMessage
      }})
    }
  
    navigateToRegister() {
      this.router.navigate(['/auth/register'], {
        queryParamsHandling: 'merge'
      })
    }
  }