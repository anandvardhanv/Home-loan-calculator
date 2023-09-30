export interface ICalculation {
  loanAmount: number;
  interestRate: number;
  loanTenure: number;
}

export default class Calculation {
  private loanDetails: ICalculation;
  constructor(loanDetails: ICalculation) {
    this.loanDetails = loanDetails;
  }

  public getEMI(loanParams: ICalculation): number {
    let { loanAmount, interestRate, loanTenure } = loanParams;
    loanTenure = 12 * loanTenure;
    interestRate = interestRate / 100;
    loanAmount = Number(loanAmount);
    const roi = Math.pow(1 + interestRate / 12, loanTenure);
    const emi: number = (((loanAmount * interestRate) / 12) * roi) / (roi - 1);
    return emi;
  }

  public getCI(emi: number, loanParams: ICalculation): number {
    const loanAmount: number = Number(loanParams.loanAmount);
    const loanTenure: number = Number(loanParams.loanTenure) * 12;
    const ci = emi * loanTenure - loanAmount;
    return ci;
  }

  public roundAmount(amt: number): string {
    // return Math.round(amt).toLocaleString("en-IN");
    return amt.toLocaleString("en-IN");
  }
}
