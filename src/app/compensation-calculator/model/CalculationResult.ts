import {SingleCompensatorResult} from "./SingleCompensatorResult";

export class CalculationResult {

  constructor(
    public readonly totalComp: number,
    public readonly totalDays: number,
    public readonly employerComp: SingleCompensatorResult,
    public readonly insuranceComp: SingleCompensatorResult
  ) {}

}
