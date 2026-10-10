import { API_URL } from '../config/config';

const BASE_URL = `${ API_URL }`; 
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
    console.log("--- CHEQUEO DE RUTA ---");
console.log("BASE_URL es:", BASE_URL);
console.log("calibratedEndpoint es:", calibratedEndpoint);
console.log("URL FUSIONADA:", `${BASE_URL}${calibratedEndpoint}`);
console.log("-----------------------");
    const response = await fetch(`${BASE_URL}${calibratedEndpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.Error || 'Error on the request');
    }
    return data;
  } catch (error) {
    throw error;
  }
};