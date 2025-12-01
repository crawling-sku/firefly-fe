import styles from './SafetyItem.module.css';

import cctvImg from '../../assets/cctv.png';
import lightImg from '../../assets/light.png';
import bellImg from '../../assets/bell.png';
import stationImg from '../../assets/station.png';

const SafetyItem = ({ facilityCounts, policeCount }) => {
  const items = [
    {
      icon: cctvImg,
      label: 'CCTV',
      value: facilityCounts?.['CCTV'] ?? 0,
      unit: '개',
      subText: '반경 500m 기준',
      color: '#1A1A1A',
    },
    {
      icon: lightImg,
      label: '보안등',
      value: facilityCounts?.['보안등'] ?? 0,
      unit: '개',
      subText: '반경 500m 기준',
      color: '#F59E0B',
    },
    {
      icon: stationImg,
      label: '치안시설',
      value: policeCount ?? 0,
      unit: '개',
      subText: '경찰서·파출소·지구대 개수',
      color: '#409EE3',
    },
    {
      icon: bellImg,
      label: '비상벨',
      value: facilityCounts?.['안심벨'] ?? 0,
      unit: '개',
      subText: '반경 500m 기준',
      color: '#EF4444',
    },
  ];

  return (
    <section className={styles.wrapper}>
      <h3 className={styles.title}>내 주변의 안전 요소</h3>

      <div className={styles.row}>
        {items.map((item, idx) => (
          <div key={idx} className={styles.box}>
            <div className={styles.headerRow}>
              <img src={item.icon} alt={item.label} className={styles.icon} />
              <span className={styles.label}>{item.label}</span>
            </div>

            <div className={styles.valueRow}>
              <span className={styles.value} style={{ color: item.color }}>
                {item.value}
              </span>
              <span className={styles.unit}>{item.unit}</span>
            </div>

            <p className={styles.subText}>{item.subText}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SafetyItem;
