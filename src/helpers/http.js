const axios = require('axios').default;

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
