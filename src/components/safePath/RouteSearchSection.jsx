import { useState, useEffect, useRef } from 'react';
import styles from './RouteSearchSection.module.css';

import startIcon from '../../assets/start.png';
import endIcon from '../../assets/end.png';
import { getSafePath } from '../../api/safePath';

const RouteSearchSection = ({ onRouteResult }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [priority, setPriority] = useState(100);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const polylineRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    const { kakao } = window;
    if (!kakao || !kakao.maps) {
      console.error('Kakao Maps JS SDK가 로드되지 않았습니다.');
      return;
    }

    const container = mapRef.current;
    if (!container) return;

    const map = new kakao.maps.Map(container, {
      center: new kakao.maps.LatLng(37.589426, 127.016715),
      level: 5,
    });
    mapInstanceRef.current = map;
  }, []);

  const geocodeByKeyword = (keyword) =>
    new Promise((resolve, reject) => {
      const { kakao } = window;
      if (!kakao?.maps?.services) {
        reject(new Error('Kakao Maps services가 준비되지 않았습니다.'));
        return;
      }

      const places = new kakao.maps.services.Places();
      places.keywordSearch(keyword, (data, status) => {
        if (status === kakao.maps.services.Status.OK && data.length > 0) {
          const first = data[0];
          resolve({ lat: Number(first.y), lng: Number(first.x) });
        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
          reject(new Error(`"${keyword}" 검색 결과가 없습니다.`));
        } else {
          reject(new Error('장소 검색 중 오류가 발생했습니다.'));
        }
      });
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!from || !to) {
      setError('출발지와 도착지를 모두 입력해주세요.');
      return;
    }

    if (!mapInstanceRef.current) {
      setError('지도가 아직 준비되지 않았습니다.');
      return;
    }

    try {
      setLoading(true);

      const [start, end] = await Promise.all([geocodeByKeyword(from), geocodeByKeyword(to)]);

      const data = await getSafePath(start, end, priority);

      const routeType = priority < 50 ? 'shortest' : 'safest';

      drawRoute(data, routeType);

      if (onRouteResult) {
        onRouteResult(data, routeType);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || '경로를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const drawRoute = (data, routeType) => {
    const { kakao } = window;
    const map = mapInstanceRef.current;
    if (!map || !kakao) return;

    const pathData = routeType === 'shortest' ? data.shortest : data.safest;
    if (!pathData || !pathData.coords || pathData.coords.length === 0) {
      setError('경로 좌표가 없습니다.');
      return;
    }

    const path = pathData.coords.map((p) => new kakao.maps.LatLng(p.lat, p.lng));

    if (polylineRef.current) {
      polylineRef.current.setMap(null);
    }

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const polyline = new kakao.maps.Polyline({
      path,
      strokeWeight: 5,
      strokeColor: routeType === 'shortest' ? '#409EE3' : '#34C759',
      strokeOpacity: 0.8,
      strokeStyle: 'solid',
    });
    polyline.setMap(map);
    polylineRef.current = polyline;

    const startMarker = new kakao.maps.Marker({ map, position: path[0] });
    const endMarker = new kakao.maps.Marker({
      map,
      position: path[path.length - 1],
    });
    markersRef.current = [startMarker, endMarker];

    const bounds = new kakao.maps.LatLngBounds();
    path.forEach((latlng) => bounds.extend(latlng));
    map.setBounds(bounds);
  };

  const handlePriorityChange = (e) => {
    setPriority(Number(e.target.value));
  };

  const snapPriority = () => {
    setPriority((prev) => (prev < 50 ? 0 : 100));
  };

  return (
    <section className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>출발지</label>
            <div className={styles.inputWrapper}>
              <img src={startIcon} alt='출발지 아이콘' className={styles.icon} />
              <input
                type='text'
                className={styles.input}
                placeholder='현재 위치'
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>도착지</label>
            <div className={styles.inputWrapper}>
              <img src={endIcon} alt='도착지 아이콘' className={styles.icon} />
              <input
                type='text'
                className={styles.input}
                placeholder='도착지를 입력하세요'
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className={styles.priorityHeader}>
          <span className={styles.priorityLabel}>경로 우선순위</span>
          <span className={styles.priorityMode}>{priority < 50 ? '거리 우선' : '안전 우선'}</span>
        </div>

        <div className={styles.sliderRow}>
          <span className={styles.sliderSideLabel}>거리</span>
          <input
            type='range'
            min='0'
            max='100'
            value={priority}
            onChange={handlePriorityChange}
            onMouseUp={snapPriority}
            onTouchEnd={snapPriority}
            className={styles.slider}
          />
          <span className={styles.sliderSideLabel}>안전</span>
        </div>

        {error && <p className={styles.errorText}>{error}</p>}
        {loading && <p className={styles.loadingText}>경로를 불러오는 중...</p>}

        <button type='submit' className={styles.searchBtn} disabled={loading}>
          {loading ? '추천 중...' : '경로 추천'}
        </button>
      </form>

      <div className={styles.mapArea}>
        <div ref={mapRef} className={styles.mapPlaceholder} />
      </div>
    </section>
  );
};

export default RouteSearchSection;
