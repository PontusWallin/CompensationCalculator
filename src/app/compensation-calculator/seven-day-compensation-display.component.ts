import { Component } from '@angular/core';
import {CompensatorTypes} from "./model/CompensatorTypes";
import {Subscription} from "rxjs";
import {CompensationCalculationService} from "./compensation-calculation.service";

@Component({
  selector: 'app-compensation-calculator',
  templateUrl: './seven-day-compensation-display.component.html',
  styleUrls: ['./seven-day-compensation-display.component.css']
})
export class SevenDayCompensationDisplayComponent {

  public readonly employer = CompensatorTypes.EMPLOYER;
  public readonly healthInsurance = CompensatorTypes.INSURANCE;

  public sevenDayCompensationNet = 0

  public subscription : Subscription

  constructor( calculationService : CompensationCalculationService) {
    this.subscription = calculationService.getCalculationUpdate().subscribe(newValues => {

      if(newValues.totalComp == 0) {
        this.sevenDayCompensationNet = 0
        return
      }

      let perDay = newValues.totalComp/newValues.totalDays

      let per7Days
      if(newValues.totalDays < 7) {
        per7Days = perDay*newValues.totalDays
      } else {
        per7Days = perDay*7
      }

      this.sevenDayCompensationNet = per7Days
    })
  }
}
