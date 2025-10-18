import type {
  MockEndpoint,
  CreateMockEndpointDto,
  UpdateMockEndpointDto,
  ApiStats,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function handleResponse<T>(response: Response): Promise<T> {
  console.log('Response status:', response.status, response.statusText);

  if (!response.ok) {
    const error = await response.text();
    console.error('API Error:', error);
    throw new Error(error || `HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log('API Response data:', data);
  return data;
}

export const api = {
  // Get all endpoints
  getEndpoints: async (): Promise<MockEndpoint[]> => {
    const res = await fetch(`${API_BASE}/api-mock/endpoints`);
    return handleResponse<MockEndpoint[]>(res);
  },

  // Get single endpoint
  getEndpoint: async (id: string): Promise<MockEndpoint> => {
    const res = await fetch(`${API_BASE}/api-mock/endpoints/${id}`);
    return handleResponse<MockEndpoint>(res);
  },

  // Create endpoint
  createEndpoint: async (
    data: CreateMockEndpointDto
  ): Promise<MockEndpoint> => {
    const res = await fetch(`${API_BASE}/api-mock/endpoints`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<MockEndpoint>(res);
  },

  // Update endpoint
  updateEndpoint: async (
    id: string,
    data: UpdateMockEndpointDto
  ): Promise<MockEndpoint> => {
    const res = await fetch(`${API_BASE}/api-mock/endpoints/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<MockEndpoint>(res);
  },

  // Delete endpoint
  deleteEndpoint: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/api-mock/endpoints/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || `HTTP error! status: ${res.status}`);
    }
  },

  // Get statistics
  getStats: async (): Promise<ApiStats> => {
    const res = await fetch(`${API_BASE}/api-mock/stats`);
    return handleResponse<ApiStats>(res);
  },
};
