import type { Mechanic } from "@/components/mechanic/interface";


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

// GET all mechanics
export const getMechanics = async (): Promise<Mechanic[]> => {
  const response = await fetch(`${url}/mechanics`);
  await handleApiResponse(response);
  return response.json();
};

// PATCH update mechanic
export const updateMechanic = async (id: string, data: Partial<Mechanic>): Promise<Mechanic> => {
  const response = await fetch(`${url}/mechanics/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  await handleApiResponse(response);
  return response.json();
};

// DELETE mechanic
export const deleteMechanic = async (id: string): Promise<{ success: boolean }> => {
  const response = await fetch(`${url}/mechanics/${id}`, {
    method: 'DELETE',
  });
  await handleApiResponse(response);
  return { success: response.ok };
};
// verify mechanic
export const verifyMechanic = async (id: string): Promise<Mechanic> => {
  const response = await fetch(`${url}/mechanics/${id}/approve`, {
    method: 'POST',
  });
  await handleApiResponse(response);
  return response.json();
};

// reject mechanic
export const rejectMechanic = async (id: string): Promise<Mechanic> => {
  const response = await fetch(`${url}/mechanics/${id}/reject`, {
    method: 'PATCH',
  });
  await handleApiResponse(response);
  return response.json();
}
// suspend mechanic
export const suspendMechanic = async (id: string): Promise<Mechanic> => {
  const response = await fetch(`${url}/mechanics/${id}/suspend`, {
    method: 'PATCH',
  });
  await handleApiResponse(response);
  return response.json();
};

// add mechanic 
export const addMechanic = async (data: Partial<Mechanic>): Promise<Mechanic> => {
  const response = await fetch(`${url}/mechanics`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  await handleApiResponse(response);
  return response.json();
};