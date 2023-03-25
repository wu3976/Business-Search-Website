import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-empty-result-banner',
  templateUrl: './empty-result-banner.component.html',
  styleUrls: ['./empty-result-banner.component.css']
})
export class EmptyResultBannerComponent implements OnInit {
  @Input() text: string="";
  @Input() visible: boolean = false;
  
  constructor() { }

  ngOnInit(): void {
  }

}
