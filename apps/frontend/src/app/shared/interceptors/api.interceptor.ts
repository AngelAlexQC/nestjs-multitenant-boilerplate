import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  private accessToken: string | null = null;

  constructor(private router: Router) {
    this.accessToken = localStorage.getItem('accessToken');
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (this.accessToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });
    }

    return next.handle(request);
  }
}
