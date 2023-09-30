import React, { ChangeEvent } from "react";
import ReactDOM from "react-dom";
import { ILoanDetailsProps } from "./ILoanDetailsProps";
import { ILoanDetailsStates } from "./ILoanDetailsStates";
import LoanOverview from "../LoanOverview/LoanOverview";
import GraphOverview from "../GraphOverview/GraphOverview";
import RepaymentDetails from "../RepaymentDetails/RepaymentDetails";
import RepaymentChart from "../RepaymentChart/RepaymentChart";
import styles from "./LoanDetails.module.scss";

export default class LoanDetails extends React.Component<
  ILoanDetailsProps,
  ILoanDetailsStates
> {
  private months: string[] = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  private years: number[] = Array(100)
    .fill(undefined)
    .map((element, index) => index + 1990);

  constructor(props: ILoanDetailsProps) {
    super(props);
    this.state = {
      loanAmount: 6950000,
      interestRate: 9.25,
      loanTenure: 30,
      firstInstallmentDate: new Date("2021-07-15"),
      isState: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  // static getDerivedStateFromProps(
  //   props: ILoanDetailsProps,
  //   state: ILoanDetailsStates
  // ): ILoanDetailsStates {
  //   return {
  //     loanAmount: 6950000,
  //     interestRate: 9.25,
  //     loanTenure: 30,
  //     firstInstallmentDate: new Date("2021-07-15"),
  //   };
  // }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    this.setState({
      ...this.state,
      [event.target.name]: value,
      isState: !this.state.isState,
    });
  }

  render(): React.ReactNode {
    const months = this.months.map((item) => {
      return <option value={item}>{item}</option>;
    });
    const years = this.years.map((item) => {
      return <option value={item}>{item}</option>;
    });
    return (
      <React.Fragment>
        <div className={styles.mainContainer}>
          <div className={styles.loanDetailsContainer}>
            <fieldset className={styles.loanDetails}>
              <legend className="header">Inputs</legend>
              <div className="table-container">
                <div className="table-row">
                  <div className="table-cell textlabel">Loan Amount (Rs.)</div>
                  <div className="table-cell">
                    <input
                      type="number"
                      id="idLoanAmount"
                      name="loanAmount"
                      value={this.state.loanAmount}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="table-row">
                  <div className="table-cell textlabel">
                    Interest Rate (%p.a.)
                  </div>
                  <div className="table-cell">
                    <input
                      type="number"
                      id="idInterestRate"
                      name="interestRate"
                      value={this.state.interestRate}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="table-row">
                  <div className="table-cell textlabel">
                    Loan Tenure (Years)
                  </div>
                  <div className="table-cell">
                    <input
                      type="number"
                      id="idLoanTenure"
                      name="loanTenure"
                      value={this.state.loanTenure}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="table-row">
                  <div className="table-cell textlabel">
                    Start month and year of 1st installment
                  </div>
                  <div className="table-cell">
                    <select defaultValue="Jul">{months}</select>{" "}
                    <select defaultValue="2021">{years}</select>
                  </div>
                </div>
              </div>
            </fieldset>
            <fieldset className={styles.loanOverview}>
              <legend>Results</legend>
              <LoanOverview key={this.state.isState ? 1 : 0} {...this.state} />
            </fieldset>
          </div>
          <div className={styles.graphOverview}>
            <fieldset>
              <legend>Graph overview</legend>
              <GraphOverview key={this.state.isState ? 1 : 0} {...this.state} />
            </fieldset>
          </div>
        </div>
        <div className={styles.loanRepayment}>
          <RepaymentDetails key={this.state.isState ? 1 : 0} {...this.state} />
        </div>
      </React.Fragment>
    );
  }
}
