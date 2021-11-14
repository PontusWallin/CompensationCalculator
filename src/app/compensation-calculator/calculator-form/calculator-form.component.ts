import {Component} from '@angular/core';
import {CompensationCalculationService} from "../compensation-calculation.service";

@Component({
  selector: 'app-calculator-form',
  templateUrl: './calculator-form.component.html',
  styleUrls: ['./calculator-form.component.css']
})
export class CalculatorFormComponent {

  constructor(private componentCalculationService : CompensationCalculationService ) {}

  doCalculation() {
    this.componentCalculationService.calculate()
  }

  onIncomeInput(event: any) {
    this.componentCalculationService.averageIncome = event.target.value
  }

  onSickLeaveInput(event: any) {
    this.componentCalculationService.sickLeaveDays = event.target.value
  }

  doTuberculosisSelection(event: any) {
    this.componentCalculationService.hasTuberculosis = event.target.checked
  }
}
