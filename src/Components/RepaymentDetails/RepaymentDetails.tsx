import React from "react";
import { ILoanOverviewProps } from "../LoanOverview/ILoanOverviewProps";
import RepaymentOverview from "../RepaymentDetailsOverview/RepaymentOverview";
import { IRepaymentDetailsProps } from "./IRepaymentDetailsProps";
import {
  IRepaymentDetailsStates,
  IPrePayment,
  INewInterestRates,
} from "./IRepaymentDetailsStates";
import styles from "./RepaymentSchedule.module.scss";
import { IRepaymentOverviewProps } from "../RepaymentDetailsOverview/IRepaymentOverviewProps";
import Calculation from "../../Services/Calculation";
import RepaymentChart from "../RepaymentChart/RepaymentChart";

interface IMonthlyPayoutSchedule {
  month: number;
  principalPmt: number;
  interestPmt: number;
  totalPayment: number;
  principleOutstanding: number;
  cumulativeInterest: number;
  cumulativePrincipal: number;
  prePayments: number;
  newInterestRate: number;
}

export default class RepaymentDetails extends React.Component<
  IRepaymentDetailsProps,
  IRepaymentDetailsStates
> {
  emi: number = 0;
  loanPaymentSchedule: IMonthlyPayoutSchedule[] = [];
  totalinstallmentMonths: number = 0;
  cal: Calculation;
  constructor(props: IRepaymentDetailsProps) {
    super(props);
    this.cal = new Calculation(props);
    const prepaymentAmts = [];
    const newInterestRates = [];
    for (let i = 1; i <= props.loanTenure * 12; i++) {
      prepaymentAmts.push({ monthNumber: i, payment: undefined });
      newInterestRates.push({ monthNumber: i, newInterestRate: undefined });
    }
    this.state = {
      prepaymentAmts: prepaymentAmts,
      loanAmount: props.loanAmount,
      interestRate: props.interestRate,
      loanTenure: props.loanTenure,
      newInterestRates: newInterestRates,
    };

    this.getLoanPaymentSchedule.bind(this);

    this.handleChange.bind(this);
    this.handleChangeInterestRates.bind(this);
    this.getRepaymentOverview.bind(this);
    this.totalinstallmentMonths = this.props.loanTenure * 12;

    this.loanPaymentSchedule = this.getLoanPaymentSchedule(this.props);
    // const prepaymentAmts = [];
    for (let i = 1; i <= this.props.loanTenure * 12; i++) {
      prepaymentAmts.push({ monthNumber: i, payment: 0 });
      newInterestRates.push({ monthNumber: i, newInterestRate: undefined });
    }
    this.state = {
      prepaymentAmts: prepaymentAmts,
      loanAmount: this.props.loanAmount,
      interestRate: this.props.interestRate,
      loanTenure: this.props.loanTenure,
      newInterestRates: newInterestRates,
    };
  }

  componentWillReceiveProps(props: ILoanOverviewProps) {
    this.loanPaymentSchedule = this.getLoanPaymentSchedule(props);
    const prepaymentAmts = [];
    const newInterestRates = [];
    for (let i = 1; i <= props.loanTenure * 12; i++) {
      prepaymentAmts.push({ monthNumber: i, payment: 0 });
      newInterestRates.push({ monthNumber: i, newInterestRate: undefined });
    }
    this.setState({
      prepaymentAmts: prepaymentAmts,
      loanAmount: props.loanAmount,
      interestRate: props.interestRate,
      loanTenure: props.loanTenure,
      newInterestRates: newInterestRates,
    });
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>, month: number) {
    // console.log("Index : ", index);
    const value: number | undefined =
      event.target.value == "" ? undefined : Number(event.target.value);
    let prepaymentAmts = this.state.prepaymentAmts;
    const found = prepaymentAmts.filter(
      (item: IPrePayment, index: number) => item.monthNumber === month
    );

    if (found.length > 0) {
      prepaymentAmts.map((item: IPrePayment, index: number) => {
        if (index + 1 === month) {
          item.payment = value;
          return;
        }
      });
    } else {
      prepaymentAmts.push({ monthNumber: month, payment: value });
    }
    this.loanPaymentSchedule = this.getLoanPaymentSchedule(this.props);
    this.setState({
      ...this.state,
      [event.target.name]: prepaymentAmts,
    });
  }

  handleChangeInterestRates(
    event: React.ChangeEvent<HTMLInputElement>,
    month: number
  ) {
    const value: number | undefined =
      event.target.value == "" ? undefined : Number(event.target.value);
    let interestRates = this.state.newInterestRates;
    const found = interestRates.filter(
      (item: INewInterestRates, index: number) => item.monthNumber === month
    );

    if (found.length > 0) {
      interestRates.map((item: INewInterestRates, index: number) => {
        if (index + 1 === month) {
          item.newInterestRate = value;
          return;
        }
      });
    } else {
      interestRates.push({ monthNumber: month, newInterestRate: value });
    }
    this.loanPaymentSchedule = this.getLoanPaymentSchedule(this.props);
    this.setState({
      ...this.state,
      [event.target.name]: interestRates,
    });
  }

  private getLoanPaymentSchedule(
    loanParams: ILoanOverviewProps
  ): IMonthlyPayoutSchedule[] {
    let totalMonths = loanParams.loanTenure * 12;
    const paymentSchedule: IMonthlyPayoutSchedule[] = [];
    this.emi = this.getEMI(loanParams);
    let totalInstallments: number = 0;
    let currentMonthInterestRate: number = loanParams.interestRate / 100;
    let po: number = loanParams.loanAmount;
    for (let i = 1; i <= totalMonths; i++) {
      const prepaymentItem: IPrePayment[] = this.state.prepaymentAmts.filter(
        (item: IPrePayment) => item.monthNumber == i
      );
      let prepaymentAmt: number = 0;
      if (prepaymentItem.length !== 0) {
        prepaymentAmt =
          prepaymentItem[0].payment === undefined ||
          prepaymentItem[0].payment === null
            ? 0
            : Number(prepaymentItem[0].payment);
      }

      const newInterestRateItem: INewInterestRates[] =
        this.state.newInterestRates.filter(
          (item: INewInterestRates) => item.monthNumber == i
        );

      if (newInterestRateItem.length !== 0) {
        currentMonthInterestRate =
          newInterestRateItem[0].newInterestRate === undefined ||
          newInterestRateItem[0].newInterestRate === null
            ? currentMonthInterestRate
            : Number(newInterestRateItem[0].newInterestRate / 100);
      }
      // this is to be changed later on
      // current month's outstading before the interest is accrued'
      const principleOutstandingTillLastMonth =
        i == 1
          ? loanParams.loanAmount
          : paymentSchedule[i - 2].principleOutstanding;
      const principleOutstanding: number = this.getprincipleOutstanding(
        principleOutstandingTillLastMonth,
        prepaymentAmt
      );

      // current month emi's interest component
      let interestComponent: number = this.getInterestComponent(
        this.emi,
        currentMonthInterestRate,
        principleOutstanding
      );

      // current month emi's principle component
      let principleComponent: number = this.getPrincipalComponent(
        this.emi,
        interestComponent
      );

      // cumulative interest
      const interestTillLastMonth =
        i == 1 ? 0 : paymentSchedule[i - 2].cumulativeInterest;
      let cumulativeInterest: number = this.getCumulativeInterest(
        interestTillLastMonth,
        interestComponent
      );

      let cumulativePrincipal: number = this.getCumulativePrincipal(
        loanParams.loanAmount,
        principleOutstanding
      );

      // check if principle outstanding is -ve
      let principalPmt: number = principleComponent + prepaymentAmt;
      po = principleOutstanding - principleComponent;
      let cumP: number = cumulativePrincipal + principleComponent;
      let emi = this.emi;
      if (po < 0) {
        po = 0;
        totalInstallments = totalInstallments !== 0 ? i : totalInstallments;
        if (paymentSchedule[i - 2].principleOutstanding == 0) {
          emi = 0;
          principalPmt = 0;
          interestComponent = 0;
          cumulativeInterest = 0;
          cumP = 0;
          prepaymentAmt = 0;
          currentMonthInterestRate = 0;
        }
      }

      paymentSchedule.push({
        month: i,
        principalPmt: principalPmt,
        interestPmt: interestComponent,
        totalPayment: emi,
        principleOutstanding: po,
        cumulativeInterest: cumulativeInterest,
        cumulativePrincipal: cumP,
        prePayments: prepaymentAmt,
        newInterestRate: currentMonthInterestRate,
      });
      if (po > 0 && i == totalMonths) {
        totalMonths += 1;
      }
    }

    this.totalinstallmentMonths = totalInstallments;

    return paymentSchedule;
  }

  private getEMI(loanParams: ILoanOverviewProps): number {
    let { loanAmount, interestRate, loanTenure } = loanParams;
    loanTenure = 12 * loanTenure;
    interestRate = interestRate / 100;
    loanAmount = Number(loanAmount);
    const roi = Math.pow(1 + interestRate / 12, loanTenure);
    const emi: number = (((loanAmount * interestRate) / 12) * roi) / (roi - 1);
    return this.roundNumber(emi);
  }

  private getPrincipalComponent(
    emi: number,
    interestComponent: number
  ): number {
    const principle: number = emi - interestComponent;
    return this.roundNumber(principle);
  }

  /**
   * The interest is accrued at the last day of the month.
   * @param emi : emi being paid
   * @param interestRate : current month's interest rate
   * @param outstandingPrinciple : outstadning principle amount
   * @returns
   */
  private getInterestComponent(
    emi: number,
    interestRate: number,
    outstandingPrinciple: number
  ): number {
    const amt: number = (outstandingPrinciple * interestRate) / 12;
    return this.roundNumber(amt);
  }

  /**
   *
   * @param remainingPrincipal : remaining principal till last month
   * @param principalComponent : current month principal component of EMI
   * @param prepayment: prepayment done in current month
   * @returns
   */
  private getprincipleOutstanding(
    principleOutstanding: number,
    prepayment: number
  ): number {
    const amt: number = principleOutstanding - prepayment;
    return this.roundNumber(amt);
  }

  /**
   *
   * @param currentTotalInterest : total cumulative interest till last month
   * @param interestComponent : interest component of current month of EMI
   * @returns
   */
  private getCumulativeInterest(
    currentTotalInterest: number,
    interestComponent: number
  ): number {
    const amt: number = currentTotalInterest + interestComponent;
    return this.roundNumber(amt);
  }

  /**
   *
   * @param paidPrincipal : Paid principal till last month
   * @param principalComponent : current month principal component
   * @param prepayment : current month pre-payment amount
   * @returns
   */
  private getCumulativePrincipal(
    loanAmt: number,
    outstandingPrinciple: number
  ): number {
    const amt: number = loanAmt - outstandingPrinciple;
    return this.roundNumber(amt);
  }

  private roundNumber(amt: number): number {
    return amt;
  }

  private getLastNonZeroPrincipleOutstandingItem(
    schedule: IMonthlyPayoutSchedule[]
  ): IMonthlyPayoutSchedule {
    let item: IMonthlyPayoutSchedule = schedule[schedule.length - 1];
    for (let i = schedule.length - 1; i > -1; i--) {
      if (
        schedule[i].principleOutstanding === 0 &&
        schedule[i - 1].principleOutstanding > 0
      ) {
        item = schedule[i];
        break;
      }
    }
    return item;
  }

  // this is pending
  private getRepaymentOverview(
    totalAmountWithPrepayment: number,
    interestWithPrepayment: number
  ): IRepaymentOverviewProps {
    let overview: IRepaymentOverviewProps = {
      totalAmount: 0,
      totalInterestWithouttPrePayment: 0,
      totalInterestWitPrePayment: interestWithPrepayment,
      totalinstallmentMonths: 0,
      totalSavings: 0,
      roundAmount: this.cal.roundAmount,
    };
    if (this.loanPaymentSchedule.length > 0) {
      const info: any = this.getLoanPaymentScheduleWithoutPrepayment(
        this.props
      );
      const paymentSchedule: IMonthlyPayoutSchedule[] = info.paymentSchedule;
      const totalInstallments: number = info.totalInstallments;

      const item: IMonthlyPayoutSchedule =
        this.getLastNonZeroPrincipleOutstandingItem(paymentSchedule);
      overview.totalAmount =
        item.cumulativeInterest + Number(this.props.loanAmount);
      overview.totalInterestWithouttPrePayment = item.cumulativeInterest;

      overview.totalinstallmentMonths = totalInstallments;
      overview.totalSavings =
        overview.totalInterestWithouttPrePayment -
        overview.totalInterestWitPrePayment;
    }

    return overview;
  }

  private getLoanPaymentScheduleWithoutPrepayment(
    loanParams: ILoanOverviewProps
  ): any {
    let totalMonths = loanParams.loanTenure * 12;
    const paymentSchedule: IMonthlyPayoutSchedule[] = [];
    this.emi = this.getEMI(loanParams);
    let totalInstallments: number = 0;
    let prepaymentAmt: number = 0;
    let currentMonthInterestRate = loanParams.interestRate / 100;
    let po: number = loanParams.loanAmount;
    for (let i = 1; i <= totalMonths; i++) {
      const principleOutstandingTillLastMonth =
        i == 1
          ? loanParams.loanAmount
          : paymentSchedule[i - 2].principleOutstanding;

      let prepaymentAmt: number = 0;

      const newInterestRateItem: INewInterestRates[] =
        this.state.newInterestRates.filter(
          (item: INewInterestRates) => item.monthNumber == i
        );

      if (newInterestRateItem.length !== 0) {
        currentMonthInterestRate =
          newInterestRateItem[0].newInterestRate === undefined ||
          newInterestRateItem[0].newInterestRate === null
            ? currentMonthInterestRate
            : Number(newInterestRateItem[0].newInterestRate / 100);
      }
      const principleOutstanding: number = this.getprincipleOutstanding(
        principleOutstandingTillLastMonth,
        prepaymentAmt
      );

      // current month emi's interest component
      let interestComponent: number = this.getInterestComponent(
        this.emi,
        currentMonthInterestRate,
        principleOutstanding
      );

      // current month emi's principle component
      let principleComponent: number = this.getPrincipalComponent(
        this.emi,
        interestComponent
      );

      // cumulative interest
      const interestTillLastMonth =
        i == 1 ? 0 : paymentSchedule[i - 2].cumulativeInterest;
      let cumulativeInterest: number = this.getCumulativeInterest(
        interestTillLastMonth,
        interestComponent
      );

      let cumulativePrincipal: number = this.getCumulativePrincipal(
        loanParams.loanAmount,
        principleOutstanding
      );

      // check if principle outstanding is -ve
      let principalPmt: number = principleComponent + prepaymentAmt;
      po = principleOutstanding - principleComponent;
      let cumP: number = cumulativePrincipal + principleComponent;
      let emi = this.emi;
      if (po < 0) {
        po = 0;
        totalInstallments = totalInstallments !== 0 ? i : totalInstallments;
        if (paymentSchedule[i - 2].principleOutstanding == 0) {
          emi = 0;
          principalPmt = 0;
          interestComponent = 0;
          cumulativeInterest = 0;
          cumP = 0;
          prepaymentAmt = 0;
          currentMonthInterestRate = 0;
        }
      } else {
        totalInstallments = i;
      }

      paymentSchedule.push({
        month: i,
        principalPmt: principalPmt,
        interestPmt: interestComponent,
        totalPayment: emi,
        principleOutstanding: po,
        cumulativeInterest: cumulativeInterest,
        cumulativePrincipal: cumP,
        prePayments: prepaymentAmt,
        newInterestRate: currentMonthInterestRate,
      });

      if (po > 0 && i == totalMonths) {
        totalMonths += 1;
      }
    }

    return {
      paymentSchedule: paymentSchedule,
      totalInstallments: totalInstallments,
    };
  }

  render(): React.ReactNode {
    let principlePmt: number = 0;
    let interestPmt: number = 0;
    let totalPayment: number = 0;
    let prePayments: number = 0;
    let totalInstallmentMonths: number = 0;
    const monthlyPaymentSchedule: React.ReactElement[] =
      this.loanPaymentSchedule.map(
        (item: IMonthlyPayoutSchedule, index: number) => {
          principlePmt += item.principalPmt;
          interestPmt += item.interestPmt;
          totalPayment += item.totalPayment;

          prePayments += item.prePayments;
          const pp = this.cal.roundAmount(item.principalPmt);
          const int = this.cal.roundAmount(item.interestPmt);
          const tp = this.cal.roundAmount(item.totalPayment);
          const po = this.cal.roundAmount(item.principleOutstanding);
          const cumInt = this.cal.roundAmount(item.cumulativeInterest);
          const cumP = this.cal.roundAmount(item.cumulativePrincipal);
          totalInstallmentMonths += po === "0" ? 0 : 1;
          return (
            <div className={styles.paymentRow}>
              <div>{item.month}</div>
              <div className="currencyLabel">{pp}</div>
              <div className="currencyLabel">{int}</div>
              <div className="currencyLabel">{tp}</div>
              <div className="currencyLabel">{po}</div>
              <div className="currencyLabel">{cumInt}</div>
              <div className="currencyLabel">{cumP}</div>
              <div>
                <input
                  type="number"
                  name="prepaymentAmts"
                  key={this.state.prepaymentAmts[index].monthNumber}
                  value={this.state.prepaymentAmts[index].payment}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    this.handleChange(
                      e,
                      this.state.prepaymentAmts[index].monthNumber
                    )
                  }
                />
              </div>
              <div>
                <input
                  type="number"
                  name="newInterestRates"
                  key={this.state.prepaymentAmts[index].monthNumber}
                  value={this.state.newInterestRates[index].newInterestRate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    this.handleChangeInterestRates(
                      e,
                      this.state.newInterestRates[index].monthNumber
                    )
                  }
                />
              </div>
            </div>
          );
        }
      );

    const paymentOverview: IRepaymentOverviewProps = this.getRepaymentOverview(
      totalPayment,
      interestPmt
    );

    paymentOverview.totalinstallmentMonths =
      totalInstallmentMonths > 0
        ? totalInstallmentMonths + 1
        : totalInstallmentMonths;

    return (
      <React.Fragment>
        <fieldset>
          <legend> Monthly Payment Schedules</legend>
          <div className={styles.monthlyPaymentSheduleContainer}>
            <div className={styles.header + " " + styles.paymentRow}>
              <div className="textlabel">Month</div>
              <div className="textlabel">Prinicipal Pmt (P)</div>
              <div className="textlabel">Interest Pmt (I)</div>
              <div className="textlabel">Total Payment (P+I)</div>
              <div className="textlabel">Principal Outstanding</div>
              <div className="textlabel">Cumulative Interest</div>
              <div className="textlabel">Cumulative Principal</div>
              <div className="textlabel">Prepayments (If any)</div>
              <div className="textlabel">New Interest Rate (If any)</div>
            </div>
            {monthlyPaymentSchedule}
            <div className={styles.footer + " " + styles.paymentRow}>
              <div>Total</div>
              <div>{this.cal.roundAmount(principlePmt)}</div>
              <div>{this.cal.roundAmount(interestPmt)}</div>
              <div>{this.cal.roundAmount(totalPayment)}</div>
              <div></div>
              <div></div>
              <div></div>
              <div>{this.cal.roundAmount(prePayments)}</div>
              <div></div>
            </div>
          </div>
        </fieldset>
        <div className={styles.repaymentOverviewContainer}>
          <fieldset>
            <legend> Monthly Payment Schedules overview</legend>
            <RepaymentOverview
              {...paymentOverview}
              roundAmount={this.cal.roundAmount}
              key={this.state.prepaymentAmts.length}
            />
          </fieldset>

          <fieldset className={styles.repaymentchart}>
            <legend>Repayment Schedule Overview</legend>
            <RepaymentChart
              key={this.state.prepaymentAmts.length}
              {...this.state}
            />
          </fieldset>
        </div>
      </React.Fragment>
    );
  }
}
