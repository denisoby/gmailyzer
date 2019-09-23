import React from 'react';
import { PeriodSelector } from '../PeriodSelector/PeriodSelector';
import { FoldersListDetailed } from '../FoldersListDetailed/FoldersListDetailed';
import ChartComponent, { Doughnut, Line } from 'react-chartjs-2';
import styles from './Dashboard.module.css';

// todo future typing
type DashboardProps = {
  labels: any;
  groupedCount: {[index: string]: number}
};
type FormState = {};

export class Dashboard extends React.Component<DashboardProps, FormState> {
  render() {
    const periodCount = Object.values(this.props.groupedCount || {}).reduce((acc, item) => acc + item, 0);

    const requests = Object.entries(this.props.labels).reduce(
      (acc: any, [labelId, label]) =>
        label.count
          ? [
              ...acc,
              {
                ...label,
                change: -3.54
              }
            ]
          : acc,
      []
    );

    const groupedCount = this.props.groupedCount || {};
    const chartLabels = Object.keys(groupedCount).reverse();
    const chartValues = Object.values(groupedCount).reverse();
    debugger;

    const chartData = {
      labels: chartLabels,
      // labels: [
      //   'Monday',
      //   'Tuesday',
      //   'Wednesday',
      //   'Thursday',
      //   'Friday',
      //   'Saturday',
      //   'Sunday'
      // ],
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: 'rgba(232, 182, 62, 0.2)',
          borderColor: '#F1B500',
          pointBorderWidth: 3,
          pointRadius: 5,
          pointBackgroundColor: 'white',
          pointHoverBorderWidth: 3,
          pointHoverRadius: 7,
          pointHoverBackgroundColor: 'white',
          pointHoverBorderColor: '#F1B500',
          data: chartValues // [0, 10, 5, 2, 20, 30, 45]
        }
      ]
    };

    const chartOptions = {
      responsive: false,
      legend: false,
      scales: {
        xAxes: [
          {
            gridLines: {
              display: true
            }
          }
        ],
        yAxes: [
          {
            gridLines: {
              display: false
            }
          }
        ]
      }
    };

    return (
      <div className={styles.Dashboard}>
        <div className="heading">
          <h1>Request Aggregator Dashboard</h1>
          <PeriodSelector periodCount={periodCount} />
        </div>
        <div className="container">
          <div className="chart">
            <Line
              data={chartData}
              options={chartOptions}
              height={500}
              width={1000}
            />
          </div>
          <FoldersListDetailed requests={requests} />
        </div>
      </div>
    );
  }
}
