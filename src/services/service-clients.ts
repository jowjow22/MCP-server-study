import env from '../utils/environment.js';
import axios, { AxiosInstance } from "axios";

class HttpClient {
  private instance: AxiosInstance;

  constructor(baseURL: string, token: string) {
    this.instance = axios.create({
      baseURL: baseURL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async get(path: string, params: Record<string, string> = {}) {
    const response = await this.instance.get(path, { params });
    return response.data;
  }

  async post(path: string, data: Record<string, string> = {}) {
    const response = await this.instance.post(path, data);
    return response.data;
  }

  async put(path: string, data: Record<string, string> = {}) {
    const response = await this.instance.put(path, data);
    return response.data;
  }

  async delete(path: string) {
    const response = await this.instance.delete(path);
    return response.data;
  }
}

class GraphQLClient {
  private instance: AxiosInstance;

  constructor(baseURL: string, token: string, headers: Record<string, string>) {
    this.instance = axios.create({
      baseURL,
      headers: {
        Authorization: token,
        ...headers,
      },
    });
  }

  async query(query: string) {
    const response = await this.instance.post("", {
      query,
    });
    return response.data;
  }
}



const sentry_client = new HttpClient('https://sentry.io/api/0', env.SENTRY_USER_API_KEY);
const monday_client = new GraphQLClient('https://api.monday.com/v2', env.MONDAY_API_KEY, {
    'Content-Type': 'application/json',
    'API-Version': '2025-01'
});

export { sentry_client, monday_client };
