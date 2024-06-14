import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-users-overview',
  templateUrl: './admin-users-overview.component.html',
  styleUrls: ['./admin-users-overview.component.css'],
})
export class AdminUsersOverviewComponent implements OnInit {
  activeGuests: User[] = [];
  activeWaiters: User[] = [];
  deactivatedGuests: User[] = [];
  deactivatedWaiters: User[] = [];
  blockedGuests: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe((resp) => {
      if (resp['message'] == 'ok') {
        let users = resp['users'];

        this.activeGuests = users.filter(
          (user: User) => user.active === 'active' && user.type === 'guest'
        );
        this.activeWaiters = users.filter(
          (user: User) => user.active === 'active' && user.type === 'waiter'
        );
        this.deactivatedGuests = users.filter(
          (user: User) => user.active === 'deactivated' && user.type === 'guest'
        );
        this.deactivatedWaiters = users.filter(
          (user: User) => user.active === 'deactivated' && user.type === 'waiter'
        );
        this.blockedGuests = users.filter(
          (user: User) => user.active === 'blocked' && user.type === 'guest'
        );
      } else console.log(resp['message']);
    });
  }

  deactivateUser(user: User) {
    this.userService.deactivateUser(user).subscribe((res: any) => {
      this.ngOnInit();
    });
  }

  activateUser(user: User) {
    this.userService.activateUser(user).subscribe((res: any) => {
      this.ngOnInit();
    });
  }

  deleteUser(user: User) {
    this.userService.deleteUser(user).subscribe((res: any) => {
      if (res.message === 'ok') {
        this.ngOnInit();
      } else {
        console.log(res.message);
      }
    });
  }

  unblockGuest(user: User) {
    this.userService.unblockGuest(user).subscribe((res: any) => {
      this.ngOnInit();
    });
  }
}
