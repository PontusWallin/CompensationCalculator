import {EventEmitter, Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {CalculationResult} from "./model/CalculationResult";
import {SingleCompensatorResult} from "./model/SingleCompensatorResult";
import {CompensatorTypes} from "./model/CompensatorTypes";

@Injectable()
export class CompensationCalculationService {

  private readonly COMPENSATION_RATE = 0.7
  private readonly UNPAID_DAYS = 4
  private readonly MAX_DURATION_NORMAL = 182
  private readonly MAX_DURATION_TUBERCULOSIS = 240

  private compensation: number = 0

  public averageIncome: number = 0
  public sickLeaveDays: number = 0
  private paidSickLeaveDays: number = 0
  public hasTuberculosis: boolean = false

  calculationUpdated = new EventEmitter <CalculationResult>()

  employerCompUpdated = new EventEmitter<SingleCompensatorResult>()
  insuranceFundCompUpdated = new EventEmitter<SingleCompensatorResult>()

  calculate(): CalculationResult {

    let maxDuration = this.MAX_DURATION_NORMAL
    if(this.hasTuberculosis) {
      maxDuration = this.MAX_DURATION_TUBERCULOSIS
    }

    let dailyIncome = this.averageIncome/4/7 // 4 weeks per month 7 days per week
    this.compensation = 0

    let employerPays = 0
    let employerDays = 0

    let insuranceFundPays = 0
    let insuranceFundDays = 0

    if(this.paidSickLeaveDays < 0 || this.averageIncome  < 0) {
      // negative values should be treated as zero.
      return new CalculationResult(0,0,new SingleCompensatorResult('',0,0),new SingleCompensatorResult("", 0,0))
    }

    for(let currentSickDay = 1; currentSickDay<=this.sickLeaveDays; currentSickDay++) {
      if(currentSickDay < this.UNPAID_DAYS) {
        // no compensation - fewer than 4 days!
        this.compensation = 0
      } else {

        if(currentSickDay >=4 && currentSickDay<=8) {
          // employer pays for this day
          employerPays += dailyIncome*this.COMPENSATION_RATE
          employerDays += 1
        } else if (currentSickDay <= maxDuration) {
          // fund pays for this day
          insuranceFundPays += dailyIncome*this.COMPENSATION_RATE
          insuranceFundDays += 1
        }
      }
    }
    this.compensation = employerPays + insuranceFundPays

    let totalDays = employerDays + insuranceFundDays
    let compensationObj = new CalculationResult(
      this.compensation,
      totalDays,
      new SingleCompensatorResult(CompensatorTypes.EMPLOYER, employerPays, employerDays),
      new SingleCompensatorResult(CompensatorTypes.INSURANCE, insuranceFundPays, insuranceFundDays)
    )

    this.calculationUpdated.next(compensationObj)

    this.employerCompUpdated.next(compensationObj.employerComp)
    this.insuranceFundCompUpdated.next(compensationObj.insuranceComp)

    return compensationObj
  }

  getCalculationUpdate() : Observable<any> {
    return this.calculationUpdated.asObservable()
  }

  getEmployerCompensationUpdate() : Observable<SingleCompensatorResult> {
    return this.employerCompUpdated.asObservable()
  }

  getInsuranceFundCompensationUpdate() : Observable<SingleCompensatorResult> {
    return this.insuranceFundCompUpdated.asObservable()
  }
}
