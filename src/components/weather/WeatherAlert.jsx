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

// pty가 0이 아니면 강수 아이콘, 0이면 하늘 아이콘
const getWeatherIcon = (sky, pty) => {
  if (pty !== 0 && PTY_IMAGES[pty]) return PTY_IMAGES[pty];
  if (SKY_IMAGES[sky]) return SKY_IMAGES[sky];
  return SKY_IMAGES[3]; // fallback: 구름많음
};

const WeatherAlert = ({
  sky,
  pty,
  emdName,
  grade,
  period,
  skyDesc,
  ptyDesc,
  time,
  nowTime, // 원하면 화면에 보여줄 수도 있음
}) => {
  // ------- 안전한 기본 처리 (임시값이 아니라 "없을 때만" 최소 보정) -------
  const skyCode = Number(sky ?? 3);
  const ptyCode = Number(pty ?? 0);
  const safeEmdName = emdName ?? '';
  const safePeriod = period ?? '';
  const safeSkyDesc = skyDesc ?? '';
  const safePtyDesc = ptyDesc ?? '';
  const safeTime = time ?? '0000';
  const currentGrade = grade ?? '안전';

  const icon = getWeatherIcon(skyCode, ptyCode);

  // 상단 "오후 · 구름많음" 이런 텍스트
  const statusText = `${safePeriod} · ${ptyCode !== 0 ? safePtyDesc : safeSkyDesc}`;

  // "2200" → "오후 10시"
  const rawHour = parseInt(String(safeTime).slice(0, 2), 10);
  const displayHour = rawHour > 12 ? rawHour - 12 : rawHour || 0;
  const timeLabel = `${safePeriod} ${displayHour}시`;

  // 위험도 텍스트/색상
  const gradeKey = currentGrade === '위험' ? 'danger' : currentGrade === '주의' ? 'warning' : 'safe';

  const gradeText =
    currentGrade === '위험'
      ? '평소보다 위험한 편입니다'
      : currentGrade === '주의'
        ? '평소보다 주의가 필요합니다'
        : '평소보다 안전합니다';

  const gradeColorClass = currentGrade === '위험' ? styles.red : currentGrade === '주의' ? styles.yellow : styles.green;

  return (
    <div className={styles.container}>
      <div className={styles.leftIconBlock}>
        <img src={icon} alt='날씨 아이콘' className={styles.weatherIcon} />
        <div className={styles.periodText}>{statusText}</div>
        {nowTime && <div className={styles.nowTime}>기준 시각: {nowTime}</div>}
      </div>

      <div className={styles.alertBox}>
        <div className={styles.textArea}>
          <p className={styles.mainText}>
            오늘 {timeLabel}에는 성북구 {safeEmdName} 일대의 예상 위험도가{' '}
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
