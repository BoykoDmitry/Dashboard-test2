import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Card } from 'react-bootstrap';
import { OutcomesMetricsResponse } from '../api/types';
import '../utils/chartConfig';

interface OutcomeChartProps {
  data: OutcomesMetricsResponse | null;
  loading?: boolean;
  error?: string | null;
}

const OutcomeChart: React.FC<OutcomeChartProps> = ({ data, loading = false, error }) => {
  const chartData = {
    labels: ['Success', 'Failed'],
    datasets: [
      {
        data: data ? [data.Success, data.Failed] : [0, 0],
        backgroundColor: [
          'rgba(40, 167, 69, 0.8)',
          'rgba(220, 53, 69, 0.8)',
        ],
        borderColor: [
          'rgba(40, 167, 69, 1)',
          'rgba(220, 53, 69, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Success vs Failed (Excluding In Progress)',
      },
    },
  };

  return (
    <Card className="chart-container">
      <Card.Body>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <div className="loading-skeleton w-100" style={{ height: '300px' }} />
          </div>
        ) : error ? (
          <div className="error-banner text-center">
            <p className="mb-2">Failed to load outcome metrics</p>
            <button className="btn btn-sm btn-outline-danger">Retry</button>
          </div>
        ) : (
          <div style={{ height: '300px' }} role="img" aria-label="Outcome distribution donut chart showing success and failure rates">
            <Doughnut data={chartData} options={options} />
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default OutcomeChart;