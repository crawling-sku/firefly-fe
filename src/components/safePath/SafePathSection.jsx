import { useEffect, useState } from 'react';
import RouteSearchSection from './RouteSearchSection';
import RouteCard from './RouteCard';
import styles from './SafePathSection.module.css';

import alertIcon from '../../assets/alert.png';
import { fetchSafetyGrade } from '../../api/safety';

const getScoreStatus = (score) => {
  if (score >= 60) return '안전';
  if (score >= 40) return '보통';
  return '위험';
};

const buildRouteData = (type, route) => {
  if (!route) return null;

  const label = type === 'shortest' ? '최단 거리 경로' : '안전 우선 경로';

  const distanceText =
    route.distance >= 1000 ? `${(route.distance / 1000).toFixed(1)}km` : `${Math.round(route.distance)}m`;

  const minutes = Math.round(route.duration / 60);
  const durationText = `약 ${minutes}분`;

  const cctv = route.cctv ?? 0;
  const lamps = route.lamp ?? route.lamps ?? 0;
  const bells = route.bell ?? route.bells ?? 0;

  const score = route.safetyScore ?? 0;

  return {
    id: type,
    label,
    distance: distanceText,
    duration: durationText,
    cctv,
    lamps,
    bells,
    score,
    scoreLabel: `${score}점`,
    scoreStatus: getScoreStatus(score),
    coords: route.coords ?? [],
  };
};

const SafePathSection = ({ period, time, emdName }) => {
  const [currentGrade, setCurrentGrade] = useState('주의');

  const [routes, setRoutes] = useState([]);
  const [recommendedRouteId, setRecommendedRouteId] = useState(null);

  const safeEmdName = emdName ?? '정릉동';
  const safePeriod = period ?? '밤';
  const safeTime = time ?? '2200';

  const rawHour = parseInt(String(safeTime).slice(0, 2), 10);
  const displayHour = rawHour > 12 ? rawHour - 12 : rawHour || 0;
  const timeLabel = `${safePeriod} ${displayHour}시`;

  useEffect(() => {
    const loadGrade = async () => {
      try {
        const data = await fetchSafetyGrade(safeEmdName);
        const grade = data?.grade || data?.fsiGrade || '주의';
        setCurrentGrade(grade);
      } catch (e) {
        console.error('안전 등급 불러오기 실패:', e);
      }
    };

    loadGrade();
  }, [safeEmdName]);

  const gradePhrase =
    currentGrade === '위험'
      ? '평소보다 높습니다'
      : currentGrade === '주의'
        ? '평소보다 주의가 필요합니다'
        : '평소보다 낮습니다';

  const gradeColorClass = currentGrade === '위험' ? styles.red : currentGrade === '주의' ? styles.yellow : styles.green;

  const handleRouteResult = (data) => {
    if (!data) {
      setRoutes([]);
      setRecommendedRouteId(null);
      return;
    }

    const shortest = buildRouteData('shortest', data.shortest);
    const safest = buildRouteData('safest', data.safest);

    const nextRoutes = [shortest, safest].filter(Boolean);

    if (nextRoutes.length === 0) {
      setRoutes([]);
      setRecommendedRouteId(null);
      return;
    }

    nextRoutes.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

    setRoutes(nextRoutes);

    setRecommendedRouteId(nextRoutes[0].id);
  };

  return (
    <section className={styles.wrapper}>
      <header className={styles.header}>
        <h2 className={styles.title}>안심 귀갓길 추천 서비스</h2>

        <div className={styles.alertBox}>
          <img src={alertIcon} alt='위험 알림' className={styles.alertIcon} />
          <div className={styles.alertText}>
            <p className={styles.alertMain}>
              오늘 {timeLabel}에는 <strong>성북구 {safeEmdName} 일대</strong>의 예상 위험도가{' '}
              <strong className={gradeColorClass}>{gradePhrase}</strong>
            </p>
            <p className={styles.alertSub}>안심 귀갓길을 이용하시고, 위험 지역 진입 시 주변의 상황을 잘 살펴보세요.</p>
          </div>
        </div>
      </header>

      <RouteSearchSection onRouteResult={handleRouteResult} />

      <section className={styles.recommendSection}>
        {routes.length === 0 ? (
          <p className={styles.routePlaceholder}>출발지와 도착지를 입력하고 경로를 추천받아보세요.</p>
        ) : (
          <div className={styles.routeList}>
            {routes.map((route) => (
              <RouteCard key={route.id} route={route} isRecommended={route.id === recommendedRouteId} />
            ))}
          </div>
        )}
      </section>

      <section className={styles.tipsSection}>
        <h3 className={styles.tipsTitle}>안전 귀가 팁</h3>
        <ul className={styles.tipsList}>
          <li>
            <span className={styles.checkIcon}>✓</span>
            가능한 사람이 많고 밝은 길로 이동하세요.
          </li>
          <li>
            <span className={styles.checkIcon}>✓</span>
            이면도로와 인적이 드문 골목은 가급적 피해주세요.
          </li>
          <li>
            <span className={styles.checkIcon}>✓</span>
            위험을 느끼면 즉시 112에 신고하세요.
          </li>
          <li>
            <span className={styles.checkIcon}>✓</span>
            비상벨 위치를 미리 확인해두면 더 안전해요.
          </li>
        </ul>
      </section>
    </section>
  );
};

export default SafePathSection;
