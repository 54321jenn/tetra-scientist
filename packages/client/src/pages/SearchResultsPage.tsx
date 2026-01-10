import { Table, TableColumn } from '@tetrascience-npm/tetrascience-react-ui';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import './SearchResultsPage.css';

interface SearchResult {
  id: string;
  name: string;
  sourceLocation: string;
  uploadedAt: string;
  uploadedAtRelative: string;
  fileType: 'document' | 'zip' | 'csv';
}

// Sample data for proteomics study 3
const searchResults: SearchResult[] = [
  {
    id: '1',
    name: 'Proteomics-Study3-Protocol.txt',
    sourceLocation: '/tetrasphere/proteomics/study-3/docs',
    uploadedAt: '01/09/2026 04:30:00 PM EST',
    uploadedAtRelative: 'Yesterday',
    fileType: 'document',
  },
  {
    id: '2',
    name: 'Proteomics-Study3-Sample-A1.raw',
    sourceLocation: '/tetrasphere/proteomics/study-3/samples',
    uploadedAt: '01/10/2026 08:15:33 AM EST',
    uploadedAtRelative: 'Today',
    fileType: 'document',
  },
  {
    id: '3',
    name: 'Proteomics-Study3-Sample-A2.raw',
    sourceLocation: '/tetrasphere/proteomics/study-3/samples',
    uploadedAt: '01/10/2026 08:16:12 AM EST',
    uploadedAtRelative: 'Today',
    fileType: 'document',
  },
  {
    id: '4',
    name: 'Proteomics-Study3-Sample-B1.raw',
    sourceLocation: '/tetrasphere/proteomics/study-3/samples',
    uploadedAt: '01/10/2026 08:17:45 AM EST',
    uploadedAtRelative: 'Today',
    fileType: 'document',
  },
  {
    id: '5',
    name: 'Proteomics-Study3-Sample-B2.raw',
    sourceLocation: '/tetrasphere/proteomics/study-3/samples',
    uploadedAt: '01/10/2026 08:18:22 AM EST',
    uploadedAtRelative: 'Today',
    fileType: 'document',
  },
  {
    id: '6',
    name: 'Proteomics-Study3-Control-C1.raw',
    sourceLocation: '/tetrasphere/proteomics/study-3/controls',
    uploadedAt: '01/10/2026 08:20:15 AM EST',
    uploadedAtRelative: 'Today',
    fileType: 'document',
  },
  {
    id: '7',
    name: 'Proteomics-Study3-Control-C2.raw',
    sourceLocation: '/tetrasphere/proteomics/study-3/controls',
    uploadedAt: '01/10/2026 08:21:33 AM EST',
    uploadedAtRelative: 'Today',
    fileType: 'document',
  },
  {
    id: '8',
    name: 'Proteomics-Study3-Metadata.csv',
    sourceLocation: '/tetrasphere/proteomics/study-3/metadata',
    uploadedAt: '01/10/2026 08:25:10 AM EST',
    uploadedAtRelative: 'Today',
    fileType: 'csv',
  },
];

// File type icon components
const DocumentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const ZipIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
  </svg>
);

const CsvIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="8" y1="13" x2="16" y2="13"></line>
    <line x1="8" y1="17" x2="16" y2="17"></line>
  </svg>
);

const getFileIcon = (fileType: string) => {
  switch (fileType) {
    case 'document':
      return <DocumentIcon />;
    case 'zip':
      return <ZipIcon />;
    case 'csv':
      return <CsvIcon />;
    default:
      return <DocumentIcon />;
  }
};



// Additional icon components
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const FilterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const StarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const InfoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const DownloadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const MoreIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
);

function SearchResultsPage() {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set());
      setSelectAll(false);
    } else {
      const allIds = new Set(searchResults.map(r => r.id));
      setSelectedRows(allIds);
      setSelectAll(true);
    }
  };

  const handleRowSelect = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
    setSelectAll(newSelected.size === searchResults.length);
  };

  const hasSelection = selectedRows.size > 0;

  // Add click handlers to table rows
  useEffect(() => {
    if (!tableRef.current) return;

    const handleRowClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const row = target.closest('tbody tr');

      if (!row) return;

      // Don't trigger if clicking on checkbox
      if (target.closest('input[type="checkbox"]')) return;

      const rowIndex = Array.from(row.parentElement!.children).indexOf(row);
      if (rowIndex >= 0 && rowIndex < searchResults.length) {
        handleRowSelect(searchResults[rowIndex].id);
      }
    };

    const tableElement = tableRef.current;
    tableElement.addEventListener('click', handleRowClick);

    return () => {
      tableElement.removeEventListener('click', handleRowClick);
    };
  }, [selectedRows]); // Re-attach when selection changes

  // Add checkbox column to data
  const dataWithCheckbox = searchResults.map(row => ({
    ...row,
    checkbox: (
      <input
        type="checkbox"
        checked={selectedRows.has(row.id)}
        onChange={(e) => {
          e.stopPropagation();
          handleRowSelect(row.id);
        }}
        onClick={(e) => e.stopPropagation()}
        className="row-checkbox"
      />
    ),
    nameWithIcon: (
      <div className="name-cell">
        <span className="file-icon">{getFileIcon(row.fileType)}</span>
        <span>{row.name}</span>
      </div>
    ),
    uploadedAtFormatted: (
      <div className="uploaded-cell">
        <div className="uploaded-date">{row.uploadedAt}</div>
        <div className="uploaded-relative">{row.uploadedAtRelative}</div>
      </div>
    ),
  }));

  // Define table columns
  const columns: TableColumn<typeof dataWithCheckbox[0]>[] = [
    { key: 'checkbox', header: '', width: '50px' },
    { key: 'nameWithIcon', header: 'Name' },
    { key: 'sourceLocation', header: 'Source Location' },
    { key: 'uploadedAtFormatted', header: 'Uploaded At' },
  ];

  return (
    <div className="search-results-page">
      <div className="search-bar-container">
        <div className="search-bar">
          <SearchIcon />
          <input
            type="text"
            placeholder="All data for proteomics study 3"
            className="search-input"
            defaultValue="All data for proteomics study 3"
          />
          <button className="search-icon-btn" aria-label="Search">
            <SearchIcon />
          </button>
          <button className="search-icon-btn" aria-label="Filter">
            <FilterIcon />
          </button>
        </div>
      </div>

      <div className="action-bar">
        <div className="action-bar-left">
          <button className="action-btn" onClick={handleSelectAll}>
            <EditIcon />
            <span>{selectAll ? 'Deselect All' : 'Select All'}</span>
          </button>
          <button className="action-btn">
            <StarIcon />
            <span>Save Search</span>
          </button>
        </div>
        <div className="action-bar-right">
          <button className="action-btn" disabled={!hasSelection}>
            <InfoIcon />
            <span>About</span>
          </button>
          <button
            className="action-btn"
            disabled={!hasSelection}
            onClick={() => hasSelection && navigate('/file-details')}
          >
            <CalendarIcon />
            <span>View</span>
          </button>
          <button className="action-btn" disabled={!hasSelection}>
            <DownloadIcon />
            <span>Download</span>
          </button>
          <button className="action-btn" disabled={!hasSelection}>
            <MoreIcon />
            <span>More</span>
          </button>
        </div>
      </div>

      <div className="search-results-content" ref={tableRef}>
        <Table
          data={dataWithCheckbox}
          columns={columns}
        />
      </div>
    </div>
  );
}

export default SearchResultsPage;

