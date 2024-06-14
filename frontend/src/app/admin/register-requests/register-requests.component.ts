import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register-requests',
  templateUrl: './register-requests.component.html',
  styleUrls: ['./register-requests.component.css'],
})
export class RegisterRequestsComponent implements OnInit {
  regRequests: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getAllPendingGuests().subscribe((res: User[]) => {
      this.regRequests = res;
    });
  }

  acceptRequest(user: User) {
    this.userService.activateUser(user).subscribe((res: any) => {
      this.ngOnInit();
    });
  }

  declineRequest(user: User) {
    this.userService.declineUser(user).subscribe((res: any) => {
      this.ngOnInit();
    });
  }
}
