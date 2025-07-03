
const url = 'http://localhost:8000';

export async function LoginUser(data: { email: string; password: string }) {
    const response = await fetch(`${url}/auth/signin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const responseData = await response.json();
    if (!response.ok) {
        // custom error message
        let errorMessage = 'login failed';
        if (responseData && responseData.message) {
            errorMessage = responseData.message;
        }
        throw new Error(errorMessage);
    
    }
    return responseData;
}