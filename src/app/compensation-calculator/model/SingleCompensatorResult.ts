export class SingleCompensatorResult {
  constructor(
    public readonly compensator: string,
    public readonly compensationAmount: number,
    public readonly compensationDays: number) {}
}
