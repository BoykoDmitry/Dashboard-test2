import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col } from 'react-bootstrap';
import KPICards from '../components/KPICards';
import DailyChart from '../components/DailyChart';
import OutcomeChart from '../components/OutcomeChart';
import FiltersBar from '../components/FiltersBar';
import ProcessTable from '../components/ProcessTable';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { useApiClient } from '../hooks/useApiClient';
import {
  FilterState,
  PaginationState,
  SortState,
  KPIData,
  OnboardingListResponse,
  DailyMetricsResponse,
  OutcomesMetricsResponse,
} from '../api/types';

const Dashboard: React.FC = () => {
  const apiClient = useApiClient();
  // State management
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    includeTest: true,
    dateRange: {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      to: new Date(),
    },
  });

  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 25,
    total: 0,
  });

  const [sort, setSort] = useState<SortState>({
    field: 'CreatedAt',
    direction: 'desc',
  });

  // Data state
  const [processData, setProcessData] = useState<OnboardingListResponse | null>(null);
  const [dailyData, setDailyData] = useState<DailyMetricsResponse | null>(null);
  const [outcomeData, setOutcomeData] = useState<OutcomesMetricsResponse | null>(null);
  const [kpiData, setKpiData] = useState<KPIData | null>(null);

  // Loading states
  const [loadingProcesses, setLoadingProcesses] = useState(false);
  const [loadingDaily, setLoadingDaily] = useState(false);
  const [loadingOutcomes, setLoadingOutcomes] = useState(false);

  // Error states
  const [processError, setProcessError] = useState<string | null>(null);
  const [dailyError, setDailyError] = useState<string | null>(null);
  const [outcomeError, setOutcomeError] = useState<string | null>(null);

  // Helper functions
  const getOrderByValue = (sort: SortState): string => {
    const fieldMap = {
      CreatedAt: 'Created',
      Status: 'Status',
      Retries: 'Retries',
    };
    const direction = sort.direction === 'asc' ? 'Asc' : 'Desc';
    return `${fieldMap[sort.field]}${direction}`;
  };

  const formatDateForAPI = (date?: Date): string | undefined => {
    return date?.toISOString();
  };

  // Data fetching functions
  const fetchProcesses = useCallback(async () => {
    setLoadingProcesses(true);
    setProcessError(null);
    
    try {
      const response = await apiClient.listOnboarding({
        OrderBy: getOrderByValue(sort) as any,
        Page: pagination.page,
        PageSize: pagination.pageSize,
        MinCreationDate: formatDateForAPI(filters.dateRange.from),
        MaxCreationDate: formatDateForAPI(filters.dateRange.to),
        Filters: {
          Status: filters.status,
          IncludeTest: filters.includeTest,
          State: filters.state,
        },
      });

      setProcessData(response);
      setPagination(prev => ({ ...prev, total: response.Total }));

      // Calculate KPIs from the response
      const kpis: KPIData = {
        total: response.Total,
        success: response.Items.filter(item => item.Status === 'success').length,
        failed: response.Items.filter(item => item.Status === 'failed').length,
        inProgress: response.Items.filter(item => item.Status === 'inprogress').length,
      };
      setKpiData(kpis);
    } catch (error) {
      setProcessError(error instanceof Error ? error.message : 'Failed to fetch processes');
    } finally {
      setLoadingProcesses(false);
    }
  }, [filters, pagination.page, pagination.pageSize, sort]);

  const fetchDailyMetrics = useCallback(async () => {
    if (!filters.dateRange.from || !filters.dateRange.to) return;

    setLoadingDaily(true);
    setDailyError(null);

    try {
      const response = await apiClient.getDailyMetrics({
        MinCreationDate: formatDateForAPI(filters.dateRange.from)!,
        MaxCreationDate: formatDateForAPI(filters.dateRange.to)!,
        IncludeTest: filters.includeTest,
        State: filters.state,
      });

      setDailyData(response);
    } catch (error) {
      setDailyError(error instanceof Error ? error.message : 'Failed to fetch daily metrics');
    } finally {
      setLoadingDaily(false);
    }
  }, [filters.dateRange, filters.includeTest, filters.state]);

  const fetchOutcomeMetrics = useCallback(async () => {
    if (!filters.dateRange.from || !filters.dateRange.to) return;

    setLoadingOutcomes(true);
    setOutcomeError(null);

    try {
      const response = await apiClient.getOutcomeMetrics({
        MinCreationDate: formatDateForAPI(filters.dateRange.from)!,
        MaxCreationDate: formatDateForAPI(filters.dateRange.to)!,
        IncludeTest: filters.includeTest,
      });

      setOutcomeData(response);
    } catch (error) {
      setOutcomeError(error instanceof Error ? error.message : 'Failed to fetch outcome metrics');
    } finally {
      setLoadingOutcomes(false);
    }
  }, [filters.dateRange, filters.includeTest]);

  // Event handlers
  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handleClearFilters = () => {
    setFilters({
      status: 'all',
      includeTest: true,
      dateRange: {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        to: new Date(),
      },
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Effects
  useEffect(() => {
    fetchProcesses();
  }, [fetchProcesses]);

  useEffect(() => {
    fetchDailyMetrics();
  }, [fetchDailyMetrics]);

  useEffect(() => {
    fetchOutcomeMetrics();
  }, [fetchOutcomeMetrics]);

  return (
    <div>
      {/* KPI Cards */}
      <KPICards data={kpiData} loading={loadingProcesses} />

      {/* Charts Row */}
      <Row className="mb-4">
        <Col md={6}>
          <DailyChart
            data={dailyData?.Buckets || null}
            loading={loadingDaily}
            error={dailyError}
          />
        </Col>
        <Col md={6}>
          <OutcomeChart
            data={outcomeData}
            loading={loadingOutcomes}
            error={outcomeError}
          />
        </Col>
      </Row>

      {/* Filters */}
      <FiltersBar
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      {/* Process Table */}
      <ProcessTable
        data={processData?.Items || null}
        pagination={pagination}
        sort={sort}
        loading={loadingProcesses}
        error={processError}
        onPaginationChange={setPagination}
        onSortChange={setSort}
      />
    </div>
  );
};

export default Dashboard;