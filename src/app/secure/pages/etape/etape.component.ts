import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-etape',
  templateUrl: './etape.component.html',
  styleUrls: ['./etape.component.css']
})
export class EtapeComponent implements OnInit {
  @Input() etape: any;

  constructor() { }

  ngOnInit() {
  }
}
