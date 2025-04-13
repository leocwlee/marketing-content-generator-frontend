import React, { useState } from 'react';
import './App.css';

// Define options based on requirements
const contentTypes = ['Email', 'SMS', 'Mobile App Notification'];
const tones = [
  'Professional', 'Friendly', 'Urgent', 'Persuasive', 'Informative',
  'Empathetic', 'Humorous', 'Formal', 'Casual', 'Hong Kong local style'
];
const languages = ['English', 'Traditional Chinese', 'Simplified Chinese'];
const lengths = ['Long', 'Medium', 'Short'];

// Backend API URL (make sure backend server is running on this port)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/generate';

function App() {
  // State for form inputs
  const [contentType, setContentType] = useState(contentTypes[0]);
  const [tone, setTone] = useState(tones[0]);
  const [language, setLanguage] = useState(languages[0]);
  const [length, setLength] = useState(lengths[1]); // Default to Medium
  const [includeEmoji, setIncludeEmoji] = useState(false);
  const [context, setContext] = useState('');

  // State for API interaction
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setGeneratedContent('');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentType,
          tone,
          language,
          length,
          includeEmoji,
          context: context.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Request failed with status ${response.status}`);
      }

      setGeneratedContent(data.generatedContent || 'No content received.');
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Marketing Content Generator</h1>
      </header>

      <form onSubmit={handleSubmit}>
        {/* Content Type Selection */}
        <div className="form-group">
          <label>Content Type:</label>
          <div className="radio-group">
            {contentTypes.map((type) => (
              <label key={type}>
                <input
                  type="radio"
                  value={type}
                  checked={contentType === type}
                  onChange={(e) => setContentType(e.target.value)}
                  disabled={isLoading}
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* Tone Selection */}
        <div className="form-group">
          <label htmlFor="tone-select">Tone:</label>
          <select
            id="tone-select"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            disabled={isLoading}
          >
            {tones.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Length Selection */}
        <div className="form-group">
          <label>Content Length:</label>
          <div className="radio-group">
            {lengths.map((len) => (
              <label key={len}>
                <input
                  type="radio"
                  value={len}
                  checked={length === len}
                  onChange={(e) => setLength(e.target.value)}
                  disabled={isLoading}
                />
                {len}
              </label>
            ))}
          </div>
        </div>

        {/* Language Selection */}
        <div className="form-group">
          <label>Language:</label>
          <div className="radio-group">
            {languages.map((lang) => (
              <label key={lang}>
                <input
                  type="radio"
                  value={lang}
                  checked={language === lang}
                  onChange={(e) => setLanguage(e.target.value)}
                  disabled={isLoading}
                />
                {lang}
              </label>
            ))}
          </div>
        </div>

        {/* Emoji Toggle */}
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={includeEmoji}
              onChange={(e) => setIncludeEmoji(e.target.checked)}
              disabled={isLoading}
            />
            Include Emojis
          </label>
        </div>

        {/* Optional Context */}
        <div className="form-group">
          <label htmlFor="context-input">Optional Context/Keywords:</label>
          <textarea
            id="context-input"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g., Mention upcoming holiday promotion, focus on loan products..."
            disabled={isLoading}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Content'}
        </button>
      </form>

      {/* Loading Indicator */}
      {isLoading && <div className="loading-message">Generating content, please wait...</div>}

      {/* Error Display */}
      {error && <div className="error-message">Error: {error}</div>}

      {/* Result Display */}
      {generatedContent && !isLoading && (
        <div className="result-container">
          <h3>Generated Content:</h3>
          <div
            dangerouslySetInnerHTML={{
              __html: generatedContent
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/^# (.*$)/gm, '<h4>$1</h4>')
                .replace(/^## (.*$)/gm, '<h5>$1</h5>')
                .replace(/^- (.*$)/gm, '<li>$1</li>')
                .replace(/\n/g, '<br/>')
            }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
