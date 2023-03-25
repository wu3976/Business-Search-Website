import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit {
  result_table_data = [];
  detail_data : any= {
    "categories": null,
    "coordinates": null,
    "phone": null,
    "is_open_now": null,
    "location": null, // a dict of infos
    "id": null,
    "name": null,
    "photos": null, // list of url
    "price": null,
    "url": null
  }
  result_table_visible : boolean = false;
  no_result_banner_visible: boolean = false;
  detail_visible: boolean = false;
  detail_reserve_button_visible = true;
  detail_map_option : google.maps.MapOptions = {}
  detail_map_marker = {
    position: {
      "lat": 0,
      "lng": 0
    }
  }
  review = [];

  constructor(private http : HttpClient) { }

  ngOnInit(): void {
  }

  showTable(tabledata: any) {
    if (tabledata !== null) {
      this.result_table_data = tabledata["business_list"];
      this.result_table_visible = true;
      this.no_result_banner_visible = false;
      this.detail_visible = false;
    }
    
  }
  handleNoResult(noresult: boolean) {
    this.result_table_visible = !noresult;
    this.no_result_banner_visible = noresult;
    this.detail_visible = false;
  }

  handleCleaning() {
    this.result_table_visible = false;
    this.no_result_banner_visible = false;
    this.detail_visible = false;
  }

  handleResultClicked(data : any) {
    this.result_table_visible = false;
    this.no_result_banner_visible = false;
    this.detail_visible = true;
    this.detail_data = data;
    this.detail_map_option = {
      "center": {
        "lat": data["coordinates"]["latitude"],
        "lng": data["coordinates"]["longitude"]
      }
    }
    this.detail_map_marker = {
      "position" : {
        "lat": data["coordinates"]["latitude"],
        "lng": data["coordinates"]["longitude"]
      }
    }
    this.http.get("/review", {
      params: {
        "id": this.detail_data["id"]
      }
    }).subscribe(
      (data_back: any) => {
        this.review = data_back["review"];
        console.log(this.review);
      } /* { review: [...] } */
    )
  }

  handleBackEvent() {
    this.result_table_visible = true;
    this.no_result_banner_visible = false;
    this.detail_visible = false;
  }

  handleShowResButton(resbut_vis: boolean) {
    this.detail_reserve_button_visible = resbut_vis;
  }
  getNoResultText(): string {
    return "No results available";
  }
}
