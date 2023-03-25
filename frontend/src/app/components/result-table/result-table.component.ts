import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-result-table',
  templateUrl: './result-table.component.html',
  styleUrls: ['./result-table.component.css']
})
export class ResultTableComponent implements OnInit {

  @Input() tableData = [];
  @Input() tableVisible : boolean = false;
  @Output() resultClickedEvent : EventEmitter<any> = new EventEmitter();
  @Output() resButtonEvenet : EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient) { }
  
  ngOnInit(): void {
  }

  onResultClick(business: any) {
    console.log(business);
    this.http.get("/business_detail", { params: {"id": business["id"]} })
    .subscribe(
      (data) => {
        console.log(data);
        this.resultClickedEvent.emit(data);
        console.log("bID: " + business["id"]);
        this.resButtonEvenet.emit(localStorage.getItem(business["id"]) === null)
      }
    );
  }
}
