const url = 'http://localhost:8000';
export interface registerData{
  id: string;
  email: string;
  first_name: string;
  last_name?: string;
  phone?: string;
  role: string;
  createAt: Date;
  password: string;
}
export async function RegisterUser(data: registerData) {
  const response = await fetch(`${url}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const responseData = await response.json();
  if (!response.ok) {
    let errorMessage = `Registration failed with status ${response.status}: ${response.statusText}`;
    if (responseData && responseData.message) {
      errorMessage = responseData.message;
    }
    throw new Error(errorMessage);
  }
  return responseData;
}