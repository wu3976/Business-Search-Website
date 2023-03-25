import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HOURS, MINUTES } from 'src/app/constants';
@Component({
  selector: 'app-detail-card',
  templateUrl: './detail-card.component.html',
  styleUrls: ['./detail-card.component.css']
})
export class DetailCardComponent implements OnInit {
  @Input() data: any = {};
  @Input() visible: boolean = false;
  @Output() backEvent : EventEmitter<any> = new EventEmitter();
  @Input() reviews = [];

  bgcolor = "yellow";
  color = "black";

  HOURS = HOURS;
  MINUTES = MINUTES;

  //model for reservation form
  email : string = "";
  date ?: any;
  hour = "10"; 
  minute = "00";

  validation_enabled: boolean = false;
  @Input() can_reserve: boolean = true;

  @Input() options : google.maps.MapOptions = {
      "center": {
        "lat": 40,
        "lng": 100
      }
  }

  @Input() marker = {
    position: {
      lat: 0,
      lng: 0
    }
  }
  
  constructor() { }

  ngOnInit(): void {
  }

  backArrowClicked(){}

  get_status_str() {
    return this.data["is_open_now"] ? "Open Now" : "Closed";
  }

  get_category_str() {
    let result = "";
    for (let i = 0; i < this.data["categories"].length; i++) {
      if (i != 0) {
        result += " | ";
      }
      result += this.data["categories"][i];
    }
    return result;
  }

  get_business_link() {
    return this.data["url"];
  }

  reserve_clicked() {
    alert("do reserve");
  }

  get_twitter_share_url() {
    return "https://twitter.com/intent/tweet?text=" 
    + encodeURIComponent("Check" + this.data["name"] + " on Yelp.") + "&url="
    + encodeURIComponent(this.data["url"]);
  }

  get_facebook_share_url() {
    return "https://www.facebook.com/sharer/sharer.php?u="
    + encodeURIComponent(this.data["url"]);
  }

  onBackClick() {
    this.backEvent.emit();
  }

  submitClicked() {
    // if no localstorage 
    if (typeof(this.email) === "undefined" || this.email === "" 
    || typeof(this.date) === "undefined" || this.date === "" 
    || typeof(this.hour) === "undefined" || this.hour === ""
    || typeof(this.minute) === "undefined" || this.minute === "") {
      return;
    }
    localStorage.setItem(this.data["id"], JSON.stringify({
      "name": this.data["name"],
      "email": this.email,
      "date": this.date,
      "hour": this.hour,
      "minute": this.minute
    }));
    alert("Reservation created!");
    document.getElementById("closingbutton")?.click();
    this.can_reserve = false;
  }

  getMapOptions() : google.maps.MapOptions{
    let result : google.maps.MapOptions = {
      "center": {
        "lat": this.data["coordinates"]["latitude"],
        "lng": this.data["coordinates"]["longitude"]
      }
    }
    return result;
  }

  doCancelRes() {
    localStorage.removeItem(this.data["id"]);
    alert("Reservation cencelled!");
    this.can_reserve = true;
  }
}
