import React from "react";
import ReactDOM from "react-dom";
import { ILoanOverviewProps } from "./ILoanOverviewProps";
import { ILoanOverviewStates } from "./ILoanOverviewStates";
import styles from "./LoanOverview.module.scss";
import Calculation from "../../Services/Calculation";

export default class LoanOverview extends React.Component<
  ILoanOverviewProps,
  ILoanOverviewStates
> {
  cal: Calculation;
  constructor(props: ILoanOverviewProps) {
    super(props);
    // this.state = {
    //   emi: 0,
    //   totalInterest: 0,
    //   principalAmount: Number(props.loanAmount),
    // };

    this.cal = new Calculation(props);
    const emi = this.cal.getEMI(props);
    this.state = {
      emi: emi,
      totalInterest: this.cal.getCI(emi, props),
      principalAmount: Number(props.loanAmount),
    };
  }

  // componentWillReceiveProps(props: ILoanOverviewProps) {
  //   const cal = new Calculation(props);
  //   const emi = cal.getEMI(props);
  //   this.setState({
  //     emi: emi,
  //     totalInterest: cal.getCI(emi, props),
  //     principalAmount: Number(props.loanAmount),
  //   });
  // }

  // private getEMI(loanParams: ILoanOverviewProps): number {
  //   let { loanAmount, interestRate, loanTenure } = loanParams;
  //   loanTenure = 12 * loanTenure;
  //   interestRate = interestRate / 100;
  //   loanAmount = Number(loanAmount);
  //   const roi = Math.pow(1 + interestRate / 12, loanTenure);
  //   const emi: number = (((loanAmount * interestRate) / 12) * roi) / (roi - 1);
  //   return Math.round(emi);
  // }

  // private getCI(emi: number, loanParams: ILoanOverviewProps): number {
  //   const loanAmount: number = Number(loanParams.loanAmount);
  //   const loanTenure: number = Number(loanParams.loanTenure) * 12;
  //   const ci = emi * loanTenure - loanAmount;
  //   return Math.round(ci);
  // }

  render(): React.ReactNode {
    return (
      <div>
        <div className="textlabel">
          Calculations are performed with Interest Rate ={" "}
          {this.props.interestRate + "% p.a."} and without part payment.
        </div>
        <div className="table-container">
          <div className="table-row">
            <div className="table-cell textlabel">EMI</div>
            <div className="table-cell textlabel currencyLabel">
              {this.cal.roundAmount(this.state.emi)}
            </div>
          </div>
          <div className="table-row">
            <div className="table-cell textlabel">Total interest payable</div>
            <div className="table-cell textlabel currencyLabel">
              {this.cal.roundAmount(this.state.totalInterest)}
            </div>
          </div>
          <div className="table-row">
            <div className="table-cell textlabel">Principal amount</div>
            <div className="table-cell textlabel currencyLabel">
              {this.cal.roundAmount(this.state.principalAmount)}
            </div>
          </div>
          <div className="table-row">
            <div className="table-cell textlabel">Total payment</div>
            <div className="table-cell textlabel currencyLabel">
              {this.cal.roundAmount(
                this.state.totalInterest + this.state.principalAmount
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
