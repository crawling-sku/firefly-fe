import { useEffect, useState } from 'react';
import { getSeongbukCrimeTop5 } from '../api/crime';
import styles from './CrimeTop5.module.css';

const CrimeTop5 = () => {
  const [crimeData, setCrimeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCrime = async () => {
      try {
        setLoading(true);
        const data = await getSeongbukCrimeTop5();
        setCrimeData(data);
      } catch (err) {
        console.error(err);
        setError('데이터를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchCrime();
  }, []);

  if (error) {
    return <section className={styles.wrapper}>{error}</section>;
  }

  if (!crimeData) return null;

  const maxCount = Math.max(...crimeData.top5.map((item) => item.count));

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>지금 성북구는?</h2>

      <div className={styles.card}>
        <div className={styles.headerRow}>
          <span className={styles.subTitle}>성북구 5대 범죄</span>
        </div>

        <ul className={styles.list}>
          {crimeData.top5.map((item) => (
            <li key={item.label} className={styles.item}>
              <div className={styles.topRow}>
                <span className={styles.label}>{item.label}</span>
                <span className={styles.count}>{item.display}</span>
              </div>

              <div className={styles.barWrapper}>
                <div
                  className={styles.bar}
                  style={{
                    width: `${(item.count / maxCount) * 100}%`,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default CrimeTop5;
