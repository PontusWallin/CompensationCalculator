import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-calculate-button',
  templateUrl: './calculate-button.component.html',
  styleUrls: ['./calculate-button.component.css']
})
export class CalculateButtonComponent {

  @Output() calculationStarted = new EventEmitter<boolean>()

  onClick() {
    this.calculationStarted.emit(true)
  }
}
