import axios from 'axios';

export const postFunc = (url, data) => axios.post(url, data);
