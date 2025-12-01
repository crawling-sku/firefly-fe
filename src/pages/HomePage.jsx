import { useEffect, useState } from 'react';
import WeatherAlert from '../components/weather/WeatherAlert';
import SafetyItem from '../components/safetyItem/SafetyItem';
import SeongbukDongMap from '../components/map/SeongbukDongMap';
import CrimeTop5 from '../components/crime/CrimeTop5';
import { fetchSeongbukWeather } from '../api/weather';
import { fetchSafetyGrade, fetchPoliceCenters } from '../api/safety';
import SafetyNews from '../components/news/SafetyNews';

export default function HomePage() {
  const [weather, setWeather] = useState(null);
  const [grade, setGrade] = useState('주의');
  const [safety, setSafety] = useState(null);
  const [police, setPolice] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [weatherData, safetyData, policeData] = await Promise.all([
          fetchSeongbukWeather('정릉동'),
          fetchSafetyGrade('정릉동'),
          fetchPoliceCenters('정릉동'),
        ]);

        // 날씨
        setWeather(weatherData);

        // 안전 지수 (/seongbuk/district)
        if (safetyData) {
          setSafety(safetyData);
          setGrade(safetyData.grade ?? '주의'); // grade 없으면 기본값 '주의'
        }

        // 치안센터 (/seongbuk/police)
        if (policeData) {
          setPolice(policeData);
        }
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
          grade={grade}
        />
      )}

      {safety && police && <SafetyItem facilityCounts={safety.facilityCounts} policeCount={police.count} />}

      <SeongbukDongMap />

      <CrimeTop5 />

      <SafetyNews />
    </>
  );
}
