// src/components/weather/WeatherAlert.jsx
import styles from './WeatherAlert.module.css';

import sky1 from '../../assets/weather/sky_1.png';
import sky3 from '../../assets/weather/sky_3.png';
import sky4 from '../../assets/weather/sky_4.png';

import pty0 from '../../assets/weather/pty_0.png';
import pty1 from '../../assets/weather/pty_1.png';
import pty2 from '../../assets/weather/pty_2.png';
import pty3 from '../../assets/weather/pty_3.png';
import pty5 from '../../assets/weather/pty_5.png';
import pty6 from '../../assets/weather/pty_6.png';
import pty7 from '../../assets/weather/pty_7.png';

const SKY_IMAGES = { 1: sky1, 3: sky3, 4: sky4 };
const PTY_IMAGES = { 0: pty0, 1: pty1, 2: pty2, 3: pty3, 5: pty5, 6: pty6, 7: pty7 };

// pty가 0이 아니면 강수 아이콘, 아니면 하늘 상태 아이콘
const getWeatherIcon = (sky, pty) => (pty !== 0 ? PTY_IMAGES[pty] : SKY_IMAGES[sky]);

const WeatherAlert = ({
  sky = 3,
  pty = 0,
  emdName = '정릉동',
  grade = '위험',
  period = '오후',
  skyDesc = '구름많음',
  ptyDesc = '강수없음',
  time = '2200', // "2200" 형식
}) => {
  const icon = getWeatherIcon(sky, pty);

  // 상단 작은 텍스트: "오후 · 구름많음" 또는 "오후 · 비"
  const statusText = `${period} · ${pty !== 0 ? ptyDesc : skyDesc}`;

  // "2200" → 22 → 10, "오후 10시" 이런 식으로 표시
  const rawHour = parseInt(String(time).slice(0, 2), 10);
  const displayHour = rawHour > 12 ? rawHour - 12 : rawHour || 0;
  const timeLabel = `${period} ${displayHour}시`;

  const gradeKey = grade === '위험' ? 'danger' : grade === '주의' ? 'warning' : 'safe';
  const gradeText =
    grade === '위험'
      ? '평소보다 위험한 편입니다'
      : grade === '주의'
        ? '평소보다 주의가 필요합니다'
        : '평소보다 안전합니다';

  const gradeColorClass = grade === '위험' ? styles.red : grade === '주의' ? styles.yellow : styles.green;

  return (
    <div className={styles.container}>
      {/* 왼쪽 아이콘 + "오후 · 구름많음" */}
      <div className={styles.leftIconBlock}>
        <img src={icon} alt='날씨 아이콘' className={styles.weatherIcon} />
        <div className={styles.periodText}>{statusText}</div>
      </div>

      {/* 오른쪽 박스 (문구 + 신호등) */}
      <div className={styles.alertBox}>
        <div className={styles.textArea}>
          <p className={styles.mainText}>
            오늘 {timeLabel}에는 성북구 {emdName} 일대의 예상 위험도가{' '}
            <span className={gradeColorClass}>{gradeText}</span>
          </p>
          <p className={styles.blue}>안심 귀갓길을 이용해보세요!</p>
        </div>

        {/* 신호등 */}
        <div className={styles.trafficLight}>
          <span className={`${styles.light} ${styles.redLight} ${gradeKey === 'danger' ? styles.active : ''}`} />
          <span className={`${styles.light} ${styles.yellowLight} ${gradeKey === 'warning' ? styles.active : ''}`} />
          <span className={`${styles.light} ${styles.greenLight} ${gradeKey === 'safe' ? styles.active : ''}`} />
        </div>
      </div>
    </div>
  );
};

export default WeatherAlert;
