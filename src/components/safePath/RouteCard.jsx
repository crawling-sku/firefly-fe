import styles from './RouteCard.module.css';

import distanceIcon from '../../assets/distance.png';
import timeIcon from '../../assets/time.png';
import scoreIcon from '../../assets/score.png';

const RouteCard = ({ route, isRecommended = false }) => {
  const { label, distance, duration, cctv, lamps, bells, scoreLabel, scoreStatus } = route;

  const statusClass =
    scoreStatus === '안전' ? styles.statusSafe : scoreStatus === '위험' ? styles.statusDanger : styles.statusNormal;

  return (
    <article className={styles.card}>
      <div className={styles.topRow}>
        <div className={styles.labelBox}>
          {isRecommended && <span className={styles.badge}>추천</span>}
          <span className={styles.label}>{label}</span>

          <div className={styles.meta}>
            <span className={styles.metaItem}>
              <img src={distanceIcon} alt='거리' className={styles.metaIcon} />
              {distance}
            </span>
            <span className={styles.metaItem}>
              <img src={timeIcon} alt='시간' className={styles.metaIcon} />
              {duration}
            </span>
          </div>
        </div>

        <div className={styles.scoreBox}>
          <span className={styles.score}>
            <img src={scoreIcon} alt='점수' className={styles.scoreIcon} />
            {scoreLabel}
          </span>
          <span className={`${styles.status} ${statusClass}`}>{scoreStatus}</span>
        </div>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.facilityRow}>
        <div className={styles.facilityItem}>
          <span className={styles.facilityLabel}>CCTV</span>
          <span className={styles.facilityValue}>{cctv}개</span>
        </div>
        <div className={styles.facilityItem}>
          <span className={styles.facilityLabel}>가로등</span>
          <span className={styles.facilityValue}>{lamps}개</span>
        </div>
        <div className={styles.facilityItem}>
          <span className={styles.facilityLabel}>비상벨</span>
          <span className={styles.facilityValue}>{bells}개</span>
        </div>
      </div>
    </article>
  );
};

export default RouteCard;
