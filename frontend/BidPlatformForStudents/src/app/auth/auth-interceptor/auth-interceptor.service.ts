import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {exhaustMap, Observable, take} from "rxjs";
import {LoginService} from "../login/login.service";
import {UserContextService} from "../user-context-service/user-context.service";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor{
  constructor(private userContextService: UserContextService, private loginService: LoginService) {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.loginService.loggedInUser$.pipe(
      take(1),
      exhaustMap(
        loggedInUserDto => {
          if(loggedInUserDto?.token) {
            this.userContextService.setLoggedInUser(loggedInUserDto);
            const modifiedRequest = req.clone({
              setHeaders: {
                Authorization: `Bearer ${loggedInUserDto.token}`
              }
            });
            return next.handle(modifiedRequest);
          }
          else {
            return next.handle(req);
          }
        }
      )
    )

  }

}
