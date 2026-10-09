const BASE_URL = 'http://localhost:5005'; 
export const apiRequest = async (endpoint, method = 'GET', body = null) => {
  const token = localStorage.getItem('roleapp_token');
  
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

 try {
    let calibratedEndpoint = endpoint;
    if (endpoint.startsWith('/requests')) {
      calibratedEndpoint = `/api${endpoint}`;
    }
    const response = await fetch(`${BASE_URL}${calibratedEndpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.Error || 'Error on the request');
    }
    
    return data;
  } catch (error) {
    console.error(`API Error in ${endpoint}:`, error.message);
    throw error;
  }
};