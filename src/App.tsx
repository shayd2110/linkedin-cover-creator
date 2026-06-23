import React, { useState, useEffect, useRef } from 'react';
import { toPng } from 'html-to-image';

interface UnsplashPhoto {
  id: string;
  urls: {
    regular: string;
    full: string;
  };
  user: {
    name: string;
    links: {
      html: string;
    };
  };
}

const GOOGLE_FONTS = [
  { name: 'Sora (Elegant & Modern)', value: 'Sora, sans-serif' },
  { name: 'Montserrat (Urban & Clean)', value: 'Montserrat, sans-serif' },
  { name: 'Lato (Neat & Balanced)', value: 'Lato, sans-serif' },
  { name: 'Noto Sans HK (Simple & Minimal)', value: 'Noto Sans HK, sans-serif' },
  { name: 'Merriweather (Serious & Editorial)', value: 'Merriweather, serif' },
  { name: 'Cinzel (Classical & Premium)', value: 'Cinzel, serif' },
  { name: 'Inconsolata (Typewriter & Monospace)', value: 'Inconsolata, monospace' },
  { name: 'Lobster (Creative & Playful)', value: 'Lobster, cursive' },
];

const COLOR_PRESETS = [
  { name: 'LinkedIn Blue', value: '#0a66c2' },
  { name: 'Turquoise', value: '#00AEB3' },
  { name: 'Emerald Green', value: '#2ecc71' },
  { name: 'Sunset Orange', value: '#f47b16' },
  { name: 'Ruby Red', value: '#EC4339' },
  { name: 'Royal Purple', value: '#8C68CB' },
  { name: 'Coral Pink', value: '#ED4795' },
  { name: 'Golden Glow', value: '#f1c40f' },
];

export default function App() {
  // Personal Details
  const [firstName, setFirstName] = useState('Shay');
  const [lastName, setLastName] = useState('Doron');
  const [jobTitle, setJobTitle] = useState('Frontend/Full Stack Developer');
  const [email, setEmail] = useState('shayd2110@gmail.com');
  const [phone, setPhone] = useState('054-6676278');

  // Aesthetic Controls
  const [fontFamily, setFontFamily] = useState('Sora, sans-serif');
  const [dividerColor, setDividerColor] = useState('#00AEB3');
  const [dividerWidth, setDividerWidth] = useState(50); // percentage
  const [panelColor, setPanelColor] = useState('#000000');
  const [panelOpacity, setPanelOpacity] = useState(0.85);

  // Background Image state
  const [bgSource, setBgSource] = useState<'unsplash' | 'upload' | 'url'>('unsplash');
  const [unsplashPhoto, setUnsplashPhoto] = useState<UnsplashPhoto | null>(null);
  const [unsplashQuery, setUnsplashQuery] = useState('AI FRONTEND');
  const [customUrl, setCustomUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Interface State
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'background'>('content');
  const [showMockup, setShowMockup] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [previewScale, setPreviewScale] = useState(1);

  // Refs
  const coverRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load Unsplash Photo
  const fetchUnsplashPhoto = async (queryStr: string = '') => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = 'https://apis.scrimba.com/unsplash/photos/random/?orientation=landscape';
      const url = queryStr ? `${baseUrl}&query=${encodeURIComponent(queryStr)}` : baseUrl;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch image from Unsplash');
      const data = await res.json();
      setUnsplashPhoto(data);
    } catch (err: any) {
      console.error(err);
      setError('Could not load random image. Try a different query or upload a file.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnsplashPhoto(unsplashQuery);
  }, []);

  // Calculate Scale of Preview
  useEffect(() => {
    const handleResize = () => {
      if (previewContainerRef.current) {
        const containerWidth = previewContainerRef.current.clientWidth;
        // The cover native width is 1584px
        const scale = containerWidth / 1584;
        setPreviewScale(scale);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    // Add small delay to let layout settle
    const timeout = setTimeout(handleResize, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeout);
    };
  }, [showMockup]);

  // Handle Unsplash Search Submit
  const handleUnsplashSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUnsplashPhoto(unsplashQuery);
  };

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedFile(event.target.result as string);
          setBgSource('upload');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file dialog
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedFile(event.target.result as string);
          setBgSource('upload');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Get background image source
  const getBgImageSrc = () => {
    if (bgSource === 'upload' && uploadedFile) {
      return uploadedFile;
    }
    if (bgSource === 'url' && customUrl) {
      return customUrl;
    }
    if (unsplashPhoto) {
      return unsplashPhoto.urls.regular;
    }
    return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1584&auto=format&fit=crop'; // fallback
  };

  // Convert Hex to RGBA
  const getPanelBgColor = () => {
    const hex = panelColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) || 0;
    const g = parseInt(hex.substring(2, 4), 16) || 0;
    const b = parseInt(hex.substring(4, 6), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${panelOpacity})`;
  };

  // Export cover to PNG
  const handleDownload = async () => {
    if (!coverRef.current) return;
    setExporting(true);

    try {
      // Small timeout to allow state changes to settle
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const dataUrl = await toPng(coverRef.current, {
        width: 1584,
        height: 396,
        style: {
          transform: 'none',
          position: 'static',
        },
        cacheBust: true,
      });

      const link = document.createElement('a');
      link.download = `linkedin-cover-${firstName.toLowerCase()}-${lastName.toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export error:', err);
      alert('Could not export image. This is often caused by remote image access controls. Try uploading a local file, which bypasses CORS security checks!');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-logo">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
          </svg>
          <h1>LinkedIn Cover Creator</h1>
        </div>
        <div className="header-badge">
          <span>Based on code by </span>
          <a href="https://scrimba.com" target="_blank" rel="noopener noreferrer">Scrimba 💜</a>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="workspace">
        
        {/* Settings Panel */}
        <section className="settings-panel">
          
          {/* Tab Navigation */}
          <nav className="tab-nav">
            <button 
              className={activeTab === 'content' ? 'active' : ''} 
              onClick={() => setActiveTab('content')}
            >
              📝 Details
            </button>
            <button 
              className={activeTab === 'style' ? 'active' : ''} 
              onClick={() => setActiveTab('style')}
            >
              🎨 Style
            </button>
            <button 
              className={activeTab === 'background' ? 'active' : ''} 
              onClick={() => setActiveTab('background')}
            >
              🖼️ Background
            </button>
          </nav>

          {/* Tab Content */}
          <div className="tab-content">
            
            {/* TAB 1: CONTENT DETAILS */}
            {activeTab === 'content' && (
              <div className="tab-pane">
                <h3>Personal Details</h3>
                
                <div className="input-group-row">
                  <div className="input-field">
                    <label htmlFor="firstName">First Name</label>
                    <input 
                      type="text" 
                      id="firstName" 
                      value={firstName} 
                      onChange={(e) => setFirstName(e.target.value)} 
                      placeholder="e.g. Shay"
                    />
                  </div>
                  <div className="input-field">
                    <label htmlFor="lastName">Last Name</label>
                    <input 
                      type="text" 
                      id="lastName" 
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)} 
                      placeholder="e.g. Doron"
                    />
                  </div>
                </div>

                <div className="input-field">
                  <label htmlFor="jobTitle">Job Title</label>
                  <input 
                    type="text" 
                    id="jobTitle" 
                    value={jobTitle} 
                    onChange={(e) => setJobTitle(e.target.value)} 
                    placeholder="e.g. Frontend/Full Stack Developer"
                  />
                </div>

                <div className="input-field">
                  <label htmlFor="email">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="e.g. name@example.com"
                  />
                </div>

                <div className="input-field">
                  <label htmlFor="phone">Phone Number</label>
                  <input 
                    type="text" 
                    id="phone" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    placeholder="e.g. 054-6676278"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: AESTHETIC STYLE */}
            {activeTab === 'style' && (
              <div className="tab-pane">
                <h3>Design & Styling</h3>

                {/* Font Selection */}
                <div className="input-field">
                  <label htmlFor="fontFamily">Font Typography</label>
                  <select 
                    id="fontFamily" 
                    value={fontFamily} 
                    onChange={(e) => setFontFamily(e.target.value)}
                  >
                    {GOOGLE_FONTS.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Divider Accent Color */}
                <div className="input-field">
                  <label>Divider Accent Color</label>
                  <div className="color-presets">
                    {COLOR_PRESETS.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        className={`color-preset-dot ${dividerColor === color.value ? 'selected' : ''}`}
                        style={{ backgroundColor: color.value }}
                        onClick={() => setDividerColor(color.value)}
                        title={color.name}
                      />
                    ))}
                  </div>
                  <div className="custom-color-picker">
                    <span>Custom Color:</span>
                    <input 
                      type="color" 
                      value={dividerColor} 
                      onChange={(e) => setDividerColor(e.target.value)} 
                    />
                  </div>
                </div>

                {/* Divider Width */}
                <div className="input-field">
                  <div className="slider-header">
                    <label htmlFor="dividerWidth">Divider Width</label>
                    <span>{dividerWidth}%</span>
                  </div>
                  <input 
                    type="range" 
                    id="dividerWidth" 
                    min="10" 
                    max="100" 
                    value={dividerWidth} 
                    onChange={(e) => setDividerWidth(Number(e.target.value))} 
                  />
                </div>

                {/* Card Background Overlay Color */}
                <div className="input-field">
                  <div className="slider-header">
                    <label>Info Card Background</label>
                    <input 
                      type="color" 
                      value={panelColor} 
                      onChange={(e) => setPanelColor(e.target.value)} 
                    />
                  </div>
                </div>

                {/* Card Opacity */}
                <div className="input-field">
                  <div className="slider-header">
                    <label htmlFor="panelOpacity">Card Opacity</label>
                    <span>{Math.round(panelOpacity * 100)}%</span>
                  </div>
                  <input 
                    type="range" 
                    id="panelOpacity" 
                    min="0" 
                    max="1" 
                    step="0.05" 
                    value={panelOpacity} 
                    onChange={(e) => setPanelOpacity(Number(e.target.value))} 
                  />
                </div>
              </div>
            )}

            {/* TAB 3: BACKGROUND IMAGE */}
            {activeTab === 'background' && (
              <div className="tab-pane">
                <h3>Cover Background</h3>

                {/* Source Toggle */}
                <div className="bg-source-selector">
                  <button 
                    className={bgSource === 'unsplash' ? 'active' : ''} 
                    onClick={() => setBgSource('unsplash')}
                  >
                    Unsplash Search
                  </button>
                  <button 
                    className={bgSource === 'upload' ? 'active' : ''} 
                    onClick={() => setBgSource('upload')}
                  >
                    File Upload
                  </button>
                  <button 
                    className={bgSource === 'url' ? 'active' : ''} 
                    onClick={() => setBgSource('url')}
                  >
                    Image URL
                  </button>
                </div>

                {/* Unsplash Source Panel */}
                {bgSource === 'unsplash' && (
                  <div className="bg-subpane">
                    <form onSubmit={handleUnsplashSearch} className="search-form">
                      <div className="input-field">
                        <label htmlFor="unsplashQuery">Search Keyword</label>
                        <div className="search-input-wrapper">
                          <input 
                            type="text" 
                            id="unsplashQuery" 
                            value={unsplashQuery} 
                            onChange={(e) => setUnsplashQuery(e.target.value)} 
                            placeholder="e.g. tech, minimal, abstract"
                          />
                          <button type="submit" disabled={loading}>Search</button>
                        </div>
                      </div>
                    </form>
                    <button 
                      type="button" 
                      className="shuffle-button" 
                      onClick={() => fetchUnsplashPhoto(unsplashQuery)}
                      disabled={loading}
                    >
                      {loading ? 'Fetching...' : '🎲 Random Image'}
                    </button>
                    {unsplashPhoto && (
                      <div className="unsplash-credits">
                        <span>Photo by </span>
                        <a 
                          href={`${unsplashPhoto.user.links.html}?utm_source=linkedin_cover_creator&utm_medium=referral`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          {unsplashPhoto.user.name}
                        </a>
                        <span> on </span>
                        <a 
                          href="https://unsplash.com?utm_source=linkedin_cover_creator&utm_medium=referral" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          Unsplash
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* File Upload Panel */}
                {bgSource === 'upload' && (
                  <div className="bg-subpane">
                    <div 
                      className="drag-drop-zone"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={triggerFileInput}
                    >
                      <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
                        <path d="M19.35 10.04c-.7-.38-1.5-.59-2.35-.59-2.76 0-5 2.24-5 5v.06c-.84.28-1.57.85-2.07 1.58-.29-.05-.59-.09-.93-.09-3.04 0-5.5 2.46-5.5 5.5s2.46 5.5 5.5 5.5h12c1.93 0 3.5-1.57 3.5-3.5 0-1.89-1.5-3.43-3.37-3.49.12-.49.19-.99.19-1.51 0-2.48-1.8-4.52-4.14-4.96zM14 13v4h-3v-4H8l4-4 4 4h-3z" />
                      </svg>
                      <p>Drag & drop your cover image here, or <span>browse files</span></p>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        style={{ display: 'none' }} 
                        accept="image/*" 
                        onChange={handleFileUpload} 
                      />
                    </div>
                    {uploadedFile && (
                      <div className="upload-preview-container">
                        <span>Uploaded File Loaded successfully ✔</span>
                        <button type="button" onClick={() => setUploadedFile(null)}>Clear Image</button>
                      </div>
                    )}
                  </div>
                )}

                {/* Custom URL Panel */}
                {bgSource === 'url' && (
                  <div className="bg-subpane">
                    <div className="input-field">
                      <label htmlFor="customUrl">Direct Image URL</label>
                      <input 
                        type="url" 
                        id="customUrl" 
                        value={customUrl} 
                        onChange={(e) => setCustomUrl(e.target.value)} 
                        placeholder="https://example.com/your-image.jpg"
                      />
                    </div>
                  </div>
                )}

                {error && <div className="error-message">{error}</div>}
              </div>
            )}

          </div>

          {/* Export Action */}
          <div className="settings-footer">
            <button 
              className="btn-download" 
              onClick={handleDownload} 
              disabled={exporting}
            >
              {exporting ? (
                <>
                  <span className="spinner"></span>
                  Exporting Cover...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/>
                  </svg>
                  Download Cover (1584 × 396)
                </>
              )}
            </button>
          </div>
        </section>

        {/* Preview Area */}
        <section className="preview-area">
          <div className="preview-toolbar">
            <h2>Live View</h2>
            <div className="toolbar-controls">
              <label className="checkbox-control">
                <input 
                  type="checkbox" 
                  checked={showMockup} 
                  onChange={(e) => setShowMockup(e.target.checked)} 
                />
                Show LinkedIn Profile Picture Mockup
              </label>
            </div>
          </div>

          <div 
            className="preview-container" 
            ref={previewContainerRef}
            style={{ paddingBottom: showMockup ? '100px' : '20px' }}
          >
            {/* Native 1584x396 pixel container, scaled using CSS transform to fit responsive width */}
            <div 
              className="scaled-viewport-wrapper"
              style={{
                width: '100%',
                aspectRatio: '1584 / 396',
                overflow: 'visible',
                position: 'relative'
              }}
            >
              <div 
                className="cover-canvas-outer"
                style={{
                  width: '1584px',
                  height: '396px',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  transform: `scale(${previewScale})`,
                  transformOrigin: 'top left',
                }}
              >
                {/* Core cover element which is captured during export */}
                <div 
                  ref={coverRef} 
                  id="linkedin-cover"
                  className="linkedin-cover-element"
                  style={{
                    fontFamily: fontFamily,
                  }}
                >
                  {/* Background Image */}
                  <img 
                    className="cover-bg-image" 
                    src={getBgImageSrc()} 
                    alt="Cover Background" 
                    crossOrigin="anonymous"
                  />
                  
                  {/* Aspect crop helper (not visible but sets layout boundary) */}
                  <div className="cover-border-frame"></div>

                  {/* Personal details right-hand card */}
                  <div 
                    className="right-info-panel"
                    style={{
                      backgroundColor: getPanelBgColor()
                    }}
                  >
                    <h4 className="name-header first-name">{firstName || 'Shay'}</h4>
                    <h4 className="name-header last-name">{lastName || 'Doron'}</h4>
                    
                    <div 
                      className="accent-divider"
                      style={{
                        backgroundColor: dividerColor,
                        width: `${dividerWidth}%`
                      }}
                    ></div>

                    <h5 className="title-text">{jobTitle || 'Developer'}</h5>
                    <h5 className="contact-text email">{email || 'email@example.com'}</h5>
                    <h5 className="contact-text phone">{phone || '050-0000000'}</h5>
                  </div>
                </div>

                {/* LinkedIn Avatar Mockup Overlay */}
                {showMockup && (
                  <div className="linkedin-avatar-mockup">
                    <div className="mockup-circle">
                      {/* Generates a simple avatar preview */}
                      <span className="avatar-initials">
                        {firstName.charAt(0)}{lastName.charAt(0)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Simulated LinkedIn Profile Stats */}
            {showMockup && (
              <div className="linkedin-mockup-details">
                <div className="mockup-profile-name">
                  {firstName} {lastName}
                </div>
                <div className="mockup-profile-headline">
                  {jobTitle}
                </div>
                <div className="mockup-profile-location">
                  Tel Aviv District, Israel • <span className="mockup-link">Contact info</span>
                </div>
                <div className="mockup-profile-connections">
                  500+ connections
                </div>
                <div className="mockup-profile-actions">
                  <button className="btn-mockup-primary">Open to</button>
                  <button className="btn-mockup-secondary">Add profile section</button>
                  <button className="btn-mockup-tertiary">More</button>
                </div>
              </div>
            )}
          </div>
        </section>
        
      </main>
    </div>
  );
}
