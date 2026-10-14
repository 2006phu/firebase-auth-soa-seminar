import axios from 'axios';
import { auth } from '../firebase';

/**
 * Gets the current user's Firebase ID token
 * @returns {Promise<string>} The ID token
 */
export const getAuthToken = async () => {
  if (!auth.currentUser) {
    throw new Error('User not authenticated');
  }
  // true forces refresh to get a new token if needed
  return await auth.currentUser.getIdToken(false);
};

/**
 * Calls a protected API endpoint by appending the Bearer token
 * @param {string} baseUrl - The base URL of the API
 * @returns {Promise<any>} The response data
 */
export const callProtectedApi = async (baseUrl) => {
  try {
    const token = await getAuthToken();
    const response = await axios.get(`${baseUrl}/api/protected`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error calling protected API:', error);
    throw error;
  }
};

/**
 * Calls a public API endpoint
 * @param {string} baseUrl - The base URL of the API
 * @returns {Promise<any>} The response data
 */
export const callPublicApi = async (baseUrl) => {
  try {
    const response = await axios.get(`${baseUrl}/api/public`, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error calling public API:', error);
    throw error;
  }
};

/**
 * Gets the user info from the backend
 * @param {string} baseUrl - The base URL of the API
 * @returns {Promise<any>} The user info
 */
export const getUserInfo = async (baseUrl) => {
  try {
    const token = await getAuthToken();
    const response = await axios.get(`${baseUrl}/api/user-info`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error getting user info:', error);
    throw error;
  }
};
