import {Component, Input, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {CompensationCalculationService} from "../compensation-calculation.service";
import {CompensatorTypes} from "../model/CompensatorTypes";
import {SingleCompensatorResult} from "../model/SingleCompensatorResult";

@Component({
  selector: 'app-compensation-display',
  templateUrl: './compensation-display.component.html',
  styleUrls: ['./compensation-display.component.css']
})
export class CompensationDisplayComponent implements OnInit {

  @Input()
  public compensator = ""
  public numberOfDays = 0
  public compensationAmount = 0
  public dailyAllowance = 0

  private subscription: Subscription

  constructor(private calculationService: CompensationCalculationService) {

    this.subscription = this.calculationService.getCalculationUpdate().subscribe()
  }

  ngOnInit(): void {
    if(this.compensator==CompensatorTypes.EMPLOYER) {
      this.subscription = this.calculationService.getEmployerCompensationUpdate().subscribe(newValues => {
        this.updateValues(newValues);
      })
    } else {
      this.subscription = this.calculationService.getInsuranceFundCompensationUpdate().subscribe(newValues => {
        this.updateValues(newValues);
      })
    }
  }

  private updateValues(compensatorResult: SingleCompensatorResult) {

    this.numberOfDays = compensatorResult.compensationDays
    this.compensationAmount = compensatorResult.compensationAmount
    this.dailyAllowance = this.compensationAmount / this.numberOfDays

    if(this.compensationAmount == 0) {
      this.dailyAllowance = 0
    }
  }
}
