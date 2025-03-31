import axios, { AxiosInstance } from 'axios';
class HttpClient {
    private instance: AxiosInstance;

    constructor() {
        this.instance = axios.create({
            baseURL: 'https://sentry.io/api/0',
            headers: {
                Authorization: `Bearer ${process.env.SENTRY_USER_API_KEY}`,
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

export default HttpClient;
