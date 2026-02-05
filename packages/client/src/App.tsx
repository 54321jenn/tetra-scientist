import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { UserModeProvider, useUserMode } from './contexts/UserModeContext';
import Layout from './components/Layout';
import ITAdminLayout from './components/ITAdminLayout';
import HomePage from './pages/HomePage';
import DataTablePage from './pages/DataTablePage';
import SearchPage from './pages/SearchPage';
import SearchResultsPage from './pages/SearchResultsPage';
import FileDetailsPage from './pages/FileDetailsPage';
import AppsPage from './pages/AppsPage';
import ITSearchPage from './pages/ITSearchPage';
import PersonaSelectPage from './pages/PersonaSelectPage';

function AppRoutes() {
  const { userMode } = useUserMode();

  // Show persona selection if no mode selected
  if (userMode === null) {
    return <PersonaSelectPage />;
  }

  // Redirect based on user mode
  if (userMode === 'it') {
    return (
      <Routes>
        <Route path="/it" element={<ITAdminLayout />}>
          <Route index element={<ITSearchPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/it" replace />} />
      </Routes>
    );
  }

  // Scientist mode
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="data-table" element={<DataTablePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="search-results" element={<SearchResultsPage />} />
        <Route path="details/:id" element={<FileDetailsPage />} />
        <Route path="apps" element={<AppsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <UserModeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </UserModeProvider>
  );
}

export default App;