import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../api/services';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(private authService: AuthService, private router: Router) {}

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  get emailIsValid(): boolean {
    if (!this.loginForm.controls.email.touched) return true;
    return this.loginForm.controls.email.valid;
  }

  get passwordIsValid(): boolean {
    if (!this.loginForm.controls.password.touched) return true;
    return this.loginForm.controls.password.valid;
  }

  get emailErrorMessage(): string {
    if (this.loginForm.controls.email.hasError('required')) {
      return 'Email is required';
    }

    return 'Email is invalid';
  }

  get passwordErrorMessage(): string {
    if (this.loginForm.controls.password.hasError('required')) {
      return 'Password is required';
    }

    return 'Password must be at least 8 characters';
  }

  onSubmit(): void {
    const { email, password } = this.loginForm.value || {};
    if (!email || !password) return;
    this.authService
      .signIn({
        body: {
          email,
          password,
        },
      })
      .subscribe(
        (response) => {
          Swal.fire({
            title: 'Success!',
            text: 'You have successfully logged in',
            icon: 'success',
            confirmButtonText: 'Ok',
          }).then(() => {
            this.router.navigate(['/']);
          });
        },
        (error) => {
          Swal.fire({
            title: 'Error!',
            text: error.message,
            icon: 'error',
            confirmButtonText: 'Ok',
          });
        }
      );
  }
}
