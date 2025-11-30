import { API } from './axios';

/**
 * 성북구 날씨 조회
 * @param {string} emdName - 예: "정릉동"
 */
export const fetchSeongbukWeather = async (emdName) => {
  // /seongbuk/weather/{emd_name}
  return API.get(`/seongbuk/weather/${encodeURIComponent(emdName)}`);
};
