import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from '../components/CodeBlock';
import './ContributingPage.css';

// Simple Card component replacement
const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={`card ${className || ''}`}>{children}</div>
);

function ContributingPage() {
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/CONTRIBUTING.md')
      .then((response) => response.text())
      .then((text) => {
        setMarkdown(text);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading CONTRIBUTING.md:', error);
        setMarkdown('# Error\n\nFailed to load contributing guide.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="app-container">
        <div className="contributing-content">
          <Card>
            <p>Loading...</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="contributing-content">
        <Card>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                const codeString = String(children).replace(/\n$/, '');
                const isInline = !className;

                return !isInline && match ? (
                  <CodeBlock
                    language={match[1]}
                    code={codeString}
                  />
                ) : (
                  <code className="inline-code" {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {markdown}
          </ReactMarkdown>
        </Card>
      </div>
    </div>
  );
}

export default ContributingPage;

