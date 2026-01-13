import CustomTable, { TableColumn } from '../components/CustomTable';
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

const BookmarkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
  </svg>
);

const PreviewIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const ShareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"></circle>
    <circle cx="6" cy="12" r="3"></circle>
    <circle cx="18" cy="19" r="3"></circle>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
  </svg>
);

const LineageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="18" r="3"></circle>
    <circle cx="6" cy="6" r="3"></circle>
    <path d="M13 6h3a2 2 0 0 1 2 2v7"></path>
    <line x1="6" y1="9" x2="6" y2="21"></line>
  </svg>
);

const PlaceholderIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

function SearchResultsPage() {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [bulkMenuOpen, setBulkMenuOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (openMenuId && !(e.target as HTMLElement).closest('.action-menu-wrapper')) {
        setOpenMenuId(null);
      }
      if (bulkMenuOpen && !(e.target as HTMLElement).closest('.bulk-menu-wrapper')) {
        setBulkMenuOpen(false);
      }
      if (showInfo && !(e.target as HTMLElement).closest('.info-sidebar')) {
        // Check if the click is not on the About button that opens the sidebar
        if (!(e.target as HTMLElement).closest('[aria-label="About"]')) {
          setShowInfo(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openMenuId, bulkMenuOpen, showInfo]);

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
        aria-label={`Select ${row.name}`}
        title={`Select ${row.name}`}
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
    actions: (
      <div className="actions-cell">
        <button
          className="action-icon-btn"
          onClick={(e) => {
            e.stopPropagation();
            navigate('/file-details');
          }}
          aria-label="Preview"
          title="Preview"
        >
          <PreviewIcon />
        </button>
        <button
          className="action-icon-btn"
          onClick={(e) => {
            e.stopPropagation();
            setShowInfo(true);
          }}
          aria-label="About"
          title="About"
        >
          <InfoIcon />
        </button>
        <div className="action-menu-wrapper">
          <button
            className="action-icon-btn"
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenuId(openMenuId === row.id ? null : row.id);
            }}
            aria-label="More actions"
            title="More actions"
          >
            <MoreIcon />
          </button>
          {openMenuId === row.id && (
            <div className="action-menu">
              <button
                className="action-menu-item"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Bookmark', row.name);
                  setOpenMenuId(null);
                }}
              >
                <BookmarkIcon />
                <span>Bookmark</span>
              </button>
              <button
                className="action-menu-item"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Download', row.name);
                  setOpenMenuId(null);
                }}
              >
                <DownloadIcon />
                <span>Download</span>
              </button>
              <button
                className="action-menu-item"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Share', row.name);
                  setOpenMenuId(null);
                }}
              >
                <ShareIcon />
                <span>Share</span>
              </button>
              <button
                className="action-menu-item"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Lineage', row.name);
                  setOpenMenuId(null);
                }}
              >
                <LineageIcon />
                <span>Lineage</span>
              </button>
            </div>
          )}
        </div>
      </div>
    ),
  }));

  // Define table columns
  const columns: TableColumn<typeof dataWithCheckbox[0]>[] = [
    {
      key: 'checkbox',
      header: (
        <input
          type="checkbox"
          checked={selectAll}
          onChange={handleSelectAll}
          className="row-checkbox"
          aria-label="Select all rows"
          title="Select all rows"
        />
      ),
      width: '50px'
    },
    { key: 'nameWithIcon', header: 'Name' },
    { key: 'sourceLocation', header: 'Source Location' },
    { key: 'uploadedAtFormatted', header: 'Uploaded At' },
    { key: 'actions', header: 'Actions', width: '120px' },
  ];

  // Handle row click to select the row
  const handleRowClick = (row: typeof dataWithCheckbox[0]) => {
    handleRowSelect(row.id);
  };

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
          <button className="search-icon-btn" aria-label="Search" title="Search">
            <SearchIcon />
          </button>
          <button className="search-icon-btn" aria-label="Filter" title="Filter">
            <FilterIcon />
          </button>
        </div>
      </div>

      <div className="action-bar">
        <div className="action-bar-left">
          <button className="action-btn">
            <StarIcon />
            <span>Save Search</span>
          </button>
        </div>
        <div className="action-bar-right">
          <button className="action-btn" disabled={!hasSelection}>
            <BookmarkIcon />
            <span>Bookmark</span>
          </button>
          <button className="action-btn" disabled={!hasSelection}>
            <ShareIcon />
            <span>Share</span>
          </button>
          <button className="action-btn" disabled={!hasSelection}>
            <DownloadIcon />
            <span>Download</span>
          </button>
          <div className="bulk-menu-wrapper">
            <button
              className="action-btn"
              disabled={!hasSelection}
              onClick={() => hasSelection && setBulkMenuOpen(!bulkMenuOpen)}
            >
              <MoreIcon />
              <span>More</span>
            </button>
            {bulkMenuOpen && hasSelection && (
              <div className="bulk-action-menu">
                <button
                  className="action-menu-item"
                  onClick={() => {
                    console.log('Placeholder action');
                    setBulkMenuOpen(false);
                  }}
                >
                  <PlaceholderIcon />
                  <span>Placeholder</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="search-results-content" ref={tableRef}>
        <CustomTable
          data={dataWithCheckbox}
          columns={columns}
          onRowClick={handleRowClick}
        />
      </div>

      {/* Info Sidebar */}
      {showInfo && (
        <div className="info-sidebar">
          <div className="info-sidebar-header">
            <h3>Information</h3>
            <button className="close-sidebar-btn" onClick={() => setShowInfo(false)}>
              <CloseIcon />
            </button>
          </div>
          <div className="info-sidebar-content">
            <div className="info-sidebar-section">
              <h4>Attributes</h4>
              <div className="info-sidebar-item">
                <div className="info-sidebar-value">Proteomics Study 3</div>
                <div className="info-sidebar-label">Study Name</div>
                <button className="copy-btn-sidebar" onClick={() => handleCopy('Proteomics Study 3', 'sidebar-study-name')}>
                  {copiedId === 'sidebar-study-name' ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
              <div className="info-sidebar-item">
                <div className="info-sidebar-value">Protocol</div>
                <div className="info-sidebar-label">Document Type</div>
                <button className="copy-btn-sidebar" onClick={() => handleCopy('Protocol', 'sidebar-doc-type')}>
                  {copiedId === 'sidebar-doc-type' ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
              <div className="info-sidebar-item">
                <div className="info-sidebar-value">Dr. Sarah Chen</div>
                <div className="info-sidebar-label">Principal Investigator</div>
                <button className="copy-btn-sidebar" onClick={() => handleCopy('Dr. Sarah Chen', 'sidebar-pi')}>
                  {copiedId === 'sidebar-pi' ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
            </div>

            <div className="info-sidebar-section">
              <h4>Information</h4>
              <div className="info-sidebar-item">
                <div className="info-sidebar-value">Proteomics-Study3-Protocol.txt</div>
                <div className="info-sidebar-label">File Name</div>
                <button className="copy-btn-sidebar" onClick={() => handleCopy('Proteomics-Study3-Protocol.txt', 'sidebar-file-name')}>
                  {copiedId === 'sidebar-file-name' ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
              <div className="info-sidebar-item">
                <div className="info-sidebar-value">file-ps3-001</div>
                <div className="info-sidebar-label">File ID</div>
                <button className="copy-btn-sidebar" onClick={() => handleCopy('file-ps3-001', 'sidebar-file-id')}>
                  {copiedId === 'sidebar-file-id' ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
              <div className="info-sidebar-item">
                <div className="info-sidebar-value">/tetrasphere/proteomics/study-3/docs</div>
                <div className="info-sidebar-label">File Path</div>
                <button className="copy-btn-sidebar" onClick={() => handleCopy('/tetrasphere/proteomics/study-3/docs', 'sidebar-file-path')}>
                  {copiedId === 'sidebar-file-path' ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
              <div className="info-sidebar-item">
                <div className="info-sidebar-value">/tetrasphere/proteomics/study-3/docs</div>
                <div className="info-sidebar-label">Source Location</div>
                <button className="copy-btn-sidebar" onClick={() => handleCopy('/tetrasphere/proteomics/study-3/docs', 'sidebar-source-location')}>
                  {copiedId === 'sidebar-source-location' ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
              <div className="info-sidebar-item">
                <div className="info-sidebar-value">01/09/2026, 04:30:00 PM EST</div>
                <div className="info-sidebar-label">Upload date</div>
                <button className="copy-btn-sidebar" onClick={() => handleCopy('01/09/2026, 04:30:00 PM EST', 'sidebar-upload-date')}>
                  {copiedId === 'sidebar-upload-date' ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
              <div className="info-sidebar-item">
                <div className="info-sidebar-value">Text Document</div>
                <div className="info-sidebar-label">Source Type</div>
                <button className="copy-btn-sidebar" onClick={() => handleCopy('Text Document', 'sidebar-source-type')}>
                  {copiedId === 'sidebar-source-type' ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
              <div className="info-sidebar-item">
                <div className="info-sidebar-value">18.5 KB</div>
                <div className="info-sidebar-label">Size</div>
                <button className="copy-btn-sidebar" onClick={() => handleCopy('18.5 KB', 'sidebar-size')}>
                  {copiedId === 'sidebar-size' ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchResultsPage;

