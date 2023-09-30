import React from "react";
import ReactDOM from "react-dom";
import { IRepaymentOverviewProps } from "./IRepaymentOverviewProps";
import { IRepaymentOverviewStates } from "./IRepaymentOverviewStates";

export default class RepaymentOverview extends React.Component<
  IRepaymentOverviewProps,
  IRepaymentOverviewStates
> {
  constructor(props: IRepaymentOverviewProps) {
    super(props);
    this.state = {};
  }

  render(): React.ReactNode {
    const totalAmount: string = this.props.roundAmount(this.props.totalAmount);
    const totalInterestWithouttPrePayment: string = this.props.roundAmount(
      this.props.totalInterestWithouttPrePayment
    );
    const totalInterestWitPrePayment: string = this.props.roundAmount(
      this.props.totalInterestWitPrePayment
    );
    const totalinstallmentMonths: string = this.props.roundAmount(
      this.props.totalinstallmentMonths
    );
    const totalSavings: string = this.props.roundAmount(
      this.props.totalSavings
    );

    return (
      <div>
        <div className="table-container">
          <div className="table-row">
            <div className="table-cell textlabel">
              Total amount (with initial interest rate)
            </div>
            <div className="table-cell currencyLabel">{totalAmount}</div>
          </div>
          <div className="table-row">
            <div className="table-cell textlabel">
              Total interest (without prepayment)
            </div>
            <div className="table-cell currencyLabel ">
              {totalInterestWithouttPrePayment}
            </div>
          </div>
          <div className="table-row">
            <div className="table-cell textlabel">
              Total interest (with prepayment)
            </div>
            <div className="table-cell currencyLabel">
              {totalInterestWitPrePayment}
            </div>
          </div>
          <div className="table-row">
            <div className="table-cell textlabel">Total installment months</div>
            <div className="table-cell">{totalinstallmentMonths}</div>
          </div>
          <div className="table-row">
            <div className="table-cell textlabel">
              Total savings on interest
            </div>
            <div className="table-cell currencyLabel">{totalSavings}</div>
          </div>
        </div>
      </div>
    );
  }
}
