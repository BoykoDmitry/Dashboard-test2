import {
  OnboardingListRequest,
  OnboardingListResponse,
  ProcessDetailResponse,
  DailyMetricsRequest,
  DailyMetricsResponse,
  OutcomesMetricsRequest,
  OutcomesMetricsResponse,
} from './types';
import {
  mockOnboardingList,
  mockProcessDetail,
  mockDailyMetrics,
  mockOutcomeMetrics,
} from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://digitalchannels.qmw-test.quipu.de/api/v1';
const USE_MOCK_DATA = import.meta.env.DEV || !import.meta.env.VITE_API_BASE_URL;

class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private baseUrl: string;
  private getAccessToken?: () => Promise<string | null>;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  setAuthTokenProvider(getAccessToken: () => Promise<string | null>) {
    this.getAccessToken = getAccessToken;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Add authorization header if token provider is available
    if (this.getAccessToken && !USE_MOCK_DATA) {
      try {
        const token = await this.getAccessToken();
        if (token) {
          defaultHeaders['Authorization'] = `Bearer ${token}`;
        }
      } catch (error) {
        console.warn('Failed to get access token:', error);
      }
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiError(
          response.status,
          `API request failed: ${response.statusText}`,
          errorData
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(0, `Network error: ${error.message}`);
    }
  }

  private getAccessToken(): string | null {
    // This will be implemented when we add MSAL integration
    // For now, return null to allow development without auth
    return null;
  }

  // Admin API endpoints
  async listOnboarding(request: OnboardingListRequest): Promise<OnboardingListResponse> {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockOnboardingList(
        request.Page,
        request.PageSize,
        request.Filters?.Status || 'all',
        request.Filters?.IncludeTest ?? true
      );
    }
    
    return this.request<OnboardingListResponse>('/admin/onboarding/list', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getOnboardingById(id: string): Promise<ProcessDetailResponse> {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return { Data: mockProcessDetail(id) };
    }
    
    return this.request<ProcessDetailResponse>(`/admin/onboarding/${id}`);
  }

  async getDailyMetrics(request: DailyMetricsRequest): Promise<DailyMetricsResponse> {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));
      return mockDailyMetrics();
    }
    
    return this.request<DailyMetricsResponse>('/admin/onboarding/metrics/daily', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getOutcomeMetrics(request: OutcomesMetricsRequest): Promise<OutcomesMetricsResponse> {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 350));
      return mockOutcomeMetrics();
    }
    
    return this.request<OutcomesMetricsResponse>('/admin/onboarding/metrics/outcomes', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }
}

export const apiClient = new ApiClient();
export { ApiError };