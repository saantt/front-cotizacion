import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    let clonedRequest = request;

    if (localStorage.getItem('token')) {

      clonedRequest = request.clone({
        setHeaders: {
          Authorization: localStorage.getItem('cotizacion-user')
        }
      });

      console.log("clave de token", localStorage.getItem('cotizacion-user'));

      console.log("request", clonedRequest);

    }

    return next.handle(clonedRequest);
  }
}
