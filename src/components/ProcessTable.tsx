import React from 'react';
import { Table, Badge, Pagination, Form, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ProcessItem, PaginationState, SortState } from '../api/types';
import { format } from 'date-fns';

interface ProcessTableProps {
  data: ProcessItem[] | null;
  pagination: PaginationState;
  sort: SortState;
  loading?: boolean;
  error?: string | null;
  onPaginationChange: (pagination: PaginationState) => void;
  onSortChange: (sort: SortState) => void;
}

const ProcessTable: React.FC<ProcessTableProps> = ({
  data,
  pagination,
  sort,
  loading = false,
  error,
  onPaginationChange,
  onSortChange,
}) => {
  const navigate = useNavigate();

  const handleRowClick = (id: string) => {
    navigate(`/process/${id}`);
  };

  const handleSort = (field: SortState['field']) => {
    const direction = sort.field === field && sort.direction === 'desc' ? 'asc' : 'desc';
    onSortChange({ field, direction });
  };

  const handlePageSizeChange = (pageSize: PaginationState['pageSize']) => {
    onPaginationChange({ ...pagination, pageSize, page: 1 });
  };

  const handlePageChange = (page: number) => {
    onPaginationChange({ ...pagination, page });
  };

  const maskPhoneNumber = (phone?: string): string => {
    if (!phone) return 'N/A';
    if (phone.length <= 4) return phone;
    const start = phone.substring(0, 4);
    const end = phone.substring(phone.length - 4);
    const masked = '*'.repeat(Math.max(0, phone.length - 8));
    return `${start}${masked}${end}`;
  };

  const getStatusVariant = (status: string): string => {
    switch (status) {
      case 'success': return 'success';
      case 'failed': return 'danger';
      case 'inprogress': return 'warning';
      default: return 'secondary';
    }
  };

  const copyToClipboard = (text: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const getSortIcon = (field: SortState['field']): string => {
    if (sort.field !== field) return '↕️';
    return sort.direction === 'asc' ? '↑' : '↓';
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(pagination.total / pagination.pageSize);
    const items = [];
    
    for (let page = 1; page <= totalPages; page++) {
      if (
        page === 1 ||
        page === totalPages ||
        (page >= pagination.page - 2 && page <= pagination.page + 2)
      ) {
        items.push(
          <Pagination.Item
            key={page}
            active={page === pagination.page}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </Pagination.Item>
        );
      } else if (
        page === pagination.page - 3 ||
        page === pagination.page + 3
      ) {
        items.push(<Pagination.Ellipsis key={`ellipsis-${page}`} />);
      }
    }

    return (
      <Pagination className="justify-content-center mb-0">
        <Pagination.Prev
          disabled={pagination.page === 1}
          onClick={() => handlePageChange(pagination.page - 1)}
        />
        {items}
        <Pagination.Next
          disabled={pagination.page === totalPages}
          onClick={() => handlePageChange(pagination.page + 1)}
        />
      </Pagination>
    );
  };

  if (loading) {
    return (
      <Card className="table-container">
        <Card.Body>
          <div className="loading-skeleton" style={{ height: '400px' }} />
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="table-container">
        <Card.Body>
          <div className="error-banner text-center">
            <p className="mb-2">Failed to load processes</p>
            <button className="btn btn-sm btn-outline-danger">Retry</button>
          </div>
        </Card.Body>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="table-container">
        <Card.Body className="text-center py-5">
          <h5>No results found</h5>
          <p className="text-muted">Try adjusting your filters or date range</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="table-container">
      <Card.Body className="p-0">
        <div className="table-responsive">
          <Table hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Phone</th>
                <th 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSort('Status')}
                  onKeyDown={(e) => e.key === 'Enter' && handleSort('Status')}
                  tabIndex={0}
                  role="button"
                  aria-label="Sort by Status"
                >
                  Status {getSortIcon('Status')}
                </th>
                <th>State</th>
                <th>Step</th>
                <th 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSort('CreatedAt')}
                  onKeyDown={(e) => e.key === 'Enter' && handleSort('CreatedAt')}
                  tabIndex={0}
                  role="button"
                  aria-label="Sort by Created At"
                >
                  Created At {getSortIcon('CreatedAt')}
                </th>
                <th 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSort('Retries')}
                  onKeyDown={(e) => e.key === 'Enter' && handleSort('Retries')}
                  tabIndex={0}
                  role="button"
                  aria-label="Sort by Retries"
                >
                  Retries {getSortIcon('Retries')}
                </th>
                <th>Test</th>
              </tr>
            </thead>
            <tbody>
              {data.map((process) => (
                <tr
                  key={process.Id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleRowClick(process.Id)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRowClick(process.Id)}
                  tabIndex={0}
                  role="button"
                  aria-label={`View details for process ${process.Id.substring(0, 8)}`}
                >
                  <td>
                    <code
                      className="copyable-id"
                      onClick={(e) => copyToClipboard(process.Id, e)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.stopPropagation();
                          copyToClipboard(process.Id, e);
                        }
                      }}
                      title="Click to copy full ID"
                      tabIndex={0}
                      role="button"
                      aria-label={`Copy full process ID ${process.Id}`}
                    >
                      {process.Id.substring(0, 8)}...
                    </code>
                  </td>
                  <td>{maskPhoneNumber(process.Phone)}</td>
                  <td>
                    <Badge
                      bg={getStatusVariant(process.Status)}
                      className="status-pill"
                    >
                      {process.Status}
                    </Badge>
                  </td>
                  <td>{process.CurrentState || 'N/A'}</td>
                  <td>{process.CurrentFormStep || 'N/A'}</td>
                  <td>
                    {format(new Date(process.CreatedAt), 'MMM dd, yyyy HH:mm')}
                  </td>
                  <td>{process.Retries || 0}</td>
                  <td>
                    {process.IsTest && (
                      <Badge bg="secondary" className="test-badge">
                        TEST
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        
        <div className="p-3 border-top">
          <Row className="align-items-center">
            <Col md={4}>
              <Form.Group className="d-flex align-items-center">
                <Form.Label className="me-2 mb-0">Show:</Form.Label>
                <Form.Select
                  size="sm"
                  style={{ width: 'auto' }}
                  value={pagination.pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value) as PaginationState['pageSize'])}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </Form.Select>
                <span className="ms-2 text-muted">
                  of {pagination.total} results
                </span>
              </Form.Group>
            </Col>
            <Col md={8}>
              {renderPagination()}
            </Col>
          </Row>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProcessTable;