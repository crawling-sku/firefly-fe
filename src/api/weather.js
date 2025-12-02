import { API } from './axios';

export const fetchSeongbukWeather = async (emdName) => {
  return API.get(`/seongbuk/weather/${encodeURIComponent(emdName)}`);
};
