import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layouts';
import HomePage from '../pages/HomePage';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path='/' element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
