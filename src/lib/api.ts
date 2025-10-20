import type {
  MockEndpoint,
  CreateMockEndpointDto,
  UpdateMockEndpointDto,
  ApiStats,
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  PublicUser,
  CreateUserDto,
  UpdateUserDto,
} from "./types";
import {
  getAccessToken,
  getRefreshToken,
  clearSession,
  updateAccessToken,
} from "./auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function handleResponse<T>(response: Response): Promise<T> {
  console.log("Response status:", response.status, response.statusText);

  if (!response.ok) {
    // Get response body as text first (can only be read once)
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const responseText = await response.text();
      if (responseText) {
        // Try to parse as JSON
        try {
          const errorData = JSON.parse(responseText);
          // Extract error message from common error formats
          if (errorData.error) {
            errorMessage = errorData.error;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (typeof errorData === 'string') {
            errorMessage = errorData;
          }
        } catch {
          // If not JSON, use the text as-is
          errorMessage = responseText;
        }
      }
    } catch (error) {
      console.error("Failed to read error response:", error);
    }
    console.error("API Error:", errorMessage);
    throw new Error(errorMessage);
  }

  const data = await response.json();
  console.log("API Response data:", data);
  return data;
}

/**
 * Refresh access token using refresh token
 */
async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const res = await fetch(`${API_BASE}/api-auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    clearSession();
    // Try to get error message from response
    let errorMessage = "Failed to refresh token";
    try {
      const responseText = await res.text();
      if (responseText) {
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          errorMessage = responseText;
        }
      }
    } catch {
      // Use default error message
    }
    throw new Error(errorMessage);
  }

  const data = await handleResponse<AuthResponse>(res);
  updateAccessToken(data.accessToken);
  return data.accessToken;
}

/**
 * Authorized fetch wrapper that handles token attachment and refresh
 */
async function authorizedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getAccessToken();

  // Attach Authorization header if token exists
  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response = await fetch(url, {
    ...options,
    headers,
  });

  // If 401, try to refresh token and retry once
  if (response.status === 401 && token) {
    try {
      const newToken = await refreshAccessToken();

      // Retry with new token
      headers.set("Authorization", `Bearer ${newToken}`);
      response = await fetch(url, {
        ...options,
        headers,
      });
    } catch (error) {
      console.error("Token refresh failed:", error);
      clearSession();
      throw error;
    }
  }

  return response;
}

export const api = {
  // Auth endpoints
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const res = await fetch(`${API_BASE}/api-auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return handleResponse<AuthResponse>(res);
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const res = await fetch(`${API_BASE}/api-auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return handleResponse<AuthResponse>(res);
  },

  refresh: async (refreshToken: string): Promise<AuthResponse> => {
    const res = await fetch(`${API_BASE}/api-auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    return handleResponse<AuthResponse>(res);
  },

  getUsers: async (): Promise<PublicUser[]> => {
    const res = await authorizedFetch(`${API_BASE}/api-auth/users`);
    return handleResponse<PublicUser[]>(res);
  },

  createUser: async (data: CreateUserDto): Promise<PublicUser> => {
    const res = await authorizedFetch(`${API_BASE}/api-auth/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<PublicUser>(res);
  },

  updateUser: async (id: string, data: UpdateUserDto): Promise<PublicUser> => {
    const res = await authorizedFetch(`${API_BASE}/api-auth/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<PublicUser>(res);
  },

  deleteUser: async (id: string): Promise<void> => {
    const res = await authorizedFetch(`${API_BASE}/api-auth/users/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      let errorMessage = `HTTP error! status: ${res.status}`;
      try {
        const responseText = await res.text();
        if (responseText) {
          try {
            const errorData = JSON.parse(responseText);
            if (errorData.error) {
              errorMessage = errorData.error;
            } else if (errorData.message) {
              errorMessage = errorData.message;
            }
          } catch {
            errorMessage = responseText;
          }
        }
      } catch (error) {
        console.error("Failed to read error response:", error);
      }
      throw new Error(errorMessage);
    }
  },

  // Mock endpoint endpoints (using authorizedFetch for future-proofing)
  getEndpoints: async (): Promise<MockEndpoint[]> => {
    const res = await authorizedFetch(`${API_BASE}/api-mock/endpoints`);
    return handleResponse<MockEndpoint[]>(res);
  },

  getEndpoint: async (id: string): Promise<MockEndpoint> => {
    const res = await authorizedFetch(`${API_BASE}/api-mock/endpoints/${id}`);
    return handleResponse<MockEndpoint>(res);
  },

  createEndpoint: async (
    data: CreateMockEndpointDto
  ): Promise<MockEndpoint> => {
    const res = await authorizedFetch(`${API_BASE}/api-mock/endpoints`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<MockEndpoint>(res);
  },

  updateEndpoint: async (
    id: string,
    data: UpdateMockEndpointDto
  ): Promise<MockEndpoint> => {
    const res = await authorizedFetch(`${API_BASE}/api-mock/endpoints/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<MockEndpoint>(res);
  },

  deleteEndpoint: async (id: string): Promise<void> => {
    const res = await authorizedFetch(`${API_BASE}/api-mock/endpoints/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      // Get response body as text first (can only be read once)
      let errorMessage = `HTTP error! status: ${res.status}`;
      try {
        const responseText = await res.text();
        if (responseText) {
          // Try to parse as JSON
          try {
            const errorData = JSON.parse(responseText);
            if (errorData.error) {
              errorMessage = errorData.error;
            } else if (errorData.message) {
              errorMessage = errorData.message;
            }
          } catch {
            // If not JSON, use the text as-is
            errorMessage = responseText;
          }
        }
      } catch (error) {
        console.error("Failed to read error response:", error);
      }
      throw new Error(errorMessage);
    }
  },

  getStats: async (): Promise<ApiStats> => {
    const res = await authorizedFetch(`${API_BASE}/api-mock/stats`);
    return handleResponse<ApiStats>(res);
  },
};
