import React from 'react';
import { Row, Col, Form, Button, Card } from 'react-bootstrap';
import { FilterState } from '../api/types';

interface FiltersBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}

const FiltersBar: React.FC<FiltersBarProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const handleStatusChange = (status: FilterState['status']) => {
    onFiltersChange({ ...filters, status });
  };

  const handleIncludeTestChange = (includeTest: boolean) => {
    onFiltersChange({ ...filters, includeTest });
  };

  const handleDateRangeChange = (field: 'from' | 'to', value: string) => {
    const date = value ? new Date(value) : undefined;
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: date,
      },
    });
  };

  const handleStateChange = (state: string) => {
    onFiltersChange({ ...filters, state: state || undefined });
  };

  const formatDateForInput = (date?: Date): string => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  return (
    <Card className="filters-bar">
      <Card.Body>
        <Row className="align-items-end">
          <Col md={2}>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={filters.status}
                onChange={(e) => handleStatusChange(e.target.value as FilterState['status'])}
              >
                <option value="all">All</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
                <option value="inprogress">In Progress</option>
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col md={2}>
            <Form.Group>
              <Form.Label>From Date</Form.Label>
              <Form.Control
                type="date"
                value={formatDateForInput(filters.dateRange.from)}
                onChange={(e) => handleDateRangeChange('from', e.target.value)}
              />
            </Form.Group>
          </Col>
          
          <Col md={2}>
            <Form.Group>
              <Form.Label>To Date</Form.Label>
              <Form.Control
                type="date"
                value={formatDateForInput(filters.dateRange.to)}
                onChange={(e) => handleDateRangeChange('to', e.target.value)}
              />
            </Form.Group>
          </Col>
          
          <Col md={2}>
            <Form.Group>
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                placeholder="Current state"
                value={filters.state || ''}
                onChange={(e) => handleStateChange(e.target.value)}
              />
            </Form.Group>
          </Col>
          
          <Col md={2}>
            <Form.Group>
              <Form.Check
                type="checkbox"
                label="Include Test Mode"
                checked={filters.includeTest}
                onChange={(e) => handleIncludeTestChange(e.target.checked)}
                className="mt-4"
              />
            </Form.Group>
          </Col>
          
          <Col md={2}>
            <Button
              variant="outline-secondary"
              onClick={onClearFilters}
              className="w-100"
            >
              Clear Filters
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default FiltersBar;