// API Types based on OpenAPI specification

export interface OnboardingListRequest {
  OrderBy: 'CreatedDesc' | 'CreatedAsc' | 'StatusAsc' | 'StatusDesc' | 'RetriesDesc' | 'RetriesAsc';
  Filters?: OnboardingFilters;
  MinCreationDate?: string;
  MaxCreationDate?: string;
  Page: number;
  PageSize: 10 | 25 | 50;
}

export interface OnboardingFilters {
  Status?: 'success' | 'failed' | 'inprogress' | 'all';
  IncludeTest?: boolean;
  State?: string;
  DevicePlatform?: number;
  PhoneContains?: string;
}

export interface OnboardingListResponse {
  Items: ProcessItem[];
  Page: number;
  PageSize: number;
  Total: number;
}

export interface ProcessItem {
  Id: string;
  Phone?: string;
  CurrentState?: string;
  CurrentFormStep?: number;
  Status: 'success' | 'failed' | 'inprogress';
  CreatedAt: string;
  Retries?: number;
  IsTest?: boolean;
  DevicePlatform?: number;
}

export interface ProcessDetailResponse {
  Data: ProcessDetail;
}

export interface ProcessDetail {
  Id: string;
  CurrentState?: string;
  PreviousState?: string;
  CurrentFormStep?: number;
  Version?: number;
  DeviceId?: string;
  Phone?: string;
  DevicePlatform?: number;
  CreationDate: string;
  Status: 'success' | 'failed' | 'inprogress';
  OpenedContractNumber?: string | null;
  FacesCompareFinished?: boolean;
  AllowMoveBack?: boolean;
  SagaError?: number;
  OperationRetryCount?: number;
  IsTestMode?: boolean;
  IsEditQuestionnaire?: boolean;
  IsAborting?: boolean;
  CustomerId?: number;
  Raw?: Record<string, any>;
}

export interface DailyMetricsRequest {
  MinCreationDate: string;
  MaxCreationDate: string;
  IncludeTest?: boolean;
  State?: string;
}

export interface DailyBucket {
  Date: string;
  Count: number;
}

export interface DailyMetricsResponse {
  Buckets: DailyBucket[];
}

export interface OutcomesMetricsRequest {
  MinCreationDate: string;
  MaxCreationDate: string;
  IncludeTest?: boolean;
}

export interface OutcomesMetricsResponse {
  Success: number;
  Failed: number;
  InProgress: number;
}

// UI-specific types
export interface KPIData {
  total: number;
  success: number;
  failed: number;
  inProgress: number;
}

export interface FilterState {
  status: 'success' | 'failed' | 'inprogress' | 'all';
  includeTest: boolean;
  state?: string;
  dateRange: {
    from?: Date;
    to?: Date;
  };
}

export interface PaginationState {
  page: number;
  pageSize: 10 | 25 | 50;
  total: number;
}

export interface SortState {
  field: 'CreatedAt' | 'Status' | 'Retries';
  direction: 'asc' | 'desc';
}