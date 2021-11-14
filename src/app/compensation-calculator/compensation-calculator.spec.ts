import {CompensationCalculationService} from "./compensation-calculation.service";

describe('CompensationCalculationService', () => {
  let service: CompensationCalculationService;
  beforeEach(() => {
    service = new CompensationCalculationService()
    service.hasTuberculosis = false
    service.averageIncome = 1000
  })

  it("should return zero for all compensation values if any input value is less than zero", () => {
    service.sickLeaveDays = -1
    service.averageIncome = -1
    let compNegativeDayAndIncome = service.calculate()

    expect(compNegativeDayAndIncome.employerComp.compensationAmount).toBe(0)
    expect(compNegativeDayAndIncome.insuranceComp.compensationAmount).toBe(0)
    expect(compNegativeDayAndIncome.totalComp).toBe(0)

    service.sickLeaveDays = 0
    service.averageIncome = 0
    let compZeroDayAndIncome = service.calculate()

    expect(compZeroDayAndIncome.employerComp.compensationAmount).toBe(0)
    expect(compZeroDayAndIncome.insuranceComp.compensationAmount).toBe(0)
    expect(compZeroDayAndIncome.totalComp).toBe(0)

    service.sickLeaveDays = 1
    service.averageIncome = -1
    let comp1DayAndZeroIncome = service.calculate()

    expect(comp1DayAndZeroIncome.employerComp.compensationAmount).toBe(0)
    expect(comp1DayAndZeroIncome.insuranceComp.compensationAmount).toBe(0)
    expect(comp1DayAndZeroIncome.totalComp).toBe(0)
  })

  // We must enter at least 4 sick leave days before we get any PAID sick leave days.
  it('should return zero if the number of sick leave days is less than 4', () => {
    service.sickLeaveDays = 3
    expect(service.calculate().totalComp).toBe(0)
  })

  // When we enter 4 days, the employer is responsible to pay out 25 euros.
  // The fund is not responsible for paying anything.
  it("if the number of sick leave days is 4, then 25 should be paid out by the employer" +
            " and nothing should be paid out by the fund", () => {
    service.sickLeaveDays = 4
    let compensation = service.calculate()
    expect(compensation.employerComp.compensationAmount).toBe(25)
    expect(compensation.insuranceComp.compensationAmount).toBe(0)
    expect(compensation.totalComp).toBe(25)
  })

  // This test is for the case of 9 days.
  // Days 4 to 8 should be paid for by the employer.
  // Day 9 should be paid by the fund.
  it("if the number of sick leave days is 9, then 125 should be paid out by the employer " +
    "25 should be paid out by the health insurance" +
    "150 should be paid out in total", () => {
    service.sickLeaveDays = 9
    let compensation = service.calculate()
    expect(compensation.employerComp.compensationAmount).toBe(125)
    expect(compensation.insuranceComp.compensationAmount).toBe(25)
    expect(compensation.totalComp).toBe(150)
  })

  // 13 sick leave days = 10 paid sick leave days.
  // since first 3 days are not compensated
  it( " should return 275 if number of sick leave days is 14" +
                "employer compensation should be 125" +
                "fund compensation should be 150", () => {
    service.sickLeaveDays = 13
    let compensation = service.calculate()

    expect(compensation.totalComp).toBe(250)
    expect(compensation.employerComp.compensationAmount).toBe(125)
    expect(compensation.insuranceComp.compensationAmount).toBe(125)
  })

  it("if the user doesn't have tuberculosis the maximum number of paid days is 182" +
                "this means that the compensation should be the same for 183 days, as for 182 days" +
                "we also check that the compensation values are correct", () =>{
    service.hasTuberculosis = false
    service.sickLeaveDays = 182
    let compensationFor182Days = service.calculate();

    service.sickLeaveDays = 183
    let compensationFor183ays = service.calculate();
    expect(compensationFor183ays.employerComp.compensationAmount).toBe(compensationFor182Days.employerComp.compensationAmount)
    expect(compensationFor183ays.insuranceComp.compensationAmount).toBe(compensationFor182Days.insuranceComp.compensationAmount)
    expect(compensationFor183ays.totalComp).toBe(compensationFor182Days.totalComp)
  })

  it("if the user does have tuberculosis the maximum number of paid days is 240" +
                "this means that the compensation should be the same for 241 days, as for 240 days" +
                "we also check that the compensation values are correct", () => {

    service.hasTuberculosis = true
    service.sickLeaveDays = 240
    let compensationFor240Days = service.calculate();

    service.sickLeaveDays = 241
    let compensationFor241Days = service.calculate();
    expect(compensationFor241Days.employerComp.compensationAmount).toBe(compensationFor240Days.employerComp.compensationAmount)
    expect(compensationFor241Days.insuranceComp.compensationAmount).toBe(compensationFor240Days.insuranceComp.compensationAmount)
    expect(compensationFor241Days.totalComp).toBe(compensationFor240Days.totalComp)
  })

  it("if the user is asking for 0 days on sick-leave" +
                "then the compensated days should be 0 for both health insurance and employer", () => {
    service.sickLeaveDays = 0
    let compensationFor0Days = service.calculate()

    expect(compensationFor0Days.employerComp.compensationDays).toBe(0)
    expect(compensationFor0Days.insuranceComp.compensationDays).toBe(0)
    expect(compensationFor0Days.totalDays).toBe(0)
  })

  it("if the user is asking for 4 days on sick-leave" +
    "then the compensated days should be 0 for health insurance and 1 for employer", () => {
    service.sickLeaveDays = 4
    let compensationFor4Days = service.calculate()

    expect(compensationFor4Days.employerComp.compensationDays).toBe(1)
    expect(compensationFor4Days.insuranceComp.compensationDays).toBe(0)
    expect(compensationFor4Days.totalDays).toBe(1)
  })

  it("if the user is asking for 9 days on sick-leave" +
    "then the compensated days should be 1 for health insurance and 5 for employer", () => {
    service.sickLeaveDays = 9
    let compensationFor9Days = service.calculate()

    expect(compensationFor9Days.employerComp.compensationDays).toBe(5)
    expect(compensationFor9Days.insuranceComp.compensationDays).toBe(1)
    expect(compensationFor9Days.totalDays).toBe(6)
  })

  it("if the user is asking for 183 days on sick-leave and does not have tuberculosis" +
    "then the total number of compensation days should be the same as if he had asked for 182 days" +
    "since 182 is the maximum number of days in this case", () => {

    service.sickLeaveDays = 182
    let compensationFor182Days = service.calculate()

    service.sickLeaveDays = 183
    let compensationFor183Days = service.calculate()
    expect(compensationFor183Days.totalDays).toBe(compensationFor182Days.totalDays)
  })

  it("if the user is asking for 241 days on sick-leave and does have tuberculosis" +
    "then the total number of compensation days should be the same as if he had asked for 240 days" +
    "since 240 is the maximum number of days in this case", () => {

    service.sickLeaveDays = 240
    let compensationFor240Days = service.calculate()

    service.sickLeaveDays = 241
    let compensationFor241Days = service.calculate()
    expect(compensationFor241Days.totalDays).toBe(compensationFor240Days.totalDays)
  })
})
