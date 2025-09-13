import React from 'react';
import { Line } from 'react-chartjs-2';
import { Card } from 'react-bootstrap';
import { DailyBucket } from '../api/types';
import '../utils/chartConfig';

interface DailyChartProps {
  data: DailyBucket[] | null;
  loading?: boolean;
  error?: string | null;
}

const DailyChart: React.FC<DailyChartProps> = ({ data, loading = false, error }) => {
  const chartData = {
    labels: data?.map(bucket => bucket.Date) || [],
    datasets: [
      {
        label: 'Processes per Day',
        data: data?.map(bucket => bucket.Count) || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Daily Process Volume',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
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
            <p className="mb-2">Failed to load daily metrics</p>
            <button className="btn btn-sm btn-outline-danger">Retry</button>
          </div>
        ) : (
          <div style={{ height: '300px' }} role="img" aria-label="Daily metrics line chart showing onboarding process trends over time">
            <Line data={chartData} options={options} />
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default DailyChart;