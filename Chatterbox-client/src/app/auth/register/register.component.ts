import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "src/app/core/services/auth.service";
import { ErrorResult } from "src/app/core/wrappers/ErrorResult";
import { Result } from "src/app/core/wrappers/Result";
import { RegisterModel } from "../models/RegisterModel";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styles: [
    ]
  })
  export class RegisterComponent implements OnInit {
    form: FormGroup;
    error: string;
  
    constructor(
      private auth: AuthService,
      private router: Router, private formBuilder: FormBuilder) { }
  
    ngOnInit(): void {
      this.form = this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        userName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        passwords: this.formBuilder.group({
          password: ['', [Validators.required, Validators.minLength(6)]],
          confirmPassword: ['']
        }, {
          validators: (control: AbstractControl): {passwordMismatch: boolean} | null => {
            if (control.get("password")?.value != control.get("confirmPassword")?.value) {
              return {passwordMismatch: true};
            }
            return null;
          }
        })
      })
    }
  
    navigateToLogin() {
      this.router.navigateByUrl('/auth/login')
    }
  
    register() {
      if (this.form.invalid) {
        this.form.markAsTouched();
        return;
      }
      this.error = '';
      const request: RegisterModel = this.form.value;
      request.password = this.form.get("passwords")?.get("password")?.value;
      this.auth.register(request).subscribe({
        next: () => {
          this.router.navigate(['/auth/login'], {state: {email: request.email, password: request.password}})
        },
        error: (resp: ErrorResult) => {
          this.error = resp.ErrorMessage
        }
      });
    }
  }
  