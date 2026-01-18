import { useState, useEffect, useRef } from 'react';
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

const RemoveIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const DragIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="8" y2="6.01"></line>
    <line x1="16" y1="6" x2="16" y2="6.01"></line>
    <line x1="8" y1="12" x2="8" y2="12.01"></line>
    <line x1="16" y1="12" x2="16" y2="12.01"></line>
    <line x1="8" y1="18" x2="8" y2="18.01"></line>
    <line x1="16" y1="18" x2="16" y2="18.01"></line>
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const DeleteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const SaveIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
    <polyline points="17 21 17 13 7 13 7 21"></polyline>
    <polyline points="7 3 7 8 15 8"></polyline>
  </svg>
);

const FolderIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

function FilterCard({ onClose, onSearch }: FilterCardProps) {
  const [fileName, setFileName] = useState('');
  const [createdOn, setCreatedOn] = useState('');
  const [createdBetweenStart, setCreatedBetweenStart] = useState('');
  const [createdBetweenEnd, setCreatedBetweenEnd] = useState('');
  const [createdBetweenLabel, setCreatedBetweenLabel] = useState('Created between');
  const [instrument, setInstrument] = useState('');
  const [software, setSoftware] = useState('');
  const [modifiedBetweenStart, setModifiedBetweenStart] = useState('');
  const [modifiedBetweenEnd, setModifiedBetweenEnd] = useState('');
  const [modifiedOn, setModifiedOn] = useState('');
  const [tags, setTags] = useState('');
  const [type, setType] = useState('');

  // Track which filters are visible and their order
  const [filterOrder, setFilterOrder] = useState<string[]>([]);
  const [draggedFilter, setDraggedFilter] = useState<string | null>(null);
  const [dragOverFilter, setDragOverFilter] = useState<string | null>(null);

  // Save filter modal state
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadDropdown, setShowLoadDropdown] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [editingFilter, setEditingFilter] = useState<string | null>(null);
  const [filterToDelete, setFilterToDelete] = useState<string | null>(null);
  const [currentFilterName, setCurrentFilterName] = useState<string>('New Filter');
  const [isModified, setIsModified] = useState(false);
  const [savedState, setSavedState] = useState<{order: string[], values: any} | null>(null);
  const [toast, setToast] = useState<{message: string, visible: boolean, fadeOut: boolean}>({message: '', visible: false, fadeOut: false});
  const loadDropdownRef = useRef<HTMLDivElement>(null);

  // Toast auto-hide with fade-out
  useEffect(() => {
    if (toast.visible && !toast.fadeOut) {
      // Start fade-out after 2.7 seconds
      const fadeTimer = setTimeout(() => {
        setToast(prev => ({...prev, fadeOut: true}));
      }, 2700);

      // Hide completely after fade-out animation (300ms)
      const hideTimer = setTimeout(() => {
        setToast({message: '', visible: false, fadeOut: false});
      }, 3000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [toast.visible, toast.fadeOut]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (loadDropdownRef.current && !loadDropdownRef.current.contains(event.target as Node)) {
        setShowLoadDropdown(false);
      }
    };

    if (showLoadDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLoadDropdown]);

  // Check if filter has been modified
  useEffect(() => {
    if (!savedState) {
      setIsModified(false);
      return;
    }

    const currentValues = {
      fileName,
      createdOn,
      createdBetweenStart,
      createdBetweenEnd,
      createdBetweenLabel,
      instrument,
      software,
      modifiedBetweenStart,
      modifiedBetweenEnd,
      modifiedOn,
      tags,
      type,
    };

    const orderChanged = JSON.stringify(filterOrder) !== JSON.stringify(savedState.order);
    const valuesChanged = JSON.stringify(currentValues) !== JSON.stringify(savedState.values);

    setIsModified(orderChanged || valuesChanged);
  }, [filterOrder, fileName, createdOn, createdBetweenStart, createdBetweenEnd, createdBetweenLabel, instrument, software, modifiedBetweenStart, modifiedBetweenEnd, modifiedOn, tags, type, savedState]);
  const [savedFilters, setSavedFilters] = useState<Array<{name: string, order: string[], values: any}>>(() => {
    const saved = localStorage.getItem('savedFilters');

    if (saved) {
      return JSON.parse(saved);
    }

    // Default filters for bench scientists (only on first load)
    const defaultFilters = [
      {
        name: 'My Raw Data',
        order: ['type', 'createdOn'],
        values: {
          fileName: '',
          createdOn: '',
          createdBetweenStart: '',
          createdBetweenEnd: '',
          createdBetweenLabel: 'Created between',
          instrument: '',
          software: '',
          modifiedBetweenStart: '',
          modifiedBetweenEnd: '',
          modifiedOn: '',
          tags: '',
          type: 'Raw data',
        }
      },
      {
        name: 'Recently Processed',
        order: ['type', 'modifiedOn'],
        values: {
          fileName: '',
          createdOn: '',
          createdBetweenStart: '',
          createdBetweenEnd: '',
          createdBetweenLabel: 'Created between',
          instrument: '',
          software: '',
          modifiedBetweenStart: '',
          modifiedBetweenEnd: '',
          modifiedOn: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days ago
          tags: '',
          type: 'Processed data',
        }
      },
      {
        name: 'Data from Past Week',
        order: ['modifiedBetween', 'type'],
        values: {
          fileName: '',
          createdOn: '',
          createdBetweenStart: '',
          createdBetweenEnd: '',
          createdBetweenLabel: 'Created between',
          instrument: '',
          software: '',
          modifiedBetweenStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days ago
          modifiedBetweenEnd: new Date().toISOString().split('T')[0], // today
          modifiedOn: '',
          tags: '',
          type: '',
        }
      }
    ];

    localStorage.setItem('savedFilters', JSON.stringify(defaultFilters));
    return defaultFilters;
  });

  const handleSearch = () => {
    if (onSearch) {
      onSearch();
    }
  };

  const removeFilter = (filterName: string) => {
    setFilterOrder(prev => prev.filter(f => f !== filterName));

    // Clear the filter value
    switch(filterName) {
      case 'fileName':
        setFileName('');
        break;
      case 'createdOn':
        setCreatedOn('');
        break;
      case 'createdBetween':
        setCreatedBetweenStart('');
        setCreatedBetweenEnd('');
        setCreatedBetweenLabel('Created between');
        break;
      case 'instrument':
        setInstrument('');
        break;
      case 'software':
        setSoftware('');
        break;
      case 'modifiedBetween':
        setModifiedBetweenStart('');
        setModifiedBetweenEnd('');
        break;
      case 'modifiedOn':
        setModifiedOn('');
        break;
      case 'tags':
        setTags('');
        break;
      case 'type':
        setType('');
        break;
    }
  };

  const addFilter = (filterName: string) => {
    // Handle preset date filters by pre-populating createdBetween
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    switch(filterName) {
      case 'today':
        setFilterOrder(prev => [...prev, 'createdBetween']);
        setCreatedBetweenStart(todayStr);
        setCreatedBetweenEnd(todayStr);
        setCreatedBetweenLabel('Created Today');
        break;
      case 'thisWeek':
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        setFilterOrder(prev => [...prev, 'createdBetween']);
        setCreatedBetweenStart(startOfWeek.toISOString().split('T')[0]);
        setCreatedBetweenEnd(todayStr);
        setCreatedBetweenLabel('Created This Week');
        break;
      case 'thisMonth':
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        setFilterOrder(prev => [...prev, 'createdBetween']);
        setCreatedBetweenStart(startOfMonth.toISOString().split('T')[0]);
        setCreatedBetweenEnd(todayStr);
        setCreatedBetweenLabel('Created This Month');
        break;
      case 'thisYear':
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        setFilterOrder(prev => [...prev, 'createdBetween']);
        setCreatedBetweenStart(startOfYear.toISOString().split('T')[0]);
        setCreatedBetweenEnd(todayStr);
        setCreatedBetweenLabel('Created This Year');
        break;
      case 'lastWeek':
        const lastWeekEnd = new Date(today);
        lastWeekEnd.setDate(today.getDate() - today.getDay() - 1);
        const lastWeekStart = new Date(lastWeekEnd);
        lastWeekStart.setDate(lastWeekEnd.getDate() - 6);
        setFilterOrder(prev => [...prev, 'createdBetween']);
        setCreatedBetweenStart(lastWeekStart.toISOString().split('T')[0]);
        setCreatedBetweenEnd(lastWeekEnd.toISOString().split('T')[0]);
        setCreatedBetweenLabel('Created Last Week');
        break;
      case 'lastMonth':
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        setFilterOrder(prev => [...prev, 'createdBetween']);
        setCreatedBetweenStart(lastMonthStart.toISOString().split('T')[0]);
        setCreatedBetweenEnd(lastMonthEnd.toISOString().split('T')[0]);
        setCreatedBetweenLabel('Created Last Month');
        break;
      case 'lastYear':
        const lastYearStart = new Date(today.getFullYear() - 1, 0, 1);
        const lastYearEnd = new Date(today.getFullYear() - 1, 11, 31);
        setFilterOrder(prev => [...prev, 'createdBetween']);
        setCreatedBetweenStart(lastYearStart.toISOString().split('T')[0]);
        setCreatedBetweenEnd(lastYearEnd.toISOString().split('T')[0]);
        setCreatedBetweenLabel('Created Last Year');
        break;
      case 'createdBetween':
        setFilterOrder(prev => [...prev, filterName]);
        setCreatedBetweenLabel('Created between');
        break;
      default:
        setFilterOrder(prev => [...prev, filterName]);
    }
  };

  const handleDragStart = (filterName: string) => {
    setDraggedFilter(filterName);
  };

  const handleDragOver = (e: React.DragEvent, filterName: string) => {
    e.preventDefault();
    setDragOverFilter(filterName);
  };

  const handleDragEnd = () => {
    if (draggedFilter && dragOverFilter && draggedFilter !== dragOverFilter) {
      const newOrder = [...filterOrder];
      const draggedIndex = newOrder.indexOf(draggedFilter);
      const targetIndex = newOrder.indexOf(dragOverFilter);

      // Remove dragged item
      newOrder.splice(draggedIndex, 1);
      // Insert at new position
      newOrder.splice(targetIndex, 0, draggedFilter);

      setFilterOrder(newOrder);
    }
    setDraggedFilter(null);
    setDragOverFilter(null);
  };

  const allFilters = [
    { value: 'createdBetween', label: 'Created between' },
    { value: 'lastMonth', label: 'Created Last Month' },
    { value: 'lastWeek', label: 'Created Last Week' },
    { value: 'lastYear', label: 'Created Last Year' },
    { value: 'createdOn', label: 'Created on' },
    { value: 'thisMonth', label: 'Created This Month' },
    { value: 'thisWeek', label: 'Created This Week' },
    { value: 'thisYear', label: 'Created This Year' },
    { value: 'today', label: 'Created Today' },
    { value: 'fileName', label: 'File name' },
    { value: 'instrument', label: 'Instrument' },
    { value: 'modifiedBetween', label: 'Modified between' },
    { value: 'modifiedOn', label: 'Modified on' },
    { value: 'software', label: 'Software' },
    { value: 'tags', label: 'Tags' },
    { value: 'type', label: 'Type' },
  ];

  const availableFilters = allFilters.filter(f => {
    // Don't show preset date filters if createdBetween is already in use
    const presetDateFilters = ['today', 'thisWeek', 'thisMonth', 'thisYear', 'lastWeek', 'lastMonth', 'lastYear'];
    if (presetDateFilters.includes(f.value) && filterOrder.includes('createdBetween')) {
      return false;
    }
    return !filterOrder.includes(f.value);
  });

  const getFilterLabel = (filterName: string) => {
    return allFilters.find(f => f.value === filterName)?.label || filterName;
  };

  const handleOpenSaveModal = () => {
    // Pre-fill with current filter name (or empty for new filter)
    setFilterName(currentFilterName === 'New Filter' ? '' : currentFilterName);
    setShowSaveModal(true);
  };

  const handleSaveFilterFromModal = () => {
    if (!filterName.trim()) return;

    const newName = filterName.trim();
    const oldName = currentFilterName;

    const filterData = {
      name: newName,
      order: filterOrder,
      values: {
        fileName,
        createdOn,
        createdBetweenStart,
        createdBetweenEnd,
        createdBetweenLabel,
        instrument,
        software,
        modifiedBetweenStart,
        modifiedBetweenEnd,
        modifiedOn,
        tags,
        type,
      }
    };

    let updatedFilters;
    let message;

    // Check if we're updating an existing filter or creating a new one
    const existingFilterIndex = savedFilters.findIndex(f => f.name === oldName);

    if (existingFilterIndex !== -1 && oldName !== 'New Filter') {
      // Updating existing filter
      if (newName === oldName) {
        // Same name - just update the filter
        updatedFilters = savedFilters.map(f =>
          f.name === oldName ? filterData : f
        );
        message = `"${newName}" updated`;
      } else {
        // Different name - check if new name already exists
        if (savedFilters.some(f => f.name === newName)) {
          setToast({message: 'A filter with this name already exists', visible: true, fadeOut: false});
          return;
        }
        // Replace old filter with new name
        updatedFilters = savedFilters.map(f =>
          f.name === oldName ? filterData : f
        );
        message = `Filter renamed to "${newName}"`;
      }
    } else {
      // Creating new filter
      if (savedFilters.some(f => f.name === newName)) {
        setToast({message: 'A filter with this name already exists', visible: true, fadeOut: false});
        return;
      }
      updatedFilters = [...savedFilters, filterData];
      message = `"${newName}" saved`;
    }

    setSavedFilters(updatedFilters);
    localStorage.setItem('savedFilters', JSON.stringify(updatedFilters));

    setCurrentFilterName(newName);

    // Update saved state
    setSavedState({
      order: filterOrder,
      values: {
        fileName,
        createdOn,
        createdBetweenStart,
        createdBetweenEnd,
        createdBetweenLabel,
        instrument,
        software,
        modifiedBetweenStart,
        modifiedBetweenEnd,
        modifiedOn,
        tags,
        type,
      }
    });
    setIsModified(false);

    setShowSaveModal(false);
    setFilterName('');
    setToast({message, visible: true, fadeOut: false});
  };

  const handleDeleteFilter = (filterNameToDelete: string) => {
    const updatedFilters = savedFilters.filter(f => f.name !== filterNameToDelete);
    setSavedFilters(updatedFilters);
    localStorage.setItem('savedFilters', JSON.stringify(updatedFilters));

    // If we're deleting the currently loaded filter, reset to empty state
    if (currentFilterName === filterNameToDelete) {
      setFilterOrder([]);
      setFileName('');
      setCreatedOn('');
      setCreatedBetweenStart('');
      setCreatedBetweenEnd('');
      setCreatedBetweenLabel('Created between');
      setInstrument('');
      setSoftware('');
      setModifiedBetweenStart('');
      setModifiedBetweenEnd('');
      setModifiedOn('');
      setTags('');
      setType('');
      setCurrentFilterName('New Filter');
      setSavedState(null);
      setIsModified(false);
    }

    setFilterToDelete(null);
    setToast({message: `"${filterNameToDelete}" deleted`, visible: true, fadeOut: false});
  };

  const handleUpdateFilter = (filterNameToUpdate: string) => {
    const filterToUpdate = savedFilters.find(f => f.name === filterNameToUpdate);
    if (!filterToUpdate) return;

    setEditingFilter(filterNameToUpdate);
    setFilterName(filterNameToUpdate);
    setShowLoadDropdown(false);
    setShowSaveModal(true);
  };

  const handleLoadFilter = (filterData: {name: string, order: string[], values: any}) => {
    // Reset to only the saved filters
    setFilterOrder(filterData.order);
    setCurrentFilterName(filterData.name);

    // Clear all values first
    setFileName('');
    setCreatedOn('');
    setCreatedBetweenStart('');
    setCreatedBetweenEnd('');
    setCreatedBetweenLabel('Created between');
    setInstrument('');
    setSoftware('');
    setModifiedBetweenStart('');
    setModifiedBetweenEnd('');
    setModifiedOn('');
    setTags('');
    setType('');

    // Set only the saved values
    setFileName(filterData.values.fileName || '');
    setCreatedOn(filterData.values.createdOn || '');
    setCreatedBetweenStart(filterData.values.createdBetweenStart || '');
    setCreatedBetweenEnd(filterData.values.createdBetweenEnd || '');
    setCreatedBetweenLabel(filterData.values.createdBetweenLabel || 'Created between');
    setInstrument(filterData.values.instrument || '');
    setSoftware(filterData.values.software || '');
    setModifiedBetweenStart(filterData.values.modifiedBetweenStart || '');
    setModifiedBetweenEnd(filterData.values.modifiedBetweenEnd || '');
    setModifiedOn(filterData.values.modifiedOn || '');
    setTags(filterData.values.tags || '');
    setType(filterData.values.type || '');

    // Save the state for comparison - normalize with defaults
    const normalizedValues = {
      fileName: filterData.values.fileName || '',
      createdOn: filterData.values.createdOn || '',
      createdBetweenStart: filterData.values.createdBetweenStart || '',
      createdBetweenEnd: filterData.values.createdBetweenEnd || '',
      createdBetweenLabel: filterData.values.createdBetweenLabel || 'Created between',
      instrument: filterData.values.instrument || '',
      software: filterData.values.software || '',
      modifiedBetweenStart: filterData.values.modifiedBetweenStart || '',
      modifiedBetweenEnd: filterData.values.modifiedBetweenEnd || '',
      modifiedOn: filterData.values.modifiedOn || '',
      tags: filterData.values.tags || '',
      type: filterData.values.type || '',
    };

    setSavedState({
      order: filterData.order,
      values: normalizedValues
    });
    setIsModified(false);
  };

  const renderFilterField = (filterName: string) => {
    const isDragging = draggedFilter === filterName;
    const isDragOver = dragOverFilter === filterName;
    const showDragHandle = filterOrder.length > 1;

    const commonProps = {
      draggable: filterOrder.length > 1,
      onDragStart: () => handleDragStart(filterName),
      onDragOver: (e: React.DragEvent) => handleDragOver(e, filterName),
      onDragEnd: handleDragEnd,
      className: `filter-field-group ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}`,
    };

    switch(filterName) {
      case 'fileName':
        return (
          <div key={filterName} {...commonProps}>
            <div className="filter-field-header">
              <div className="filter-field-label-group">
                {showDragHandle && (
                  <span className="filter-field-drag-handle">
                    <DragIcon />
                  </span>
                )}
                <label className="filter-field-label">File name</label>
              </div>
              <button
                className="filter-field-remove"
                onClick={() => removeFilter('fileName')}
                aria-label="Remove filter"
              >
                <RemoveIcon />
              </button>
            </div>
            <input
              type="text"
              className="filter-input"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
          </div>
        );

      case 'createdOn':
        return (
          <div key={filterName} {...commonProps}>
            <div className="filter-field-header">
              <div className="filter-field-label-group">
                {showDragHandle && (
                  <span className="filter-field-drag-handle">
                    <DragIcon />
                  </span>
                )}
                <label className="filter-field-label">Created on</label>
              </div>
              <button
                className="filter-field-remove"
                onClick={() => removeFilter('createdOn')}
                aria-label="Remove filter"
              >
                <RemoveIcon />
              </button>
            </div>
            <input
              type="date"
              className="filter-input"
              value={createdOn}
              onChange={(e) => setCreatedOn(e.target.value)}
            />
          </div>
        );

      case 'createdBetween':
        return (
          <div key={filterName} {...commonProps}>
            <div className="filter-field-header">
              <div className="filter-field-label-group">
                {showDragHandle && (
                  <span className="filter-field-drag-handle">
                    <DragIcon />
                  </span>
                )}
                <label className="filter-field-label">{createdBetweenLabel}</label>
              </div>
              <button
                className="filter-field-remove"
                onClick={() => removeFilter('createdBetween')}
                aria-label="Remove filter"
              >
                <RemoveIcon />
              </button>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="date"
                className="filter-input"
                value={createdBetweenStart}
                onChange={(e) => setCreatedBetweenStart(e.target.value)}
                placeholder="Start date"
              />
              <span style={{ color: 'var(--text-secondary)' }}>to</span>
              <input
                type="date"
                className="filter-input"
                value={createdBetweenEnd}
                onChange={(e) => setCreatedBetweenEnd(e.target.value)}
                placeholder="End date"
              />
            </div>
          </div>
        );

      case 'instrument':
        return (
          <div key={filterName} {...commonProps}>
            <div className="filter-field-header">
              <div className="filter-field-label-group">
                {showDragHandle && (
                  <span className="filter-field-drag-handle">
                    <DragIcon />
                  </span>
                )}
                <label className="filter-field-label">Instrument</label>
              </div>
              <button
                className="filter-field-remove"
                onClick={() => removeFilter('instrument')}
                aria-label="Remove filter"
              >
                <RemoveIcon />
              </button>
            </div>
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
        );

      case 'software':
        return (
          <div key={filterName} {...commonProps}>
            <div className="filter-field-header">
              <div className="filter-field-label-group">
                {showDragHandle && (
                  <span className="filter-field-drag-handle">
                    <DragIcon />
                  </span>
                )}
                <label className="filter-field-label">Software</label>
              </div>
              <button
                className="filter-field-remove"
                onClick={() => removeFilter('software')}
                aria-label="Remove filter"
              >
                <RemoveIcon />
              </button>
            </div>
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
        );

      case 'modifiedBetween':
        return (
          <div key={filterName} {...commonProps}>
            <div className="filter-field-header">
              <div className="filter-field-label-group">
                {showDragHandle && (
                  <span className="filter-field-drag-handle">
                    <DragIcon />
                  </span>
                )}
                <label className="filter-field-label">Modified between</label>
              </div>
              <button
                className="filter-field-remove"
                onClick={() => removeFilter('modifiedBetween')}
                aria-label="Remove filter"
              >
                <RemoveIcon />
              </button>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="date"
                className="filter-input"
                value={modifiedBetweenStart}
                onChange={(e) => setModifiedBetweenStart(e.target.value)}
                placeholder="Start date"
              />
              <span style={{ color: 'var(--text-secondary)' }}>to</span>
              <input
                type="date"
                className="filter-input"
                value={modifiedBetweenEnd}
                onChange={(e) => setModifiedBetweenEnd(e.target.value)}
                placeholder="End date"
              />
            </div>
          </div>
        );

      case 'modifiedOn':
        return (
          <div key={filterName} {...commonProps}>
            <div className="filter-field-header">
              <div className="filter-field-label-group">
                {showDragHandle && (
                  <span className="filter-field-drag-handle">
                    <DragIcon />
                  </span>
                )}
                <label className="filter-field-label">Modified on</label>
              </div>
              <button
                className="filter-field-remove"
                onClick={() => removeFilter('modifiedOn')}
                aria-label="Remove filter"
              >
                <RemoveIcon />
              </button>
            </div>
            <input
              type="date"
              className="filter-input"
              value={modifiedOn}
              onChange={(e) => setModifiedOn(e.target.value)}
            />
          </div>
        );

      case 'tags':
        return (
          <div key={filterName} {...commonProps}>
            <div className="filter-field-header">
              <div className="filter-field-label-group">
                {showDragHandle && (
                  <span className="filter-field-drag-handle">
                    <DragIcon />
                  </span>
                )}
                <label className="filter-field-label">Tags</label>
              </div>
              <button
                className="filter-field-remove"
                onClick={() => removeFilter('tags')}
                aria-label="Remove filter"
              >
                <RemoveIcon />
              </button>
            </div>
            <input
              type="text"
              className="filter-input"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Enter tags"
            />
          </div>
        );

      case 'type':
        return (
          <div key={filterName} {...commonProps}>
            <div className="filter-field-header">
              <div className="filter-field-label-group">
                {showDragHandle && (
                  <span className="filter-field-drag-handle">
                    <DragIcon />
                  </span>
                )}
                <label className="filter-field-label">Type</label>
              </div>
              <button
                className="filter-field-remove"
                onClick={() => removeFilter('type')}
                aria-label="Remove filter"
              >
                <RemoveIcon />
              </button>
            </div>
            <div className="filter-select">
              <select
                className="filter-select-input"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">Select type</option>
                <option>Chromatography</option>
                <option>CSV</option>
                <option>Excel (XLSX)</option>
                <option>FlowJo (FCS)</option>
                <option>Genomics (FASTQ)</option>
                <option>Image (TIFF)</option>
                <option>Mass Spectrometry</option>
                <option>Method</option>
                <option>Microscopy</option>
                <option>PDF</option>
                <option>Processed data</option>
                <option>Proteomics</option>
                <option>Raw data</option>
                <option>Report</option>
                <option>Sequence</option>
                <option>TSV</option>
                <option>Whole Slide (SVS)</option>
              </select>
              <ChevronDownIcon />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="filter-card">
      <div className="filter-card-top-bar">
        <div className="filter-card-title-wrapper">
          <div className="filter-load-dropdown-wrapper" ref={loadDropdownRef}>
            <button
              className="filter-title-dropdown-btn"
              onClick={() => setShowLoadDropdown(!showLoadDropdown)}
              disabled={savedFilters.length === 0}
            >
              <h2 className="filter-card-title">{currentFilterName}</h2>
              {savedFilters.length > 0 && <ChevronDownIcon />}
            </button>
            {showLoadDropdown && (
              <div className="filter-load-dropdown">
                {savedFilters.map(filter => (
                  <div key={filter.name} className="filter-load-item">
                    <button
                      className="filter-load-item-name"
                      onClick={() => {
                        handleLoadFilter(filter);
                        setShowLoadDropdown(false);
                      }}
                    >
                      <span className="filter-load-item-title">{filter.name}</span>
                    </button>
                    <div className="filter-load-item-actions">
                      <button
                        className="filter-load-item-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFilterToDelete(filter.name);
                        }}
                        title="Delete filter"
                        aria-label="Delete filter"
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="filter-load-item filter-load-new-filter">
                  <button
                    className="filter-load-item-name"
                    onClick={() => {
                      // Reset to new filter state
                      setFilterOrder([]);
                      setFileName('');
                      setCreatedOn('');
                      setCreatedBetweenStart('');
                      setCreatedBetweenEnd('');
                      setCreatedBetweenLabel('Created between');
                      setInstrument('');
                      setSoftware('');
                      setModifiedBetweenStart('');
                      setModifiedBetweenEnd('');
                      setModifiedOn('');
                      setTags('');
                      setType('');
                      setCurrentFilterName('New Filter');
                      setSavedState(null);
                      setIsModified(false);
                      setShowLoadDropdown(false);
                    }}
                  >
                    <span className="filter-load-item-title">New Filter</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          {filterOrder.length > 0 && (isModified || currentFilterName === 'New Filter') && (
            <button
              className="filter-card-modified-icon"
              onClick={handleOpenSaveModal}
              data-tooltip={currentFilterName === 'New Filter' ? 'Save filter' : 'Save changes'}
              aria-label={currentFilterName === 'New Filter' ? 'Save filter' : 'Save changes'}
            >
              <SaveIcon />
            </button>
          )}
        </div>
        <button
          className="filter-card-close"
          onClick={onClose}
          aria-label="Close filters"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="filter-fields">
        {filterOrder.length === 0 ? (
          <div className="filter-empty-state">
            <h3 className="filter-empty-title">No filters applied</h3>
            <p className="filter-empty-subtitle">Add filters to refine your search results</p>
            {availableFilters.length > 0 && (
              <div className="filter-empty-add">
                <div className="filter-select">
                  <select
                    className="filter-select-input"
                    value=""
                    onChange={(e) => {
                      if (e.target.value) {
                        addFilter(e.target.value);
                      }
                    }}
                  >
                    <option value="">Add a filter</option>
                    {availableFilters.map(filter => (
                      <option key={filter.value} value={filter.value}>
                        {filter.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="filter-grid">
            {filterOrder.map(filterName => renderFilterField(filterName))}
          </div>
        )}

        {filterOrder.length > 0 && availableFilters.length > 0 && (
          <div className="filter-add-row">
            <div className="filter-select">
              <select
                className="filter-select-input"
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    addFilter(e.target.value);
                  }
                }}
              >
                <option value="">Add a filter</option>
                {availableFilters.map(filter => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon />
            </div>
          </div>
        )}
      </div>

      <div className="filter-card-footer">
        <button
          className="filter-btn-search"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {/* Save Filter Modal */}
      {showSaveModal && (
        <div className="modal-overlay" onClick={() => setShowSaveModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Save Filter</h2>
              <button
                className="modal-close"
                onClick={() => setShowSaveModal(false)}
                aria-label="Close modal"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <label className="modal-label">Filter Name</label>
              <input
                type="text"
                className="modal-input"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                placeholder="Enter a name for this filter"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveFilterFromModal();
                  }
                }}
                autoFocus
              />
            </div>
            <div className="modal-footer">
              <button
                className="modal-btn-cancel"
                onClick={() => setShowSaveModal(false)}
              >
                Cancel
              </button>
              <button
                className="modal-btn-save"
                onClick={handleSaveFilterFromModal}
                disabled={!filterName.trim()}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.visible && (
        <div className={`filter-toast ${toast.fadeOut ? 'fade-out' : ''}`}>
          {toast.message}
        </div>
      )}

      {filterToDelete && (
        <div className="modal-overlay" onClick={() => setFilterToDelete(null)}>
          <div className="modal-content modal-content-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Delete Filter</h2>
              <button
                className="modal-close"
                onClick={() => setFilterToDelete(null)}
                aria-label="Close modal"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete "{filterToDelete}"?</p>
            </div>
            <div className="modal-footer">
              <button
                className="modal-btn-cancel"
                onClick={() => setFilterToDelete(null)}
              >
                Cancel
              </button>
              <button
                className="modal-btn-delete"
                onClick={() => handleDeleteFilter(filterToDelete)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterCard;

