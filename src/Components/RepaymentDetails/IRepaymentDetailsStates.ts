export interface IRepaymentDetailsStates {
  prepaymentAmts: IPrePayment[];
  loanAmount: number;
  interestRate: number;
  loanTenure: number;
  newInterestRates: INewInterestRates[];
}

export interface IPrePayment {
  monthNumber: number;
  payment: number | undefined;
}

export interface INewInterestRates {
  monthNumber: number;
  newInterestRate: number | undefined;
}
