import axios from 'axios';
import { logger } from './logger';

export const httpClient = axios.create({
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
httpClient.interceptors.request.use((config) => {
  logger.debug({ 
    method: config.method?.toUpperCase(), 
    url: config.url 
  }, "📡 Outgoing HTTP Request");
  return config;
});

// Response Interceptor
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    logger.error({ 
      message: error.message, 
      url: error.config?.url 
    }, "❌ HTTP Request Failed");
    return Promise.reject(error);
  }
);