import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { KPIData } from '../api/types';

interface KPICardsProps {
  data: KPIData | null;
  loading?: boolean;
}

const KPICards: React.FC<KPICardsProps> = ({ data, loading = false }) => {
  const formatPercentage = (value: number, total: number): string => {
    if (total === 0) return '0%';
    return `${Math.round((value / total) * 100)}%`;
  };

  const KPICard: React.FC<{
    title: string;
    value: number;
    percentage?: string;
    variant: string;
    loading: boolean;
  }> = ({ title, value, percentage, variant, loading }) => (
    <Col md={3} className="mb-3">
      <Card className={`kpi-card h-100 border-${variant}`}>
        <Card.Body className="text-center">
          <Card.Title className={`text-${variant} mb-1`}>{title}</Card.Title>
          {loading ? (
            <div className="loading-skeleton" style={{ height: '2rem', borderRadius: '4px' }} />
          ) : (
            <>
              <h2 className={`text-${variant} mb-0`}>{value.toLocaleString()}</h2>
              {percentage && (
                <small className="text-muted">{percentage} of total</small>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </Col>
  );

  return (
    <Row className="mb-4">
      <KPICard
        title="Total Processes"
        value={data?.total || 0}
        variant="primary"
        loading={loading}
      />
      <KPICard
        title="Success"
        value={data?.success || 0}
        percentage={data ? formatPercentage(data.success, data.total) : undefined}
        variant="success"
        loading={loading}
      />
      <KPICard
        title="Failed"
        value={data?.failed || 0}
        percentage={data ? formatPercentage(data.failed, data.total) : undefined}
        variant="danger"
        loading={loading}
      />
      <KPICard
        title="In Progress"
        value={data?.inProgress || 0}
        percentage={data ? formatPercentage(data.inProgress, data.total) : undefined}
        variant="warning"
        loading={loading}
      />
    </Row>
  );
};

export default KPICards;