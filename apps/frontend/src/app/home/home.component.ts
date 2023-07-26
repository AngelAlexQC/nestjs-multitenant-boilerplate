import { Component } from '@angular/core';
import { AuthProfile } from '@app/api/models';
import { AuthService as AuthApiService } from '@app/api/services';
import { AuthService } from '@app/auth/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  user$ = new Observable<AuthProfile | null>();

  constructor(
    private authApiService: AuthApiService,
    private authService: AuthService
  ) {
    this.user$ = this.authApiService.getProfile();
  }

  logout(): void {
    this.authService.signOut();
  }
}
