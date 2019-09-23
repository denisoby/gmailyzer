import React from 'react';
import { PeriodSelector } from '../PeriodSelector/PeriodSelector';
import { FoldersListDetailed } from '../FoldersListDetailed/FoldersListDetailed';
import ChartComponent, { Doughnut, Line } from 'react-chartjs-2';
import styles from './Dashboard.module.css';

// todo future typing
type DashboardProps = {
  labels: any;
};
type FormState = {};

export class Dashboard extends React.Component<DashboardProps, FormState> {
  render() {
    const periodCount = 123;

    const requests = [
      { name: 'Paid Time Off', count: 187, change: 3.21 },
      { name: 'Subscription Reimbursement', count: 86, change: -11.03 },
      { name: 'Budget Approval', count: 38, change: 6.95 },
      { name: 'Request A', count: 21, change: 3.21 },
      { name: 'Request B', count: 10, change: 3.21 },
      { name: 'Request C', count: 7, change: 3.21 },
      { name: 'Paid Time Off 2', count: 187, change: 3.21 },
      { name: 'Paid Time Off 3', count: 187, change: 3.21 },
      { name: 'Paid Time Off 4', count: 187, change: 3.21 }
    ];

    const chartData = {
      labels: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ],
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
          data: [0, 10, 5, 2, 20, 30, 45]
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
