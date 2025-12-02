import styles from './DistrictInfoPanel.module.css';
import chartImage from '../../assets/output.png';

const DETAIL_KEY_MAP = {
  cctv: 'CCTV',
  lamp: '보안등',
  bell: '안심벨',
  guide112: '112 신고 안내',
  mark: '노면표기',
};

const BADGE_CONFIG = [
  { type: 'cctv', label: 'CCTV' },
  { type: 'lamp', label: '가로등' },
  { type: 'bell', label: '비상벨' },
  { type: 'guide112', label: '112 신고 안내' },
  { type: 'mark', label: '노면표기' },
];

const DistrictInfoPanel = ({ open, onClose, dongName, detail, loading }) => {
  if (!open) return null;

  const title = detail?.emdName || dongName;
  const counts = detail?.facilityCounts || {};
  const grade = detail?.grade ?? '-';
  const fsi = detail?.fsi ?? '-';

  const renderBadge = (cfg) => {
    const key = DETAIL_KEY_MAP[cfg.type];
    const count = key ? counts[key] || 0 : 0;
    if (!count) return null;

    return (
      <div key={cfg.type} className={`${styles.badge} ${styles[`badge_${cfg.type}`]}`}>
        <span className={styles.badgeLabel}>{cfg.label}</span>
        <span className={styles.badgeCount}>{count}개</span>
      </div>
    );
  };

  return (
    <aside className={styles.panel}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <button type='button' className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
      </div>

      <div className={styles.badgeRow}>{BADGE_CONFIG.map(renderBadge)}</div>

      <div className={styles.infoRow}>
        <span className={styles.grade}>등급: {grade}</span>
        <span className={styles.fsi}>안전지수(FSI): {fsi}</span>
      </div>

      <div className={styles.chartBox}>
        {loading ? (
          '불러오는 중...'
        ) : (
          <img src={chartImage} alt={`${title} 동별 안전시설 그래프`} className={styles.chartImage} />
        )}
      </div>
    </aside>
  );
};

export default DistrictInfoPanel;
