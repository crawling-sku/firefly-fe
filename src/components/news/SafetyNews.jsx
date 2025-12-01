import { useEffect, useState } from 'react';
import { getSafetyNewsTop3 } from '../../api/news';
import styles from './SafetyNews.module.css';
import linkIcon from '../../assets/link.png';

const SafetyNews = ({ region = '성북구' }) => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getSafetyNewsTop3(region);
        setNewsList(data?.news || []);
      } catch (err) {
        console.error(err);
        setError('안전 뉴스를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [region]);

  if (loading) {
    return (
      <section className={styles.wrapper}>
        <p className={styles.loading}>불러오는 중...</p>
      </section>
    );
  }
  if (error) {
    return <section className={styles.wrapper}>{error}</section>;
  }

  if (!newsList.length) {
    return (
      <section className={styles.wrapper}>
        <h2 className={styles.title}>최근 안전 뉴스</h2>
        <p className={styles.emptyText}>표시할 뉴스가 없습니다.</p>
      </section>
    );
  }

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>최근 안전 뉴스</h2>

      <div className={styles.cardList}>
        {newsList.map((item, idx) => (
          <article key={idx} className={styles.card}>
            <div className={styles.cardTop}>
              <span className={styles.date}>{item.date}</span>

              {item.link && (
                <a href={item.link} target='_blank' rel='noopener noreferrer' className={styles.linkButton}>
                  <img src={linkIcon} alt='링크 열기' className={styles.linkIcon} />
                </a>
              )}
            </div>

            <h3 className={styles.cardTitle}>{item.title}</h3>

            <p className={styles.summary}>{item.summary}</p>

            {item.keyword && <span className={styles.keywordBadge}>{item.keyword}</span>}
          </article>
        ))}
      </div>
    </section>
  );
};

export default SafetyNews;
