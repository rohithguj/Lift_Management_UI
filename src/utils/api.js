import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5000', // Your backend URL
});

export const getLiftData = async () => {
  try {
    const response = await api.get('/get_all_lifts');
    console.log(response)
    return response.data.data;
  } catch (error) {
    console.error('Error fetching lift data:', error);
    return {};
  }
};
