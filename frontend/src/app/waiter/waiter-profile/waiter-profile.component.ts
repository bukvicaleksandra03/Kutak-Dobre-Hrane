import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-waiter-profile',
  templateUrl: './waiter-profile.component.html',
  styleUrls: ['./waiter-profile.component.css']
})
export class WaiterProfileComponent implements OnInit{
  user: User = new User();

  ngOnInit(): void {
    let userLS = localStorage.getItem('loggedUser');
    if (userLS == null) {
      return;
    }

    this.user = JSON.parse(userLS);
  }
}
