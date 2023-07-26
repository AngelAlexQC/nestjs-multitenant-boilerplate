import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService as AuthAPIService } from '../../../api/services';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { catchError } from 'rxjs';
import { NotificationsService } from '../../../shared/notifications.service';
import { AuthService } from '@app/auth/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  redirectUrl: string | null = null;
  constructor(
    private authAPIService: AuthAPIService,
    private authService: AuthService,
    private router: Router,
    private notifications: NotificationsService
  ) {
    const { redirectUrl } =
      this.router.getCurrentNavigation()?.extras?.state || {};
    this.redirectUrl = redirectUrl;
    authAPIService.getProfile().subscribe((profile) => {
      this.notifications.success('Already logged in');
      this.router.navigate(['/home']);
    });
  }

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
    this.authAPIService
      .signIn({
        body: {
          email,
          password,
        },
      })
      .pipe(
        catchError((err) => {
          const { status } = err || {};
          if (status === 401) {
            this.notifications.error('Invalid credentials');
          } else {
            const message = `An error occurred while logging in: ${err.message}, please try again`;
            this.notifications.error(message);
          }
          throw err;
        })
      )
      .subscribe((res) => {
        const { accessToken } = res || {};
        if (!accessToken) return;
        localStorage.setItem('accessToken', accessToken);
        this.notifications.success('Logged in successfully');
        this.router.navigate([this.redirectUrl || '/home']);
      });
  }
}
