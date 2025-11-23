import { Outlet, useLocation } from 'react-router-dom';
import Footer from '../components/global/footer/Footer';
import Header from '../components/global/header/Header';

export default function MainLayout() {
  const location = useLocation();

  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
