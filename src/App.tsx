import { Route, Routes } from 'react-router-dom';
import { Header } from '@/components/Header';
import { CompareBar } from '@/components/CompareBar';
import { CompareProvider } from '@/context/CompareContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { HomePage } from '@/pages/HomePage';
import { DetailPage } from '@/pages/DetailPage';
import { ComparePage } from '@/pages/ComparePage';
import { FavoritesPage } from '@/pages/FavoritesPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

function App() {
  return (
    <FavoritesProvider>
      <CompareProvider>
        <div className="min-h-screen bg-cream text-ink dark:bg-navy dark:text-cream">
          <Header />
          {/* Bottom padding reserves space for the fixed CompareBar so it never
              overlaps page content (e.g. the Load More button) on any route. */}
          <main className="pb-24">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/pokemon/:name" element={<DetailPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <CompareBar />
        </div>
      </CompareProvider>
    </FavoritesProvider>
  );
}

export default App;
