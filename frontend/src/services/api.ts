// Base API configuration
export const API_BASE_URL = 'http://localhost:5001/api';

// Generic API response handler
async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  
  if (!data.success) {
    const errorMessage = data.details || data.error || 'API request failed';
    console.error('API Error:', errorMessage, data);
    throw new Error(errorMessage);
  }
  
  return data.data;
}

// Generic fetch wrapper
async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  
  return handleResponse<T>(response);
}

export { apiFetch };
