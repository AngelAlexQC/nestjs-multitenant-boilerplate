import { Injectable } from '@angular/core';
import { AuthService as AuthApiService } from '@app/api/services';
import { AuthProfile, LoginResponse } from '@app/api/models';
import {
  Observable,
  BehaviorSubject,
  Subject,
  map,
  tap,
  switchMap,
  catchError,
} from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _profile = new BehaviorSubject<AuthProfile | null>(null);
  private _isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(private authApiService: AuthApiService, private router: Router) {}

  get profile(): Observable<AuthProfile | null> {
    return this._profile.asObservable();
  }

  get isAuthenticated(): Observable<boolean> {
    return this._isAuthenticated.asObservable();
  }

  getProfile(): Observable<AuthProfile> {
    return this.authApiService.getProfile().pipe(
      tap((profile) => {
        this._profile.next(profile);
        this._isAuthenticated.next(true);
      })
    );
  }

  signIn(params: {
    body: {
      email: string;
      password: string;
    };
  }): Observable<LoginResponse> {
    return this.authApiService.signIn(params).pipe(
      tap((response) => {
        const { accessToken } = response;
        localStorage.setItem('accessToken', accessToken);
        this.getProfile().subscribe(() => {
          this.router.navigate(['/home']);
        });
      })
    );
  }

  signOut(): void {
    localStorage.removeItem('accessToken');
    this._isAuthenticated.next(false);
    this._profile.next(null);
    this.router.navigate(['/auth/login']);
  }
}
