import { API } from './axios';

export const getSafePath = (start, end, priority) => {
  return API.post('/safe-path', { start, end, priority });
};
