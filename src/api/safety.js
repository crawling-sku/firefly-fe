import { API } from './axios';

export const fetchSafetyGrade = async (emdName) => {
  try {
    const data = await API.get(`/seongbuk/district/${encodeURIComponent(emdName)}`);
    return data;
  } catch (e) {
    console.error('fetchSafetyGrade 오류:', e);
    throw e;
  }
};

export const fetchPoliceCenters = async (emdName) => {
  try {
    const data = await API.get(`/seongbuk/police/${encodeURIComponent(emdName)}`);
    return data;
  } catch (e) {
    console.error('fetchPoliceCenters 오류:', e);
    throw e;
  }
};

export const getSeongbukDistricts = () => API.get('/seongbuk/districts');

export const getSeongbukFacilities = () => API.get('/seongbuk/facilities');

export const getSeongbukDistrictDetail = (emdName) => API.get(`/seongbuk/district/${encodeURIComponent(emdName)}`);
