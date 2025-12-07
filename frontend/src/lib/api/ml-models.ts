/**
 * ML Models API Client
 * Connects to the ML models backend API
 */

const ML_API_BASE_URL = process.env.NEXT_PUBLIC_ML_API_URL || "http://localhost:5001";

// Individual Flask service URLs (if running separately)
const PRICE_PREDICTION_URL = process.env.NEXT_PUBLIC_PRICE_API_URL || "http://localhost:5000";
const FORECAST_URL = process.env.NEXT_PUBLIC_FORECAST_API_URL || "http://localhost:5000";
const CLUSTER_URL = process.env.NEXT_PUBLIC_CLUSTER_API_URL || "http://localhost:5000";
const ADVISOR_URL = process.env.NEXT_PUBLIC_ADVISOR_API_URL || "http://localhost:5000";

export interface PricePredictionRequest {
  // Core features
  house_size: number;
  bed: number;
  bath: number;
  acre_lot: number;
  zip_code: number;
  // Derived features (will be calculated)
  sqft_per_bed?: number;
  bed_bath_ratio?: number;
  bed_bath_sum?: number;
  lot_size_sqft?: number;
  house_to_lot_ratio?: number;
  city_size?: number;
  is_large_city?: number;
  years_since_2000?: number;
  is_recent?: number;
  decade?: number;
  month_sin?: number;
  month_cos?: number;
  zip_price_mean?: number;
  zip_price_median?: number;
  zip_size_mean?: number;
  zip_count?: number;
  zip_growth_rate?: number;
  sold_year?: number;
  [key: string]: any;
}

export interface PricePredictionResponse {
  status: string;
  predicted_price: number;
}

export interface ForecastRequest {
  // Core features
  house_size: number;
  bed: number;
  bath: number;
  acre_lot: number;
  zip_code: number;
  sold_year?: number;
  // Additional features for model
  city_size?: number;
  zip_price_mean?: number;
  zip_price_median?: number;
  zip_size_mean?: number;
  zip_count?: number;
  // Derived features (will be calculated)
  sqft_per_bed?: number;
  bed_bath_ratio?: number;
  bed_bath_sum?: number;
  lot_size_sqft?: number;
  house_to_lot_ratio?: number;
  is_large_city?: number;
  years_since_2000?: number;
  is_recent?: number;
  decade?: number;
  month_sin?: number;
  month_cos?: number;
  zip_growth_rate?: number;
  [key: string]: any;
}

export interface ForecastResponse {
  success: boolean;
  forecast: {
    current_price: number;
    price_1_year: number;
    price_5_year: number;
    price_10_year: number;
    growth_rate: number;
    current_year: number;
  };
}

export interface ClusterCentroid {
  cluster_id: number;
  lat: number;
  lng: number;
  [key: string]: any;
}

export interface ClusterProperty {
  street_cluster?: number;
  cluster_id?: number;
  lat: number;
  lng: number;
  [key: string]: any;
}

export interface ClusterSummary {
  num_clusters: number;
  silhouette_score: number;
  cluster_distribution: Array<{
    cluster_id: number;
    count: number;
  }>;
}

export interface ClusterPredictRequest {
  lat: number;
  lng: number;
}

export interface ClusterPredictResponse {
  lat: number;
  lng: number;
  predicted_cluster: number;
}

export interface AdvisorRequest {
  budget: number;
  state?: string;
  city?: string;
  min_beds?: number;
  min_baths?: number;
  top_n?: number;
}

export interface AdvisorRecommendation {
  city: string;
  state: string;
  current_price: number;
  beds: number;
  baths: number;
  house_size: number;
  roi_10_year: number;
  price_10yr: number;
  risk: number;
}

export interface AdvisorResponse {
  success: boolean;
  total_analyzed: number;
  data: AdvisorRecommendation[];
}

async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${ML_API_BASE_URL}${endpoint}`;
  
  console.log(`[ML API] Calling: ${url}`, options);
  
  try {
    const controller = new AbortController();
    // Increase timeout to 30 seconds for large data loading (CSV files can take time)
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[ML API] Error ${response.status} for ${url}:`, errorText);
      throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`[ML API] Success for ${url}:`, data);
    return data;
  } catch (error: any) {
    console.error(`[ML API] Network error for ${url}:`, error);
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout - Make sure the ML API is running on ${ML_API_BASE_URL}`);
    }
    if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
      throw new Error(`Cannot connect to API. Make sure the service is running on ${ML_API_BASE_URL}`);
    }
    throw error;
  }
}

export async function predictPrice(data: PricePredictionRequest): Promise<PricePredictionResponse> {
  console.log("[ML API] predictPrice called with:", data);
  
  // Try unified API first, fallback to Flask service
  try {
    return await apiCall<PricePredictionResponse>("/api/predict-price", {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.warn("[ML API] Unified API failed, trying Flask service:", error);
    // Fallback to Flask service
    try {
      const response = await fetch(`${PRICE_PREDICTION_URL}/predict_price`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[ML API] Flask service error ${response.status}:`, errorText);
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      const result = await response.json();
      console.log("[ML API] Flask service success:", result);
      return {
        status: result.status || "success",
        predicted_price: result.predicted_price || 0,
      };
    } catch (flaskError) {
      console.error("[ML API] Flask service also failed:", flaskError);
      throw flaskError;
    }
  }
}

export async function forecastPrices(data: ForecastRequest): Promise<ForecastResponse> {
  console.log("[ML API] forecastPrices called with:", data);
  
  // Try unified API first, fallback to Flask service
  try {
    return await apiCall<ForecastResponse>("/api/forecast", {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.warn("[ML API] Unified API failed, trying Flask service:", error);
    // Fallback to Flask service
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${FORECAST_URL}/api/forecast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[ML API] Flask service error ${response.status}:`, errorText);
        throw new Error(`API error: ${response.status} ${response.statusText} - Make sure Flask forecast service is running on ${FORECAST_URL}`);
      }
      const result = await response.json();
      console.log("[ML API] Flask service success:", result);
      return result;
    } catch (flaskError: any) {
      console.error("[ML API] Flask service also failed:", flaskError);
      if (flaskError.name === 'AbortError') {
        throw new Error(`Request timeout - Make sure Flask forecast service is running on ${FORECAST_URL}`);
      }
      if (flaskError.message?.includes('Failed to fetch') || flaskError.message?.includes('NetworkError')) {
        throw new Error(`Cannot connect to ML API. Make sure the unified backend is running: cd ml-api && python main.py`);
      }
      throw flaskError;
    }
  }
}

export async function getClusterSummary(): Promise<ClusterSummary> {
  console.log("[ML API] getClusterSummary called");
  
  try {
    return await apiCall<ClusterSummary>("/api/clusters/summary");
  } catch (error: any) {
    console.error("[ML API] Failed to get cluster summary:", error);
    if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError') || error.name === 'AbortError') {
      throw new Error(`Cannot connect to ML API. Make sure the unified backend is running: cd ml-api && python main.py`);
    }
    throw error;
  }
}

export async function getClusterCentroids(): Promise<{ num_clusters: number; centroids: ClusterCentroid[] }> {
  console.log("[ML API] getClusterCentroids called");
  
  try {
    return await apiCall<{ num_clusters: number; centroids: ClusterCentroid[] }>("/api/clusters/centroids");
  } catch (error: any) {
    console.error("[ML API] Failed to get cluster centroids:", error);
    if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError') || error.name === 'AbortError') {
      throw new Error(`Cannot connect to ML API. Make sure the unified backend is running: cd ml-api && python main.py`);
    }
    throw error;
  }
}

export async function getAllClusters(page: number = 1, pageSize: number = 1000): Promise<{ page: number; page_size: number; total_properties: number; data: ClusterProperty[] }> {
  console.log("[ML API] getAllClusters called", { page, pageSize });
  
  try {
    return await apiCall<{ page: number; page_size: number; total_properties: number; data: ClusterProperty[] }>(`/api/clusters/all?page=${page}&size=${pageSize}`);
  } catch (error: any) {
    console.error("[ML API] Failed to get all clusters:", error);
    if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError') || error.name === 'AbortError') {
      throw new Error(`Cannot connect to ML API. Make sure the unified backend is running: cd ml-api && python main.py`);
    }
    throw error;
  }
}

export async function predictCluster(data: ClusterPredictRequest): Promise<ClusterPredictResponse> {
  try {
    return apiCall<ClusterPredictResponse>("/api/clusters/predict", {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch (error: any) {
    console.error("[ML API] Failed to predict cluster:", error);
    if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError') || error.name === 'AbortError') {
      throw new Error(`Cannot connect to ML API. Make sure the unified backend is running: cd ml-api && python main.py`);
    }
    throw error;
  }
}

export async function getAdvisorStates(): Promise<{ success: boolean; states: string[] }> {
  console.log("[ML API] getAdvisorStates called");
  
  try {
    return await apiCall<{ success: boolean; states: string[] }>("/api/advisor/states");
  } catch (error: any) {
    console.error("[ML API] Failed to get advisor states:", error);
    if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError') || error.name === 'AbortError') {
      throw new Error(`Cannot connect to ML API. Make sure the unified backend is running: cd ml-api && python main.py`);
    }
    throw error;
  }
}

export async function getZipCodes(): Promise<{ success: boolean; zip_codes: number[] }> {
  console.log("[ML API] getZipCodes called");
  try {
    return await apiCall<{ success: boolean; zip_codes: number[] }>("/api/zip-codes");
  } catch (error) {
    console.error("[ML API] Error getting zip codes:", error);
    throw error;
  }
}

export async function getZipCodeStats(zipCode: number): Promise<{ success: boolean; stats: { zip_code: number; property_count: number; zip_price_mean: number; zip_price_median: number; zip_size_mean: number } }> {
  console.log("[ML API] getZipCodeStats called for zip:", zipCode);
  try {
    return await apiCall<{ success: boolean; stats: { zip_code: number; property_count: number; zip_price_mean: number; zip_price_median: number; zip_size_mean: number } }>(`/api/zip-codes/${zipCode}/stats`);
  } catch (error) {
    console.error(`[ML API] Error getting zip code stats for ${zipCode}:`, error);
    throw error;
  }
}

export async function getAdvisorCities(state: string): Promise<{ success: boolean; cities: string[] }> {
  console.log("[ML API] getAdvisorCities called for state:", state);
  
  try {
    return await apiCall<{ success: boolean; cities: string[] }>(`/api/advisor/cities/${encodeURIComponent(state)}`);
  } catch (error: any) {
    console.error("[ML API] Failed to get advisor cities:", error);
    if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError') || error.name === 'AbortError') {
      throw new Error(`Cannot connect to ML API. Make sure the unified backend is running: cd ml-api && python main.py`);
    }
    throw error;
  }
}

export async function getInvestmentRecommendations(params: AdvisorRequest): Promise<AdvisorResponse> {
  console.log("[ML API] getInvestmentRecommendations called with:", params);
  
  const searchParams = new URLSearchParams();
  searchParams.append("budget", params.budget.toString());
  if (params.state) searchParams.append("state", params.state);
  if (params.city) searchParams.append("city", params.city);
  if (params.min_beds) searchParams.append("min_beds", params.min_beds.toString());
  if (params.min_baths) searchParams.append("min_baths", params.min_baths.toString());
  if (params.top_n) searchParams.append("top_n", params.top_n.toString());

  const queryString = searchParams.toString();
  console.log("[ML API] Query string:", queryString);

  try {
    return await apiCall<AdvisorResponse>(`/api/advisor/recommend?${queryString}`);
  } catch (error: any) {
    console.error("[ML API] Failed to get investment recommendations:", error);
    if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError') || error.name === 'AbortError') {
      throw new Error(`Cannot connect to ML API. Make sure the unified backend is running: cd ml-api && python main.py`);
    }
    throw error;
  }
}

