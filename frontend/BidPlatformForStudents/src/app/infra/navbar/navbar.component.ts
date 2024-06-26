import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {NavbarService} from "./navbar.service";
import {MenuItem, MessageService} from "primeng/api";
import {Router} from "@angular/router";
import {Subject, Subscription, take, takeUntil} from "rxjs";
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {AnnouncementFormComponent} from "../../announcements/announcement-form/announcement-form.component";
import {Role} from "../../auth/domain/role";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [DialogService, MessageService]
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  points: number | undefined
  role: Role | undefined
  navbarService = inject(NavbarService)
  router = inject(Router)
  items: MenuItem[] | undefined
  private userSubscription: Subscription | undefined;
  newAnnouncementDialog: DynamicDialogRef | undefined;
  destroy$: Subject<boolean> = new Subject<boolean>()

  constructor(public dialogService: DialogService, private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.userSubscription = this.navbarService.isLoggedIn().subscribe(
      loggedInUserDto => {
        if (loggedInUserDto) {
          this.isLoggedIn = true
          this.points = loggedInUserDto.points
          this.role = loggedInUserDto.role
        } else {
          this.isLoggedIn = false
        }
      }
    )
  }

  logout() {
    this.navbarService.logout()
  }

  goToMyProfile() {
    this.router.navigate(['/profile'])
  }

  goToScanPage() {
    this.router.navigate(['/scan-qr'])
  }

  goToHistory() {
    this.router.navigate(['/history'])
  }

  show() {
    this.newAnnouncementDialog = new DynamicDialogRef()
    const ref = this.dialogService.open(AnnouncementFormComponent, {
      data: {
        ref: this.newAnnouncementDialog
      },
      position: "center",
      modal: true,
    });
    this.newAnnouncementDialog.onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: boolean) => {
        if (data) {
          ref.close()
        }
      })
  }

  ngOnDestroy(): void {
    this.newAnnouncementDialog?.destroy()
    this.userSubscription?.unsubscribe()
    this.destroy$.next(true)
  }

  protected readonly Role = Role;
}
