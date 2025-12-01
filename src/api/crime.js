import { API } from './axios';

export const getSeongbukCrimeTop5 = () => {
  return API.get('/seongbuk/crime/Top5');
};
