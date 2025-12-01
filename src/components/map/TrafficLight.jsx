import styles from './TrafficLight.module.css';

const TrafficLight = () => {
  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>신호등색으로 범죄 위험도 알아보세요!</p>

      <div className={styles.trafficLight}>
        <span className={`${styles.light} ${styles.redLight}`} />
        <span className={`${styles.light} ${styles.yellowLight}`} />
        <span className={`${styles.light} ${styles.greenLight}`} />
      </div>

      <div className={styles.labelRow}>
        <span className={styles.label}>위험한 편</span>
        <span className={styles.label}>주의요망</span>
        <span className={styles.label}>안전한 편</span>
      </div>
    </div>
  );
};

export default TrafficLight;
