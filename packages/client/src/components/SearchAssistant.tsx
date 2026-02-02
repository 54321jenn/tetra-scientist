import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchAssistant.css';

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const SparklesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
    <path d="M5 3v4"></path>
    <path d="M19 17v4"></path>
    <path d="M3 5h4"></path>
    <path d="M17 19h4"></path>
  </svg>
);

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

interface SearchAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onBuildFilters?: () => void;
  onAddFilter?: (filterName: string) => void;
  activeFilters?: string[];
  lastRemovedFilter?: string | null;
  onFilterRemovalHandled?: () => void;
}

interface SuggestionPill {
  id: string;
  label: string;
  action: () => void;
}

interface RecentDataItem {
  id: string;
  name: string;
  type: 'raw' | 'ids' | 'processed';
  instrument: string;
  processedAt: string;
  size: string;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
  recentData?: RecentDataItem[];
}

const ALL_FILTERS = ['File name', 'Created date', 'Instrument', 'Software', 'Tags', 'File type'];

// Map display names to filter keys
const FILTER_NAME_MAP: { [key: string]: string } = {
  'File name': 'fileName',
  'Created date': 'createdBetween',
  'Instrument': 'instrument',
  'Software': 'software',
  'Tags': 'tags',
  'File type': 'type',
};

// Reverse map: filter keys to display names
const FILTER_KEY_TO_NAME: { [key: string]: string } = {
  'fileName': 'File name',
  'createdBetween': 'Created date',
  'instrument': 'Instrument',
  'software': 'Software',
  'tags': 'Tags',
  'type': 'File type',
};

function SearchAssistant({ isOpen, onClose, onBuildFilters, onAddFilter, activeFilters = [], lastRemovedFilter, onFilterRemovalHandled }: SearchAssistantProps) {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle filter removal notification
  useEffect(() => {
    if (lastRemovedFilter && messages.length > 0) {
      const displayName = FILTER_KEY_TO_NAME[lastRemovedFilter] || lastRemovedFilter;

      // Get available filters after removal (include the removed one)
      const availableFilters = ALL_FILTERS.filter(filterName => {
        const filterKey = FILTER_NAME_MAP[filterName];
        return !activeFilters.includes(filterKey);
      });

      const assistantMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: `You've removed "${displayName}" from your filters. Would you like to add another filter?`,
        suggestions: availableFilters,
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Notify parent that we've handled the removal
      if (onFilterRemovalHandled) {
        onFilterRemovalHandled();
      }
    }
  }, [lastRemovedFilter]);

  // Get available filters (not currently in the form)
  const getAvailableFilters = () => {
    return ALL_FILTERS.filter(filterName => {
      const filterKey = FILTER_NAME_MAP[filterName];
      return !activeFilters.includes(filterKey);
    });
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  const handleBuildFilters = () => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: 'Help me build filters',
    };

    // Add assistant response with suggestions - show only available filters
    const availableFilters = getAvailableFilters();
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: availableFilters.length > 0
        ? 'What search criteria would you like to use? Here are some common filters you can add:'
        : 'You\'ve already added all available filter types!',
      suggestions: availableFilters,
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);

    if (onBuildFilters) {
      onBuildFilters();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    // Actually add the filter to the FilterCard
    if (onAddFilter) {
      onAddFilter(suggestion);
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: suggestion,
    };

    // Get available filters after this one is added
    const filterKey = FILTER_NAME_MAP[suggestion];
    const newActiveFilters = [...activeFilters, filterKey];
    const remainingFilters = ALL_FILTERS.filter(f => !newActiveFilters.includes(FILTER_NAME_MAP[f]));

    // Add assistant response - show remaining available filters
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: remainingFilters.length > 0
        ? `I've added "${suggestion}" to your filters. Would you like to add more criteria?`
        : `I've added "${suggestion}" to your filters. You've added all available filter types!`,
      suggestions: remainingFilters,
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
  };

  const handleSuggestFilters = () => {
    // Add the most common/relevant filters automatically
    const suggestedFilters = ['File name', 'Created date', 'Instrument'];

    // Filter out filters that are already active
    const filtersToAdd = suggestedFilters.filter(filterName => {
      const filterKey = FILTER_NAME_MAP[filterName];
      return !activeFilters.includes(filterKey);
    });

    // Add each suggested filter that isn't already active
    filtersToAdd.forEach(filterName => {
      if (onAddFilter) {
        onAddFilter(filterName);
      }
    });

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: 'Suggest relevant filters',
    };

    // Get remaining available filters after adding the suggested ones
    const suggestedKeys = suggestedFilters.map(f => FILTER_NAME_MAP[f]);
    const remainingFilters = ALL_FILTERS.filter(f => {
      const filterKey = FILTER_NAME_MAP[f];
      return !suggestedKeys.includes(filterKey) && !activeFilters.includes(filterKey);
    });

    // Build the response message based on what was added
    const addedFilterNames = filtersToAdd.join(', ');
    let responseContent: string;
    if (filtersToAdd.length === 0) {
      responseContent = `You already have the most commonly used filters. ${remainingFilters.length > 0 ? 'Would you like to add any more?' : ''}`;
    } else if (filtersToAdd.length === suggestedFilters.length) {
      responseContent = `I've added the most commonly used filters: ${addedFilterNames}. ${remainingFilters.length > 0 ? 'Would you like to add any more?' : ''}`;
    } else {
      responseContent = `I've added: ${addedFilterNames}. ${remainingFilters.length > 0 ? 'Would you like to add any more?' : ''}`;
    }

    // Add assistant response
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: responseContent,
      suggestions: remainingFilters,
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);

    // Open the filter view
    if (onBuildFilters) {
      onBuildFilters();
    }
  };

  const handleFindRecentData = () => {
    // Dummy recent data
    const recentData: RecentDataItem[] = [
      {
        id: '1',
        name: 'proteomics_study3_sample_001.raw',
        type: 'raw',
        instrument: 'Thermo Q Exactive HF',
        processedAt: '2 minutes ago',
        size: '1.2 GB',
      },
      {
        id: '2',
        name: 'proteomics_study3_sample_001.ids',
        type: 'ids',
        instrument: 'Thermo Q Exactive HF',
        processedAt: '2 minutes ago',
        size: '45 MB',
      },
      {
        id: '3',
        name: 'cell_culture_batch_42.csv',
        type: 'processed',
        instrument: 'Agilent 1290 Infinity II',
        processedAt: '15 minutes ago',
        size: '2.3 MB',
      },
      {
        id: '4',
        name: 'mass_spec_run_2024_01_15.raw',
        type: 'raw',
        instrument: 'Waters Xevo G2-XS',
        processedAt: '1 hour ago',
        size: '890 MB',
      },
      {
        id: '5',
        name: 'chromatography_analysis_final.json',
        type: 'processed',
        instrument: 'Agilent 1290 Infinity II',
        processedAt: '2 hours ago',
        size: '156 KB',
      },
    ];

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: 'Find my recent data',
    };

    // Add assistant response with recent data
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: 'Here\'s your recently processed data:',
      recentData: recentData,
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
  };

  const suggestionPills: SuggestionPill[] = [
    {
      id: 'build-filters',
      label: 'Help me build filters',
      action: handleBuildFilters,
    },
    {
      id: 'suggest-filters',
      label: 'Suggest relevant filters',
      action: handleSuggestFilters,
    },
    {
      id: 'find-data',
      label: 'Find my recent data',
      action: handleFindRecentData,
    },
  ];

  const handleSend = () => {
    if (inputValue.trim()) {
      console.log('Sending message:', inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`search-assistant ${isOpen ? 'open' : ''}`}>
      <div className="search-assistant-header">
        <div className="search-assistant-title">
          <SparklesIcon />
          <h2>AI Assistant</h2>
        </div>
        <div className="search-assistant-header-actions">
          {messages.length > 0 && (
            <button
              className="search-assistant-new-chat"
              onClick={handleNewChat}
              aria-label="New chat"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              New
            </button>
          )}
          <button
            className="search-assistant-close"
            onClick={onClose}
            aria-label="Close assistant"
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      <div className="search-assistant-content">
        {/* Welcome section - always visible */}
        <div className="search-assistant-welcome">
          <div className="search-assistant-welcome-icon">
            <SparklesIcon />
          </div>
          <h3>How can I help you today?</h3>
          <p>I can help you search, filter, and understand your data.</p>
        </div>

        <div className="search-assistant-pills">
          {suggestionPills.map((pill) => (
            <button
              key={pill.id}
              className="search-assistant-pill"
              onClick={pill.action}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Messages section - shown when there are messages */}
        {messages.length > 0 && (
          <div className="search-assistant-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message message-${message.type}`}>
                {message.type === 'assistant' && (
                  <div className="message-icon">
                    <SparklesIcon />
                  </div>
                )}
                <div className="message-content">
                  <p>{message.content}</p>
                  {message.recentData && message.recentData.length > 0 && (
                    <div className="recent-data-list">
                      {message.recentData.map((item, index) => (
                        <div
                          key={item.id}
                          className={`recent-data-item ${index === 0 ? 'clickable' : ''}`}
                          onClick={index === 0 ? () => navigate(`/details/${item.id}`) : undefined}
                          role={index === 0 ? 'button' : undefined}
                          tabIndex={index === 0 ? 0 : undefined}
                        >
                          <div className="recent-data-icon">
                            {item.type === 'raw' && (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                              </svg>
                            )}
                            {item.type === 'ids' && (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                              </svg>
                            )}
                            {item.type === 'processed' && (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <polyline points="9 15 12 18 15 15"></polyline>
                                <line x1="12" y1="12" x2="12" y2="18"></line>
                              </svg>
                            )}
                          </div>
                          <div className="recent-data-info">
                            <div className="recent-data-name">{item.name}</div>
                            <div className="recent-data-meta">
                              <span className="recent-data-instrument">{item.instrument}</span>
                              <span className="recent-data-separator">·</span>
                              <span className="recent-data-size">{item.size}</span>
                              <span className="recent-data-separator">·</span>
                              <span className="recent-data-time">{item.processedAt}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="message-suggestions">
                      {message.suggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          className="message-suggestion-pill"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="search-assistant-footer">
        <div className="search-assistant-input-container">
          <input
            type="text"
            className="search-assistant-input"
            placeholder="Ask me anything..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className="search-assistant-send"
            onClick={handleSend}
            disabled={!inputValue.trim()}
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchAssistant;

