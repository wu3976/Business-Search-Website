import { InteractivityChecker } from '@angular/cdk/a11y';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bookings-page',
  templateUrl: './bookings-page.component.html',
  styleUrls: ['./bookings-page.component.css']
})
export class BookingsPageComponent implements OnInit {
  banner_text: string = "No reservations to show";
  reservations : any= [];
  test_array = ["1", "2", "3"];
  constructor() { }

  init() {
    let temp: any = [];
    Object.keys(localStorage).forEach((key) => {
      let objstr: any = localStorage.getItem(key);
      let obj = JSON.parse(objstr);
      temp.push([key, obj]);
    });
    console.log(temp);
    this.reservations = temp;
  }
  ngOnInit(): void {
    this.init();
  }

  check_have_res() {
    return localStorage.length !== 0;
  }

  removeRes(key: any) {
    localStorage.removeItem(key);
    this.init();
  }

}
