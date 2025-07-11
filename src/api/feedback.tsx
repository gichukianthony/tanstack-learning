import type { Feedback } from "@/components/feedbacks/interface";

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

// GET all feedbacks
export const getFeedbacks = async (): Promise<Feedback[]> => {
  const response = await fetch(`${url}/feedbacks`);
  await handleApiResponse(response);
  const json =await response.json();
  return json.data;
};