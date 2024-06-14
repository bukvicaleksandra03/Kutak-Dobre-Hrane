import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.css']
})
export class GuestComponent implements OnInit{
  user: User = new User();

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('loggedUser'));

  }
}
