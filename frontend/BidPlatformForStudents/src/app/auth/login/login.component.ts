import {Component, inject, OnDestroy} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LoginService} from "./login.service";
import {UserDtoModel} from "../domain/user-dto.model";
import {MessageService} from "primeng/api";
import {Router} from "@angular/router";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {RegistrationComponent} from "../registration/registration.component";
import {UserContextService} from "../user-context-service/user-context.service";
import {ChatRoomStompService} from "../../utils/chat-room-stomp.service";
import {Role} from "../domain/role";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent implements OnDestroy{
  form: any;
  loginService = inject(LoginService)
  userContextService = inject(UserContextService)
  userDto : UserDtoModel | undefined
  messageService = inject(MessageService)
  router = inject(Router)

  constructor() {
    this.createForm();
  }

  createForm() {
    this.form = new FormGroup<any | undefined>({
      email: new FormControl<string | any>('', [Validators.email, Validators.required]),
      password: new FormControl<string | any>('', Validators.required)
    })
  }

  onSubmit() {
    if(this.form.valid) {
      this.userDto = <UserDtoModel>this.form.value
      this.loginService.login(this.userDto).subscribe(
        loggedInUserDto => {
          this.userContextService.setLoggedInUser(loggedInUserDto)
          this.loginService.isLoggedIn(loggedInUserDto);
          if(loggedInUserDto.role === Role.USER) {
            this.router.navigate(['/dashboard'])
          }
          else {
            this.router.navigate(['/scan-qr'])
          }
        },
        errorResponse => {
          this.messageService.add({
            severity: 'error',
            summary: 'Logare esuata!',
            detail: this.handleErrorMessage(errorResponse)
          })
        }
      )
    }
  }

  private handleErrorMessage(errorResponse: any): string {
    let message = 'Nu v-ati putut loga!';
    if (errorResponse.error.email) {
      message = errorResponse.error.email
    } else if (errorResponse.error.password) {
      message = errorResponse.error.password;
    } else if (errorResponse.error.emailAlreadySent) {
      message = errorResponse.error.emailAlreadySent;
    }
    return message;
  }


  dialogService = inject(DialogService)
  dialog: DynamicDialogRef | undefined;


  register() {
    this.dialog = this.dialogService.open(RegistrationComponent, {
      header: "Inregistreaza-te!",
      styleClass: "header-color",
      position: "center"
    })
  }

  ngOnDestroy(): void {
    if (this.dialog) {
      this.dialog.close();
    }
  }
}
