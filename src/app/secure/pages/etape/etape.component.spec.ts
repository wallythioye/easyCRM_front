import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-etape',
  templateUrl: './etape.component.html',
  styleUrls: ['./etape.component.css']
})
export class EtapeComponent {
  @Input() etape: any;
}
