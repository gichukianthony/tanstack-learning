import type { Service } from "@/components/services/Service";

const url = 'http://localhost:8000';



// Helper function to handle API responses and errors
const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}: ${response.statusText}`;

    try {
      // Try to parse as JSON first
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } else {
        // If not JSON, try to read as text
        const errorText = await response.text();
        if (errorText) {
          errorMessage = errorText;
        }
      }
    } catch (parseError) {
      // If parsing fails, use the default error message
      console.warn('Failed to parse error response:', parseError);
    }

    throw new Error(errorMessage);
  }
  return response;
};

// GET all services
export const getServices = async (): Promise<Service[]> => {
  const response = await fetch(`${url}/services`);
  await handleApiResponse(response);
  const json = await response.json();
  return json.data;
};

// PATCH update service
export const updateService = async (id: string, data: Partial<Service>): Promise<Service> => {
  const response = await fetch(`${url}/services/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  await handleApiResponse(response);
  return response.json();
};

// DELETE service
export const deleteService = async (id: string): Promise<{ success: boolean }> => {
  const response = await fetch(`${url}/services/${id}`, {
    method: 'DELETE',
  });
  await handleApiResponse(response);
  return { success: response.ok };
};

// POST create service
export const createService = async (data: Partial<Service>): Promise<Service> => {
  const response = await fetch(`${url}/services`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  await handleApiResponse(response);
  return response.json();
};