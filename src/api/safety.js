import { API } from './axios';

export const fetchSafetyGrade = async (emdName) => {
  return API.get(`/seongbuk/district/${encodeURIComponent(emdName)}`);
};
