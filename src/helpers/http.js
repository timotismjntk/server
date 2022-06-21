import {default as axios} from 'axios';

const http = (url = 'https://layanan.labura.go.id', data) => {
  return axios.create({
    baseURL: `${url}/`,
    headers: data
      ? {
          Username: data?.NIK,
          Password: data?.password,
        }
      : undefined,
  });
};

export default http;
