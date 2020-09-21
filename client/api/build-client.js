import axios from 'axios';

// DEV
// baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local'

const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    return axios.create({
      baseURL: 'www.measurement-app-prod.site/',
      headers: req.headers,
    });
  } else {
    return axios.create({
      baseURL: '/',
      headers: req.headers,
    });
  }
};

export default buildClient;
