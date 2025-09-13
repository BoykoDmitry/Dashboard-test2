import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Badge, Button, Alert } from 'react-bootstrap';
import { format } from 'date-fns';
import { useApiClient } from '../hooks/useApiClient';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { ProcessDetail } from '../api/types';

const ProcessDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const apiClient = useApiClient();
  const navigate = useNavigate();
  
  const [processDetail, setProcessDetail] = useState<ProcessDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    const fetchProcessDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.getOnboardingById(id);
        setProcessDetail(response.Data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch process details');
      } finally {
        setLoading(false);
      }
    };

    fetchProcessDetail();
  }, [id, navigate]);

  const getStatusVariant = (status: string): string => {
    switch (status) {
      case 'success': return 'success';
      case 'failed': return 'danger';
      case 'inprogress': return 'warning';
      default: return 'secondary';
    }
  };

  const getDevicePlatform = (platform?: number): string => {
    switch (platform) {
      case 1: return 'Android';
      case 2: return 'iOS';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Process Details</h2>
          <Button variant="outline-secondary" onClick={() => navigate('/')}>
            ← Back to Dashboard
          </Button>
        </div>
        <Card>
          <Card.Body className="text-center py-5">
            <LoadingSpinner size="lg" text="Loading process details..." />
          </Card.Body>
        </Card>
      </div>
    );
  }

  if (error || !processDetail) {
    return (
      <div>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Process Details</h2>
          <Button variant="outline-secondary" onClick={() => navigate('/')}>
            ← Back to Dashboard
          </Button>
        </div>
        <ErrorAlert 
          error={error || 'Process not found'} 
          onRetry={() => window.location.reload()} 
        />
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Process Details</h2>
        <Button variant="outline-secondary" onClick={() => navigate('/')}>
          ← Back to Dashboard
        </Button>
      </div>

      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Process Information</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>Process ID:</strong>
                    <div className="mt-1">
                      <code className="copyable-id">{processDetail.Id}</code>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <strong>Status:</strong>
                    <div className="mt-1">
                      <Badge bg={getStatusVariant(processDetail.Status)} className="status-pill">
                        {processDetail.Status}
                      </Badge>
                    </div>
                  </div>

                  <div className="mb-3">
                    <strong>Phone Number:</strong>
                    <div className="mt-1">{processDetail.Phone || 'N/A'}</div>
                  </div>

                  <div className="mb-3">
                    <strong>Current State:</strong>
                    <div className="mt-1">{processDetail.CurrentState || 'N/A'}</div>
                  </div>

                  <div className="mb-3">
                    <strong>Previous State:</strong>
                    <div className="mt-1">{processDetail.PreviousState || 'N/A'}</div>
                  </div>

                  <div className="mb-3">
                    <strong>Current Form Step:</strong>
                    <div className="mt-1">{processDetail.CurrentFormStep || 'N/A'}</div>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="mb-3">
                    <strong>Creation Date:</strong>
                    <div className="mt-1">
                      {format(new Date(processDetail.CreationDate), 'MMM dd, yyyy HH:mm:ss')}
                    </div>
                  </div>

                  <div className="mb-3">
                    <strong>Device Platform:</strong>
                    <div className="mt-1">{getDevicePlatform(processDetail.DevicePlatform)}</div>
                  </div>

                  <div className="mb-3">
                    <strong>Device ID:</strong>
                    <div className="mt-1">{processDetail.DeviceId || 'N/A'}</div>
                  </div>

                  <div className="mb-3">
                    <strong>Version:</strong>
                    <div className="mt-1">{processDetail.Version || 'N/A'}</div>
                  </div>

                  <div className="mb-3">
                    <strong>Customer ID:</strong>
                    <div className="mt-1">{processDetail.CustomerId || 'N/A'}</div>
                  </div>

                  <div className="mb-3">
                    <strong>Contract Number:</strong>
                    <div className="mt-1">{processDetail.OpenedContractNumber || 'N/A'}</div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Process Flags</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-2">
                <Badge bg={processDetail.IsTestMode ? 'warning' : 'secondary'}>
                  {processDetail.IsTestMode ? 'Test Mode' : 'Production'}
                </Badge>
              </div>
              
              <div className="mb-2">
                <Badge bg={processDetail.FacesCompareFinished ? 'success' : 'secondary'}>
                  {processDetail.FacesCompareFinished ? 'Face Compare Done' : 'Face Compare Pending'}
                </Badge>
              </div>
              
              <div className="mb-2">
                <Badge bg={processDetail.AllowMoveBack ? 'info' : 'secondary'}>
                  {processDetail.AllowMoveBack ? 'Can Move Back' : 'Cannot Move Back'}
                </Badge>
              </div>
              
              <div className="mb-2">
                <Badge bg={processDetail.IsEditQuestionnaire ? 'info' : 'secondary'}>
                  {processDetail.IsEditQuestionnaire ? 'Edit Mode' : 'Normal Mode'}
                </Badge>
              </div>
              
              <div className="mb-2">
                <Badge bg={processDetail.IsAborting ? 'danger' : 'secondary'}>
                  {processDetail.IsAborting ? 'Aborting' : 'Active'}
                </Badge>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h5 className="mb-0">Error & Retry Information</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <strong>Saga Error:</strong>
                <div className="mt-1">
                  <Badge bg={processDetail.SagaError ? 'danger' : 'success'}>
                    {processDetail.SagaError || 0}
                  </Badge>
                </div>
              </div>
              
              <div className="mb-3">
                <strong>Operation Retry Count:</strong>
                <div className="mt-1">
                  <Badge bg={processDetail.OperationRetryCount ? 'warning' : 'success'}>
                    {processDetail.OperationRetryCount || 0}
                  </Badge>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {processDetail.Raw && (
        <Card>
          <Card.Header>
            <h5 className="mb-0">Raw Data (Redacted)</h5>
          </Card.Header>
          <Card.Body>
            <pre className="bg-light p-3" style={{ fontSize: '0.875rem', maxHeight: '400px', overflow: 'auto' }}>
              {JSON.stringify(processDetail.Raw, null, 2)}
            </pre>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default ProcessDetails;