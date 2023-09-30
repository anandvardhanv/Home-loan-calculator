export interface IRepaymentOverviewProps {
  totalAmount: number;
  totalInterestWithouttPrePayment: number;
  totalInterestWitPrePayment: number;
  totalinstallmentMonths: number;
  totalSavings: number;
  roundAmount: (num: number) => string;
}
