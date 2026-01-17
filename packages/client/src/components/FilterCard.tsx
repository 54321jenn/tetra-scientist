import { useState } from 'react';
import './FilterCard.css';

interface FilterCardProps {
  onClose: () => void;
  onSearch?: () => void;
}

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

function FilterCard({ onClose, onSearch }: FilterCardProps) {
  const [fileName, setFileName] = useState('');
  const [createdOn, setCreatedOn] = useState('');
  const [instrument, setInstrument] = useState('');
  const [software, setSoftware] = useState('');

  const handleSearch = () => {
    if (onSearch) {
      onSearch();
    }
  };

  return (
    <div className="filter-card">
      <div className="filter-card-header">
        <h2 className="filter-card-title">Filters</h2>
        <button 
          className="filter-card-close"
          onClick={onClose}
          aria-label="Close filters"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="filter-fields">
        <div className="filter-row">
          <div className="filter-field-group">
            <label className="filter-field-label">File name</label>
            <input 
              type="text" 
              className="filter-input"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
          </div>
          <div className="filter-field-group">
            <label className="filter-field-label">Created on</label>
            <input 
              type="date" 
              className="filter-input"
              value={createdOn}
              onChange={(e) => setCreatedOn(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-row">
          <div className="filter-field-group">
            <label className="filter-field-label">Instrument</label>
            <div className="filter-select">
              <select 
                className="filter-select-input"
                value={instrument}
                onChange={(e) => setInstrument(e.target.value)}
              >
                <option value="">Select instrument</option>
                <option>HPLC (Agilent 1260)</option>
                <option>UPLC (Waters Acquity)</option>
                <option>LC-MS (Thermo Q Exactive)</option>
                <option>GC-MS (Agilent 7890B)</option>
                <option>Mass Spec (Sciex Triple Quad)</option>
              </select>
              <ChevronDownIcon />
            </div>
          </div>
          <div className="filter-field-group">
            <label className="filter-field-label">Software</label>
            <div className="filter-select">
              <select 
                className="filter-select-input"
                value={software}
                onChange={(e) => setSoftware(e.target.value)}
              >
                <option value="">Select software</option>
                <option>ChemStation</option>
                <option>Empower 3</option>
                <option>Xcalibur</option>
                <option>MassHunter</option>
                <option>Analyst</option>
              </select>
              <ChevronDownIcon />
            </div>
          </div>
        </div>

        <div className="filter-add-row">
          <div className="filter-select">
            <select className="filter-select-input">
              <option value="">Add a filter</option>
              <option>File type</option>
              <option>Organization</option>
              <option>Tags</option>
              <option>Modified on</option>
            </select>
            <ChevronDownIcon />
          </div>
        </div>
      </div>

      <div className="filter-card-footer">
        <div className="filter-footer-left">
          <button className="filter-btn-load">
            Load Filters
            <ChevronDownIcon />
          </button>
          <button className="filter-btn-save">Save Filters</button>
        </div>
        <button 
          className="filter-btn-search"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
    </div>
  );
}

export default FilterCard;

