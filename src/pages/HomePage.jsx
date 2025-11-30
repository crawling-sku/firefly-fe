// src/pages/HomePage.jsx
import { useEffect, useState } from 'react';
import WeatherAlert from '../components/weather/WeatherAlert';

import { fetchSeongbukWeather } from '../api/weather';
import { fetchSafetyGrade } from '../api/safety';

export default function HomePage() {
  const [weather, setWeather] = useState(null);
  const [grade, setGrade] = useState('안전');

  useEffect(() => {
    const loadData = async () => {
      try {
        const weatherData = await fetchSeongbukWeather('정릉동');
        const safetyData = await fetchSafetyGrade('정릉동');

        setWeather(weatherData);
        setGrade(safetyData.grade);
      } catch (err) {
        console.error('API 오류:', err);
      }
    };

    loadData();
  }, []);

  return (
    <>
      {weather && (
        <WeatherAlert
          sky={weather.sky}
          pty={weather.pty}
          emdName={weather.emdName}
          period={weather.period}
          skyDesc={weather.skyDesc}
          ptyDesc={weather.ptyDesc}
          time={weather.time}
          grade={grade} // 🔥 이제 위험도 API 사용
        />
      )}
    </>
  );
}
