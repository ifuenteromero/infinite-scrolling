import axios, { CanceledError, AxiosError } from 'axios';
import endpoints from './endpoints';

const apiClient = axios.create({
	baseURL: endpoints.baseUrl,
});

export default apiClient;

export { CanceledError, AxiosError };
