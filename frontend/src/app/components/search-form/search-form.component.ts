import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Output, EventEmitter } from '@angular/core'

import { debounceTime, tap, switchMap, finalize, distinctUntilChanged, filter } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

import { ipinfo_token, geocoding_token } from 'src/app/tokens';
import { MILE_TO_METER, CATEGORIES } from 'src/app/constants';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent implements OnInit {
  CATS = CATEGORIES;

  keyword : string = "";
  distance ?: number;
  category: number = 1;
  location: string = "";
  auto_detect : boolean = false;

  atpctrl = new FormControl();
  isLoading = false;
  suggestions?: any;
  minlenterm = 3;

  @Output() showTableEvent : EventEmitter<any> = new EventEmitter();
  @Output() noResultEvent : EventEmitter<any> = new EventEmitter();
  @Output() clearEvent: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.atpctrl.valueChanges.pipe(
      filter(res => {return res !== null && res.length > this.minlenterm}),
      distinctUntilChanged(),
      debounceTime(1000),
      tap(() => {
        this.suggestions = [];
        this.isLoading = true;
        //console.log(this.keyword);
      }),
      switchMap(value => this.http.get(
        "/autocomplete", {
          params: { "text": this.keyword }
        }
        ).pipe(finalize(() => {this.isLoading = false}),)
      )
    ).subscribe((data: any) => {
      let new_suggestions = [];
      for (let d of data["categories"]) {
        console.log(d["title"]);
        new_suggestions.push(d["title"]);
      }
      for (let d of data["terms"]) {
        console.log(d["text"]);
        new_suggestions.push(d["text"]);
      }
      this.suggestions = new_suggestions;
    });
  }

  /*changeCategory(e: any) {
    this.category = e.target.value;
  }*/

  call_ipinfo_api() : Observable<number[]>{
    let coord_sbj = new Subject<number[]>();
    this.http.get("https://ipinfo.io/json?token=" + ipinfo_token).subscribe(
      (data : any) => {
        let locarr_str = data["loc"].split(",");
        let locarr : number[] = [Number(locarr_str[0]), Number(locarr_str[1])];
        coord_sbj.next(locarr);
      }
    );
    return coord_sbj.asObservable();
  }

  call_geolocation_api() : Observable<number[]>{
    let coord_sbj = new Subject<number[]>();
    this.http.get("https://maps.googleapis.com/maps/api/geocode/json", 
      {
        "params" : {
          "address" : this.location,
          "key" : geocoding_token 
        }
      }
    ).subscribe(
      (data : any) => {
        if (data["results"].length === 0) {
          coord_sbj.next([-1000, -1000]);
        } else {
          let lat = data["results"][0]["geometry"]["location"]["lat"];
          let lng = data["results"][0]["geometry"]["location"]["lng"];
          coord_sbj.next([lat, lng]);
        }
      }
    );
    return coord_sbj.asObservable();
  }

  call_yelp_bussearch(coord : number[]) {
    let parameters = new HttpParams()
                    .append("term", this.keyword)
                    .append("latitude", coord[0].toString())
                    .append("longitude", coord[1].toString())
                    .append("radius", typeof(this.distance) === "undefined" ? 
                    Math.floor(10 * MILE_TO_METER).toString() : 
                    Math.floor(this.distance * MILE_TO_METER).toString())
    if (this.CATS[this.category - 1]["cat"] !== "null") {
      parameters = parameters.append("categories", 
      this.CATS[this.category - 1]["cat"]);
    }

    this.http.get("/business_search",
      { "params" : parameters }
    ).subscribe((data: any) => {
      for (let i = 0; i < data["business_list"].length; i++) {
        data["business_list"][i]["distance"] /= MILE_TO_METER;
        data["business_list"][i]["distance"] = 
        Math.round(data["business_list"][i]["distance"] * 100) / 100
      }
      console.log(data);
      this.showTableEvent.emit(data);
      this.noResultEvent.emit(data["business_list"].length === 0);
    });
  }

  submit_clicked() {
    if (this.keyword.length === 0) {
      alert("Keyword is required");
      return;
    }
    if (this.location.length === 0 && !this.auto_detect) {
      alert("Location or auto_detect is required");
      return;
    }
    if (this.auto_detect) {
      this.call_ipinfo_api().subscribe(
        (coord_in) => {
          this.call_yelp_bussearch(coord_in);
        }
      );
    } else {
      this.call_geolocation_api().subscribe(
        (coord_in) => {
          this.call_yelp_bussearch(coord_in);
        }
      );
    }
  }

  clear_clicked() {
    this.keyword = "";
    this.distance = undefined;
    this.category = 1;
    this.location = "";
    this.auto_detect = false;
    this.clearEvent.emit();
  }

  autodet_clicked() {
    this.location = "";
  }

  onoptselected(value: string) {
    this.keyword = value;
  }

  display_with(value: any) {
    return value;
  }
}
