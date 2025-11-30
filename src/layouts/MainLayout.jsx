import { Outlet } from 'react-router-dom';
import Footer from '../components/global/footer/Footer';
import Header from '../components/global/header/Header';
import styles from './MainLayout.module.css';

export default function MainLayout() {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
