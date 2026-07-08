import { createProxyMiddleware } from 'http-proxy-middleware';
import { config } from '../config';

export const serviceProxies = config.services.map(service =>
  createProxyMiddleware({
    target: service.target,
    changeOrigin: true,
    pathFilter: service.prefix,
  }),
);
