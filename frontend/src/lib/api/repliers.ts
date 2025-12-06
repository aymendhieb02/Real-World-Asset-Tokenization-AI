// Repliers API utilities
// API Documentation: https://docs.repliers.io/reference/why-use-this-api

const REPLIERS_API_KEY = "XzpTyugsed9kv7ocmkXr5rVrOkRuLC";
const REPLIERS_BASE_URL = "https://api.repliers.io/v2";

export interface RepliersListing {
  id: string;
  mlsNumber?: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  location?: {
    latitude?: number;
    longitude?: number;
  };
  property?: {
    type?: string;
    bedrooms?: number;
    bathrooms?: number;
    squareFeet?: number;
    lotSize?: number;
    yearBuilt?: number;
    description?: string;
  };
  listPrice?: number;
  rentPrice?: number;
  status?: string;
  listingType?: "sale" | "rental";
  photos?: string[];
  agent?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  office?: {
    name?: string;
  };
  listingDate?: string;
  lastModified?: string;
}

export interface RepliersSearchResponse {
  listings: RepliersListing[];
  total: number;
  page?: number;
  limit?: number;
}

export interface RepliersLocation {
  id: string;
  name: string;
  type: string;
  parentId?: string;
}

export interface RepliersMarketStats {
  averagePrice?: number;
  averageRent?: number;
  medianPrice?: number;
  medianRent?: number;
  totalListings?: number;
  pricePerSquareFoot?: number;
  rentPerSquareFoot?: number;
}

async function fetchRepliers<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${REPLIERS_BASE_URL}${endpoint}`;

  // Repliers API authentication - try different header formats
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers as HeadersInit),
  };

  // Repliers API uses REPLIERS-API-KEY header (case-sensitive, exact match)
  headers["REPLIERS-API-KEY"] = REPLIERS_API_KEY;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Repliers API error for ${url}:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        requestHeaders: headers,
        responseHeaders: Object.fromEntries(response.headers.entries()),
      });
      
      // If 401, try with API key in query string as fallback
      if (response.status === 401) {
        const urlWithKey = new URL(url);
        urlWithKey.searchParams.append("repliers_api_key", REPLIERS_API_KEY);
        
        const retryResponse = await fetch(urlWithKey.toString(), {
          ...options,
          headers: {
            "Content-Type": "application/json",
            ...(options.headers as HeadersInit),
          },
        });
        
        if (retryResponse.ok) {
          return retryResponse.json();
        }
      }
      
      throw new Error(`Repliers API error: ${response.status} - ${errorText}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Network error: ${String(error)}`);
  }
}

// Search listings
export async function searchListings(
  filters: {
    city?: string;
    state?: string;
    zipCode?: string;
    minPrice?: number;
    maxPrice?: number;
    minRent?: number;
    maxRent?: number;
    bedrooms?: number;
    bathrooms?: number;
    propertyType?: string;
    listingType?: "sale" | "rental";
    limit?: number;
    page?: number;
  } = {}
): Promise<RepliersSearchResponse> {
  const body: any = {
    limit: filters.limit || 50,
    page: filters.page || 1,
  };

  if (filters.city) body.city = filters.city;
  if (filters.state) body.state = filters.state;
  if (filters.zipCode) body.zipCode = filters.zipCode;
  if (filters.minPrice) body.minPrice = filters.minPrice;
  if (filters.maxPrice) body.maxPrice = filters.maxPrice;
  if (filters.minRent) body.minRent = filters.minRent;
  if (filters.maxRent) body.maxRent = filters.maxRent;
  if (filters.bedrooms) body.bedrooms = filters.bedrooms;
  if (filters.bathrooms) body.bathrooms = filters.bathrooms;
  if (filters.propertyType) body.propertyType = filters.propertyType;
  if (filters.listingType) body.listingType = filters.listingType;

  try {
    const response = await fetchRepliers<RepliersSearchResponse>(
      "/listings/search",
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );
    return response;
  } catch (error) {
    console.error("Error searching listings:", error);
    return { listings: [], total: 0 };
  }
}

// Get a single listing by ID
export async function getListingById(id: string): Promise<RepliersListing | null> {
  try {
    const response = await fetchRepliers<RepliersListing>(`/listings/${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching listing:", error);
    return null;
  }
}

// Get similar listings
export async function getSimilarListings(
  listingId: string,
  limit: number = 10
): Promise<RepliersListing[]> {
  try {
    const response = await fetchRepliers<RepliersSearchResponse>(
      `/listings/${listingId}/similar?limit=${limit}`
    );
    return response.listings || [];
  } catch (error) {
    console.error("Error fetching similar listings:", error);
    return [];
  }
}

// Search locations
export async function searchLocations(
  query: string,
  type?: string
): Promise<RepliersLocation[]> {
  try {
    const params = new URLSearchParams({ q: query });
    if (type) params.append("type", type);
    
    const response = await fetchRepliers<RepliersLocation[]>(
      `/locations?${params.toString()}`
    );
    return response || [];
  } catch (error) {
    console.error("Error searching locations:", error);
    return [];
  }
}

// Get market statistics
export async function getMarketStatistics(
  filters: {
    city?: string;
    state?: string;
    zipCode?: string;
    propertyType?: string;
  } = {}
): Promise<RepliersMarketStats> {
  try {
    const params = new URLSearchParams();
    if (filters.city) params.append("city", filters.city);
    if (filters.state) params.append("state", filters.state);
    if (filters.zipCode) params.append("zipCode", filters.zipCode);
    if (filters.propertyType) params.append("propertyType", filters.propertyType);

    const response = await fetchRepliers<RepliersMarketStats>(
      `/market/statistics?${params.toString()}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching market statistics:", error);
    return {};
  }
}

// Helper function to convert Repliers listing to a format compatible with our map
export function convertListingToMapData(listings: RepliersListing[]) {
  return listings
    .filter((listing) => listing.location?.latitude && listing.location?.longitude)
    .map((listing, index, array) => {
      if (index === 0) {
        const next = array[1];
        if (next && next.location?.latitude && next.location?.longitude) {
          return {
            start: {
              lat: listing.location!.latitude!,
              lng: listing.location!.longitude!,
              label: listing.address.city || "Property",
            },
            end: {
              lat: next.location!.latitude!,
              lng: next.location!.longitude!,
            },
          };
        }
      }
      const prev = array[index - 1];
      if (prev && prev.location?.latitude && prev.location?.longitude) {
        return {
          start: {
            lat: prev.location!.latitude!,
            lng: prev.location!.longitude!,
          },
          end: {
            lat: listing.location!.latitude!,
            lng: listing.location!.longitude!,
            label: listing.address.city || "Property",
          },
        };
      }
      return null;
    })
    .filter((dot): dot is NonNullable<typeof dot> => dot !== null);
}

