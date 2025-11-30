import styles from './Header.module.css';
import logo from '../../../assets/logo.png';
import firefly from '../../../assets/firefly.png';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* 왼쪽 로고 + 슬로건 */}
        <div className={styles.left}>
          <img src={logo} alt='반딧불이 로고' className={styles.logo} />
          <p className={styles.slogan}>보이는 안전을 제공합니다</p>
        </div>

        <div className={styles.right}>
          <img src={firefly} alt='반딧불이' className={styles.firefly} />
        </div>
      </div>
    </header>
  );
};

export default Header;
