const axios = require('axios');

const axiosReq = axios.create({
  baseURL: 'https://d.apicloud.com/mcm/api'
});

axiosReq({
  url: '/todo'
}).then(res => {
  console.log(res.data);
});
