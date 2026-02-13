import { useState, useRef, useEffect } from 'react';
import { useToolbar } from '../contexts/ToolbarContext';
import './VisualizePage.css';

// Icon components
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
    <path d="m22 2-7 20-4-9-9-4 20-7Z"></path>
    <path d="M22 2 11 13"></path>
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

const CopyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const DownloadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const NotebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);

const TableIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="3" y1="9" x2="21" y2="9"></line>
    <line x1="3" y1="15" x2="21" y2="15"></line>
    <line x1="9" y1="3" x2="9" y2="21"></line>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="14"></line>
  </svg>
);

const ThumbsUpIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2 20h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1H2v11zm19.83-7.12c.11-.25.17-.52.17-.8V11c0-1.1-.9-2-2-2h-5.5l.92-4.65c.05-.22.02-.46-.08-.66a2.1 2.1 0 0 0-.88-1.22L14 2 7.59 8.41C7.21 8.79 7 9.3 7 9.83v7.84C7 18.95 8.05 20 9.34 20h8.11c.7 0 1.36-.37 1.72-.97l2.66-6.15z"/>
  </svg>
);

const ThumbsDownIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 4h-2c-.55 0-1 .45-1 1v9c0 .55.45 1 1 1h2V4zM2.17 11.12c-.11.25-.17.52-.17.8V13c0 1.1.9 2 2 2h5.5l-.92 4.65c-.05.22-.02.46.08.66.23.45.52.86.88 1.22L10 22l6.41-6.41c.38-.38.59-.89.59-1.42V6.34C17 5.05 15.95 4 14.66 4H6.55c-.7 0-1.36.37-1.72.97l-2.66 6.15z"/>
  </svg>
);

const DatabaseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
  </svg>
);

const CodeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

const QueryIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <line x1="10" y1="9" x2="8" y2="9"></line>
  </svg>
);

const SaveIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
    <polyline points="17 21 17 13 7 13 7 21"></polyline>
    <polyline points="7 3 7 8 15 8"></polyline>
  </svg>
);

const MoreIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1"></circle>
    <circle cx="19" cy="12" r="1"></circle>
    <circle cx="5" cy="12" r="1"></circle>
  </svg>
);

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  visualization?: 'bar' | 'line' | 'scatter' | 'pie';
  dataPreview?: boolean;
  rating?: 'up' | 'down' | null;
}

interface DataSource {
  name: string;
  type: string;
  records: number;
}

function VisualizePage() {
  const { setRightActions } = useToolbar();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm your data visualization assistant. Describe what you'd like to visualize, and I'll help you create charts and graphs from your data. You can say things like:\n\n• \"Show me a bar chart of sample counts by experiment\"\n• \"Create a line graph of temperature over time\"\n• \"What's the best way to visualize protein concentration data?\"\n\nWhat would you like to visualize today?",
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDataPanel, setShowDataPanel] = useState(false);
  const [currentVisualization, setCurrentVisualization] = useState<'bar' | 'line' | 'scatter' | 'pie' | null>(null);
  const [activeModal, setActiveModal] = useState<'data' | 'query' | 'code' | 'save' | null>(null);
  const [selectedVizId, setSelectedVizId] = useState<string | null>(null);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  const [chatPanelWidth, setChatPanelWidth] = useState(100); // percentage
  const [isResizing, setIsResizing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const dataSources: DataSource[] = [
    { name: 'Proteomics Study 3', type: 'Dataset', records: 1247 },
    { name: 'Mass Spec Results Q4', type: 'CSV', records: 892 },
    { name: 'Sample Measurements', type: 'Excel', records: 456 },
  ];

  const mockDashboards = [
    { id: '1', name: 'Pipeline Overview' },
    { id: '2', name: 'Experiment Analysis' },
    { id: '3', name: 'Lab Metrics' },
  ];

  const handleRating = (messageId: string, rating: 'up' | 'down') => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, rating: msg.rating === rating ? null : rating } : msg
      )
    );
  };

  const handleSaveToDashboard = (dashboardId: string, dashboardName: string) => {
    setSaveFeedback(`Saved to "${dashboardName}"!`);
    setActiveModal(null);
    setTimeout(() => setSaveFeedback(null), 3000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Get the current visualization from messages
  const currentViz = messages.find(m => m.visualization)?.visualization || null;
  const currentVizMessage = messages.find(m => m.visualization);

  // Resize panel handlers
  const handleMouseDown = () => {
    setIsResizing(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    setChatPanelWidth(Math.min(Math.max(newWidth, 15), 85)); // 15-85% range
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Set toolbar actions for the breadcrumb bar
  useEffect(() => {
    setRightActions(
      <button
        className="toolbar-chart-btn"
        onClick={() => setChatPanelWidth(chatPanelWidth < 50 ? 100 : 25)}
        disabled={!currentVisualization}
        title={chatPanelWidth < 50 ? 'Hide chart' : 'Show chart'}
      >
        <ChartIcon />
        <span>{chatPanelWidth < 50 ? 'Hide chart' : 'Show chart'}</span>
      </button>
    );

    return () => setRightActions(null);
  }, [setRightActions, currentVisualization, chatPanelWidth]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isGenerating) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsGenerating(true);

    // Simulate AI response
    setTimeout(() => {
      const lowerInput = inputValue.toLowerCase();
      let response: Message;

      if (lowerInput.includes('bar') || lowerInput.includes('count') || lowerInput.includes('compare')) {
        response = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: "I've created a bar chart showing the sample counts by experiment. The data is pulled from your Proteomics Study 3 dataset. You can see that Experiment C has the highest count at 45 samples.\n\nWould you like me to:\n• Add error bars to show standard deviation?\n• Change the color scheme?\n• Sort the bars by value?",
          visualization: 'bar',
        };
        setCurrentVisualization('bar');
        setChatPanelWidth(25);
      } else if (lowerInput.includes('line') || lowerInput.includes('time') || lowerInput.includes('trend')) {
        response = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: "Here's a line chart showing the temperature readings over time. The data spans 7 days and shows a clear upward trend with some daily variation.\n\nI can help you:\n• Add a trendline to highlight the pattern\n• Show confidence intervals\n• Compare with another time series",
          visualization: 'line',
        };
        setCurrentVisualization('line');
        setChatPanelWidth(25);
      } else if (lowerInput.includes('scatter') || lowerInput.includes('correlation') || lowerInput.includes('relationship')) {
        response = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: "I've generated a scatter plot showing the relationship between concentration and response. There appears to be a positive correlation (r = 0.82).\n\nWould you like me to:\n• Add a regression line?\n• Color points by sample group?\n• Identify outliers?",
          visualization: 'scatter',
        };
        setCurrentVisualization('scatter');
        setChatPanelWidth(25);
      } else if (lowerInput.includes('pie') || lowerInput.includes('proportion') || lowerInput.includes('percentage') || lowerInput.includes('distribution')) {
        response = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: "Here's a pie chart showing the distribution of sample types in your dataset. The majority (42%) are Type A samples.\n\nI can also:\n• Convert this to a donut chart\n• Show as a stacked bar instead\n• Add percentage labels",
          visualization: 'pie',
        };
        setCurrentVisualization('pie');
        setChatPanelWidth(25);
      } else if (lowerInput.includes('recommend') || lowerInput.includes('best') || lowerInput.includes('suggest') || lowerInput.includes('how should')) {
        response = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: "Based on your data, here are my recommendations:\n\n**For comparing categories:** Use a bar chart - great for showing differences between groups\n\n**For trends over time:** Use a line chart - ideal for temporal patterns\n\n**For relationships:** Use a scatter plot - shows correlations between variables\n\n**For proportions:** Use a pie chart - best for showing parts of a whole\n\nWhat type of comparison are you trying to make? Tell me more about your data and I'll suggest the best visualization.",
        };
      } else if (lowerInput.includes('data') || lowerInput.includes('source') || lowerInput.includes('using')) {
        response = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: "I'm currently using data from your connected sources. Click 'View Data' to see the available datasets and their details.\n\nYou can:\n• Select specific columns to visualize\n• Filter the data before charting\n• Aggregate values (sum, average, count)\n\nWhich dataset would you like to work with?",
          dataPreview: true,
        };
        setShowDataPanel(true);
      } else {
        response = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: "I'd be happy to help you visualize that! To create the best chart, could you tell me:\n\n1. What type of chart would you like? (bar, line, scatter, pie)\n2. What data should be on each axis?\n3. Do you want to group or color by any category?\n\nOr just describe what insight you're looking for, and I'll recommend the best approach!",
        };
      }

      setMessages((prev) => [...prev, response]);
      setIsGenerating(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const renderVisualization = (type: 'bar' | 'line' | 'scatter' | 'pie') => {
    const chartColors = {
      primary: '#1976D2',
      secondary: '#42A5F5',
      tertiary: '#64B5F6',
      quaternary: '#90CAF9',
    };

    switch (type) {
      case 'bar':
        return (
          <div className="chart-container">
            <div className="chart-title">Sample Counts by Experiment</div>
            <div className="bar-chart">
              <div className="bar-group">
                <div className="bar" style={{ height: '60%', backgroundColor: chartColors.primary }}></div>
                <span className="bar-label">Exp A</span>
                <span className="bar-value">28</span>
              </div>
              <div className="bar-group">
                <div className="bar" style={{ height: '75%', backgroundColor: chartColors.secondary }}></div>
                <span className="bar-label">Exp B</span>
                <span className="bar-value">35</span>
              </div>
              <div className="bar-group">
                <div className="bar" style={{ height: '95%', backgroundColor: chartColors.tertiary }}></div>
                <span className="bar-label">Exp C</span>
                <span className="bar-value">45</span>
              </div>
              <div className="bar-group">
                <div className="bar" style={{ height: '50%', backgroundColor: chartColors.quaternary }}></div>
                <span className="bar-label">Exp D</span>
                <span className="bar-value">22</span>
              </div>
            </div>
          </div>
        );
      case 'line':
        return (
          <div className="chart-container">
            <div className="chart-title">Temperature Over Time</div>
            <div className="line-chart">
              <svg viewBox="0 0 300 150" className="line-svg">
                <polyline
                  fill="none"
                  stroke={chartColors.primary}
                  strokeWidth="3"
                  points="20,120 60,100 100,110 140,80 180,70 220,50 260,30"
                />
                <g className="data-points">
                  {[[20,120], [60,100], [100,110], [140,80], [180,70], [220,50], [260,30]].map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r="5" fill={chartColors.primary} />
                  ))}
                </g>
              </svg>
              <div className="line-labels">
                <span>Day 1</span><span>Day 2</span><span>Day 3</span><span>Day 4</span><span>Day 5</span><span>Day 6</span><span>Day 7</span>
              </div>
            </div>
          </div>
        );
      case 'scatter':
        return (
          <div className="chart-container">
            <div className="chart-title">Concentration vs Response</div>
            <div className="scatter-chart">
              <svg viewBox="0 0 300 200" className="scatter-svg">
                {[[30,160], [50,140], [70,130], [90,110], [110,100], [130,85], [150,80], [170,65], [190,55], [210,45], [230,35], [250,25]].map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r="8" fill={chartColors.primary} opacity="0.7" />
                ))}
                <line x1="20" y1="170" x2="270" y2="20" stroke={chartColors.secondary} strokeWidth="2" strokeDasharray="5,5" />
              </svg>
            </div>
          </div>
        );
      case 'pie':
        return (
          <div className="chart-container">
            <div className="chart-title">Sample Type Distribution</div>
            <div className="pie-chart">
              <svg viewBox="0 0 200 200" className="pie-svg">
                <circle cx="100" cy="100" r="80" fill="transparent" stroke={chartColors.primary} strokeWidth="40" strokeDasharray="151 252" strokeDashoffset="0" />
                <circle cx="100" cy="100" r="80" fill="transparent" stroke={chartColors.secondary} strokeWidth="40" strokeDasharray="88 252" strokeDashoffset="-151" />
                <circle cx="100" cy="100" r="80" fill="transparent" stroke={chartColors.tertiary} strokeWidth="40" strokeDasharray="63 252" strokeDashoffset="-239" />
              </svg>
              <div className="pie-legend">
                <div className="legend-item"><span className="legend-color" style={{ backgroundColor: chartColors.primary }}></span>Type A (42%)</div>
                <div className="legend-item"><span className="legend-color" style={{ backgroundColor: chartColors.secondary }}></span>Type B (35%)</div>
                <div className="legend-item"><span className="legend-color" style={{ backgroundColor: chartColors.tertiary }}></span>Type C (23%)</div>
              </div>
            </div>
          </div>
        );
    }
  };

  const hasVisualization = currentVisualization !== null;

  return (
    <div className={`visualize-page ${isResizing ? 'resizing' : ''}`} ref={containerRef}>
      <div className="visualize-content">
        <div
          className="chat-panel"
          style={{ width: hasVisualization ? `${chatPanelWidth}%` : '100%' }}
        >
          <div className="messages-container">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.type}`}>
                {message.type === 'assistant' && (
                  <div className="message-avatar">
                    <SparklesIcon />
                  </div>
                )}
                <div className="message-content">
                  <div className="message-text">{message.content}</div>
                  {message.visualization && (
                    <div className="viz-indicator">
                      <ChartIcon /> Visualization rendered in output panel →
                    </div>
                  )}
                  {message.dataPreview && (
                    <button className="view-data-btn" onClick={() => setShowDataPanel(true)}>
                      <TableIcon /> View data sources
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isGenerating && (
              <div className="message assistant">
                <div className="message-avatar">
                  <SparklesIcon />
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="input-container" onSubmit={handleSubmit}>
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe what you want to visualize..."
              rows={1}
              disabled={isGenerating}
            />
            <button type="submit" className="send-btn" disabled={!inputValue.trim() || isGenerating}>
              <SendIcon />
            </button>
          </form>
        </div>

        {/* Resize Handle */}
        {hasVisualization && (
          <div className="resize-handle" onMouseDown={handleMouseDown}>
            <div className="resize-handle-bar"></div>
          </div>
        )}

        {/* Output Panel */}
        {hasVisualization && currentVizMessage && (
          <div className="output-panel" style={{ width: `${100 - chatPanelWidth}%` }}>
            <div className="output-panel-header">
              <h3>Visualization output</h3>
            </div>
            <div className="output-panel-content">
              {renderVisualization(currentVisualization)}
              <div className="visualization-actions">
                <div className="viz-actions-left">
                  <button
                    className={`viz-rating-btn ${currentVizMessage.rating === 'up' ? 'active' : ''}`}
                    onClick={() => handleRating(currentVizMessage.id, 'up')}
                    title="Good response"
                  >
                    <ThumbsUpIcon />
                  </button>
                  <button
                    className={`viz-rating-btn ${currentVizMessage.rating === 'down' ? 'active' : ''}`}
                    onClick={() => handleRating(currentVizMessage.id, 'down')}
                    title="Poor response"
                  >
                    <ThumbsDownIcon />
                  </button>
                  <span className="viz-actions-divider"></span>
                  <button
                    className="viz-action-btn"
                    onClick={() => { setSelectedVizId(currentVizMessage.id); setActiveModal('data'); }}
                    title="View source data"
                  >
                    <DatabaseIcon /> Data
                  </button>
                  <button
                    className="viz-action-btn"
                    onClick={() => { setSelectedVizId(currentVizMessage.id); setActiveModal('query'); }}
                    title="View source query"
                  >
                    <QueryIcon /> Query
                  </button>
                  <button
                    className="viz-action-btn"
                    onClick={() => { setSelectedVizId(currentVizMessage.id); setActiveModal('code'); }}
                    title="View plot code"
                  >
                    <CodeIcon /> Code
                  </button>
                </div>
                <div className="viz-actions-right">
                  <button className="viz-action-btn" title="Share"><ShareIcon /></button>
                  <button className="viz-action-btn" title="Copy"><CopyIcon /></button>
                  <button className="viz-action-btn" title="Export"><DownloadIcon /></button>
                  <button
                    className="viz-action-btn primary"
                    onClick={() => { setSelectedVizId(currentVizMessage.id); setActiveModal('save'); }}
                    title="Save to dashboard"
                  >
                    <SaveIcon /> Save
                  </button>
                  <button className="viz-action-btn more-btn" title="More actions">
                    <MoreIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showDataPanel && (
          <div className="data-panel">
            <div className="data-panel-header">
              <h3>Data sources</h3>
              <button className="close-panel-btn" onClick={() => setShowDataPanel(false)}>×</button>
            </div>
            <div className="data-sources-list">
              {dataSources.map((source, index) => (
                <div key={index} className="data-source-item">
                  <div className="data-source-icon"><TableIcon /></div>
                  <div className="data-source-info">
                    <div className="data-source-name">{source.name}</div>
                    <div className="data-source-meta">{source.type} • {source.records.toLocaleString()} records</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="data-panel-footer">
              <button className="add-data-btn">+ Add Data Source</button>
            </div>
          </div>
        )}
      </div>

      {/* Save feedback toast */}
      {saveFeedback && (
        <div className="save-feedback-toast">{saveFeedback}</div>
      )}

      {/* Modals */}
      {activeModal && (
        <div className="viz-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="viz-modal" onClick={(e) => e.stopPropagation()}>
            {activeModal === 'data' && (
              <>
                <div className="viz-modal-header">
                  <h3><DatabaseIcon /> Source data</h3>
                  <button className="viz-modal-close" onClick={() => setActiveModal(null)}>×</button>
                </div>
                <div className="viz-modal-content">
                  <div className="source-data-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Experiment</th>
                          <th>Sample Count</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td>Exp A</td><td>28</td><td>Complete</td></tr>
                        <tr><td>Exp B</td><td>35</td><td>Complete</td></tr>
                        <tr><td>Exp C</td><td>45</td><td>Complete</td></tr>
                        <tr><td>Exp D</td><td>22</td><td>In Progress</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="source-data-info">
                    <p><strong>Source:</strong> Proteomics Study 3</p>
                    <p><strong>Records:</strong> 1,247 total • 4 displayed</p>
                  </div>
                </div>
              </>
            )}
            {activeModal === 'query' && (
              <>
                <div className="viz-modal-header">
                  <h3><QueryIcon /> Source query</h3>
                  <button className="viz-modal-close" onClick={() => setActiveModal(null)}>×</button>
                </div>
                <div className="viz-modal-content">
                  <pre className="source-code-block">{`SELECT experiment_name, COUNT(*) as sample_count
FROM samples
WHERE study_id = 'proteomics_study_3'
  AND status IN ('Complete', 'In Progress')
GROUP BY experiment_name
ORDER BY experiment_name;`}</pre>
                  <button className="viz-action-btn" style={{ marginTop: '12px' }}><CopyIcon /> Copy query</button>
                </div>
              </>
            )}
            {activeModal === 'code' && (
              <>
                <div className="viz-modal-header">
                  <h3><CodeIcon /> Plot code</h3>
                  <button className="viz-modal-close" onClick={() => setActiveModal(null)}>×</button>
                </div>
                <div className="viz-modal-content">
                  <pre className="source-code-block">{`import pandas as pd
import matplotlib.pyplot as plt

# Load data from TDP
df = tdp.query("""
  SELECT experiment_name, COUNT(*) as sample_count
  FROM samples WHERE study_id = 'proteomics_study_3'
  GROUP BY experiment_name
""")

# Create bar chart
fig, ax = plt.subplots(figsize=(10, 6))
colors = ['#1976D2', '#42A5F5', '#64B5F6', '#90CAF9']
ax.bar(df['experiment_name'], df['sample_count'], color=colors)
ax.set_xlabel('Experiment')
ax.set_ylabel('Sample Count')
ax.set_title('Sample Counts by Experiment')
plt.tight_layout()
plt.show()`}</pre>
                  <button className="viz-action-btn" style={{ marginTop: '12px' }}><CopyIcon /> Copy code</button>
                </div>
              </>
            )}
            {activeModal === 'save' && (
              <>
                <div className="viz-modal-header">
                  <h3><SaveIcon /> Save to dashboard</h3>
                  <button className="viz-modal-close" onClick={() => setActiveModal(null)}>×</button>
                </div>
                <div className="viz-modal-content">
                  <p className="save-modal-desc">Select a dashboard to add this visualization:</p>
                  <div className="dashboard-list">
                    {mockDashboards.map((dashboard) => (
                      <button
                        key={dashboard.id}
                        className="dashboard-list-item"
                        onClick={() => handleSaveToDashboard(dashboard.name)}
                      >
                        {dashboard.name}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default VisualizePage;

