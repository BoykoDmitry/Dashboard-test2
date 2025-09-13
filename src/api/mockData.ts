import {
  OnboardingListResponse,
  ProcessDetail,
  DailyMetricsResponse,
  OutcomesMetricsResponse,
  ProcessItem,
} from './types';

// Generate mock process items
const generateMockProcesses = (count: number): ProcessItem[] => {
  const statuses = ['success', 'failed', 'inprogress'] as const;
  const states = ['InitialState', 'DocumentUpload', 'FaceVerification', 'Questionnaire', 'ContractSigning', 'Completed'];
  const platforms = [1, 2]; // Android, iOS
  
  return Array.from({ length: count }, (_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000); // Last 30 days
    
    return {
      Id: `${Math.random().toString(36).substr(2, 8)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 12)}`,
      Phone: `+49${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
      CurrentState: states[Math.floor(Math.random() * states.length)],
      CurrentFormStep: Math.floor(Math.random() * 5) + 1,
      Status: status,
      CreatedAt: createdAt.toISOString(),
      Retries: Math.floor(Math.random() * 3),
      IsTest: Math.random() > 0.8,
      DevicePlatform: platforms[Math.floor(Math.random() * platforms.length)],
    };
  });
};

// Mock data
const mockProcesses = generateMockProcesses(150);

export const mockOnboardingList = (
  page: number = 1,
  pageSize: number = 25,
  status: string = 'all',
  includeTest: boolean = true
): OnboardingListResponse => {
  let filteredProcesses = mockProcesses;
  
  // Apply status filter
  if (status !== 'all') {
    filteredProcesses = filteredProcesses.filter(p => p.Status === status);
  }
  
  // Apply test filter
  if (!includeTest) {
    filteredProcesses = filteredProcesses.filter(p => !p.IsTest);
  }
  
  // Apply pagination
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = filteredProcesses.slice(startIndex, endIndex);
  
  return {
    Items: paginatedItems,
    Page: page,
    PageSize: pageSize,
    Total: filteredProcesses.length,
  };
};

export const mockProcessDetail = (id: string): ProcessDetail => {
  const process = mockProcesses.find(p => p.Id === id) || mockProcesses[0];
  
  return {
    Id: process.Id,
    CurrentState: process.CurrentState,
    PreviousState: 'DocumentUpload',
    CurrentFormStep: process.CurrentFormStep,
    Version: 2,
    DeviceId: `device-${Math.random().toString(36).substr(2, 8)}`,
    Phone: process.Phone,
    DevicePlatform: process.DevicePlatform,
    CreationDate: process.CreatedAt,
    Status: process.Status,
    OpenedContractNumber: process.Status === 'success' ? `CON-${Math.floor(Math.random() * 1000000)}` : null,
    FacesCompareFinished: process.Status !== 'failed',
    AllowMoveBack: true,
    SagaError: process.Status === 'failed' ? Math.floor(Math.random() * 5) + 1 : 0,
    OperationRetryCount: process.Retries,
    IsTestMode: process.IsTest,
    IsEditQuestionnaire: false,
    IsAborting: false,
    CustomerId: Math.floor(Math.random() * 100000),
    Raw: {
      personalData: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        // Note: In real implementation, sensitive data would be redacted
      },
      deviceInfo: {
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
        screenResolution: '375x812',
      },
      processSteps: [
        { step: 'InitialState', timestamp: process.CreatedAt, status: 'completed' },
        { step: 'DocumentUpload', timestamp: new Date(Date.now() - 1000000).toISOString(), status: 'completed' },
        { step: 'FaceVerification', timestamp: new Date(Date.now() - 500000).toISOString(), status: process.Status === 'failed' ? 'failed' : 'completed' },
      ],
    },
  };
};

export const mockDailyMetrics = (): DailyMetricsResponse => {
  const buckets = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    buckets.push({
      Date: date.toISOString().split('T')[0],
      Count: Math.floor(Math.random() * 20) + 5,
    });
  }
  
  return { Buckets: buckets };
};

export const mockOutcomeMetrics = (): OutcomesMetricsResponse => {
  const successCount = mockProcesses.filter(p => p.Status === 'success').length;
  const failedCount = mockProcesses.filter(p => p.Status === 'failed').length;
  const inProgressCount = mockProcesses.filter(p => p.Status === 'inprogress').length;
  
  return {
    Success: successCount,
    Failed: failedCount,
    InProgress: inProgressCount,
  };
};