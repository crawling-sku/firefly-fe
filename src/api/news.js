import { API } from './axios';

export const getSafetyNewsTop3 = (region = '성북구') => {
  return API.get('/seongbuk/news/top3', {
    params: { region },
  });
};
