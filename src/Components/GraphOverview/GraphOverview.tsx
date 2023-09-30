import React from "react";
import ReactDOM from "react-dom";
import { IGraphOverviewProps } from "./IGraphOverviewProps";
import { IGraphOverviewStates } from "./IGraphOverviewStates";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import Calculation from "../../Services/Calculation";
import styles from "./graphOverview.module.scss";

export default class GraphOverview extends React.Component<
  IGraphOverviewProps,
  IGraphOverviewStates
> {
  constructor(props: IGraphOverviewProps) {
    super(props);
    this.state = {};
    ChartJS.register(ArcElement, Tooltip, Legend);
  }

  render(): React.ReactNode {
    const cal: Calculation = new Calculation(this.props);
    const emi: number = cal.getEMI(this.props);
    const ci: number = cal.getCI(emi, this.props);
    const data = {
      labels: ["Total interest", "Principle"],
      datasets: [
        {
          label: "Breakups",
          data: [ci, this.props.loanAmount],
          backgroundColor: [
            "rgba(54, 162, 235, 0.8)",
            "rgba(255, 206, 86, 0.8)",
          ],
          borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)"],
          borderWidth: 1,
        },
      ],
    };
    return (
      <div className={styles.graphOverview}>
        <Pie data={data} />
      </div>
    );
  }
}
