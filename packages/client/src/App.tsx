import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import DataTablePage from './pages/DataTablePage';
import SearchPage from './pages/SearchPage';
import SearchResultsPage from './pages/SearchResultsPage';
import FileDetailsPage from './pages/FileDetailsPage';
import AppsPage from './pages/AppsPage';
import ContributingPage from './pages/ContributingPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="data-table" element={<DataTablePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="search-results" element={<SearchResultsPage />} />
          <Route path="file-details" element={<FileDetailsPage />} />
          <Route path="apps" element={<AppsPage />} />
          <Route path="contributing" element={<ContributingPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;