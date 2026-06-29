import { useRef, useState } from "react";
import { useCoverStore } from "../store/useCoverStore";
import { COLOR_PRESETS, GOOGLE_FONTS } from "../shared/consts";
import { ControlPanelProps } from "../shared/interfaces";

export const ControlPanel: React.FC<ControlPanelProps> = ({ onDownload, exporting }) => {
  const [activeTab, setActiveTab] = useState<"content" | "style" | "background">("content");
  const {
    firstName,
    lastName,
    jobTitle,
    email,
    phone,
    font,
    dividerColor,
    dividerWidth,
    panelColor,
    rightPanelOpacity,
    bgSource,
    unsplashQuery,
    unsplashPhoto,
    customUrl,
    uploadedFile,
    loading,
    error,
    updateField,
    fetchUnsplashPhoto,
  } = useCoverStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // חיפוש Unsplash
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
          updateField("uploadedFile", event.target.result as string);
          updateField("bgSource", "upload");
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
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateField("uploadedFile", event.target.result as string);
          updateField("bgSource", "upload");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="settings-panel">
      {/* Tab Navigation */}
      <nav className="tab-nav">
        <button className={activeTab === "content" ? "active" : ""} onClick={() => setActiveTab("content")}>
          📝 Details
        </button>
        <button className={activeTab === "style" ? "active" : ""} onClick={() => setActiveTab("style")}>
          🎨 Style
        </button>
        <button className={activeTab === "background" ? "active" : ""} onClick={() => setActiveTab("background")}>
          🖼️ Background
        </button>
      </nav>

      {/* Tab Content */}
      <div className="tab-content">
        {/* TAB 1: CONTENT DETAILS */}
        {activeTab === "content" && (
          <div className="tab-pane">
            <h3>Personal Details</h3>

            <div className="input-group-row">
              <div className="input-field">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  placeholder="e.g. Shay"
                />
              </div>
              <div className="input-field">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
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
                onChange={(e) => updateField("jobTitle", e.target.value)}
                placeholder="e.g. Frontend/Full Stack Developer"
              />
            </div>

            <div className="input-field">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="e.g. name@example.com"
              />
            </div>

            <div className="input-field">
              <label htmlFor="phone">Phone Number</label>
              <input type="text" id="phone" value={phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="e.g. 054-6676278" />
            </div>
          </div>
        )}

        {/* TAB 2: AESTHETIC STYLE */}
        {activeTab === "style" && (
          <div className="tab-pane">
            <h3>Design & Styling</h3>

            {/* Font Selection */}
            <div className="input-field">
              <label htmlFor="fontFamily">Font Typography</label>
              <select id="fontFamily" value={font} onChange={(e) => updateField("font", e.target.value)}>
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
                    className={`color-preset-dot ${dividerColor === color.value ? "selected" : ""}`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => updateField("dividerColor", color.value)}
                    title={color.name}
                  />
                ))}
              </div>
              <div className="custom-color-picker">
                <span>Custom Color:</span>
                <input type="color" value={dividerColor} onChange={(e) => updateField("dividerColor", e.target.value)} />
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
                onChange={(e) => updateField("dividerWidth", Number(e.target.value))}
              />
            </div>

            {/* Card Background Overlay Color */}
            <div className="input-field">
              <div className="slider-header">
                <label>Info Card Background</label>
                <input type="color" value={panelColor} onChange={(e) => updateField("panelColor", e.target.value)} />
              </div>
            </div>

            {/* Card Opacity */}
            <div className="input-field">
              <div className="slider-header">
                <label htmlFor="rightPanelOpacity">Card Opacity</label>
                <span>{Math.round(rightPanelOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                id="rightPanelOpacity"
                min="0"
                max="1"
                step="0.05"
                value={rightPanelOpacity}
                onChange={(e) => updateField("rightPanelOpacity", Number(e.target.value))}
              />
            </div>
          </div>
        )}

        {/* TAB 3: BACKGROUND IMAGE */}
        {activeTab === "background" && (
          <div className="tab-pane">
            <h3>Cover Background</h3>

            {/* Source Toggle */}
            <div className="bg-source-selector">
              <button className={bgSource === "unsplash" ? "active" : ""} onClick={() => updateField("bgSource", "unsplash")}>
                Unsplash Search
              </button>
              <button className={bgSource === "upload" ? "active" : ""} onClick={() => updateField("bgSource", "upload")}>
                File Upload
              </button>
              <button className={bgSource === "url" ? "active" : ""} onClick={() => updateField("bgSource", "url")}>
                Image URL
              </button>
            </div>

            {/* Unsplash Source Panel */}
            {bgSource === "unsplash" && (
              <div className="bg-subpane">
                <form onSubmit={handleUnsplashSearch} className="search-form">
                  <div className="input-field">
                    <label htmlFor="unsplashQuery">Search Keyword</label>
                    <div className="search-input-wrapper">
                      <input
                        type="text"
                        id="unsplashQuery"
                        value={unsplashQuery}
                        onChange={(e) => updateField("unsplashQuery", e.target.value)}
                        placeholder="e.g. tech, minimal, abstract"
                      />
                      <button type="submit" disabled={loading}>
                        Search
                      </button>
                    </div>
                  </div>
                </form>
                <button type="button" className="shuffle-button" onClick={() => fetchUnsplashPhoto(unsplashQuery)} disabled={loading}>
                  {loading ? "Fetching..." : "🎲 Random Image"}
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
                    <a href="https://unsplash.com?utm_source=linkedin_cover_creator&utm_medium=referral" target="_blank" rel="noopener noreferrer">
                      Unsplash
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* File Upload Panel */}
            {bgSource === "upload" && (
              <div className="bg-subpane">
                <div className="drag-drop-zone" onDragOver={handleDragOver} onDrop={handleDrop} onClick={triggerFileInput}>
                  <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
                    <path d="M19.35 10.04c-.7-.38-1.5-.59-2.35-.59-2.76 0-5 2.24-5 5v.06c-.84.28-1.57.85-2.07 1.58-.29-.05-.59-.09-.93-.09-3.04 0-5.5 2.46-5.5 5.5s2.46 5.5 5.5 5.5h12c1.93 0 3.5-1.57 3.5-3.5 0-1.89-1.5-3.43-3.37-3.49.12-.49.19-.99.19-1.51 0-2.48-1.8-4.52-4.14-4.96zM14 13v4h-3v-4H8l4-4 4 4h-3z" />
                  </svg>
                  <p>
                    Drag & drop your cover image here, or <span>browse files</span>
                  </p>
                  <input type="file" ref={fileInputRef} style={{ display: "none" }} accept="image/*" onChange={handleFileUpload} />
                </div>
                {uploadedFile && (
                  <div className="upload-preview-container">
                    <span>Uploaded File Loaded successfully ✔</span>
                    <button type="button" onClick={() => updateField("uploadedFile", null)}>
                      Clear Image
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Custom URL Panel */}
            {bgSource === "url" && (
              <div className="bg-subpane">
                <div className="input-field">
                  <label htmlFor="customUrl">Direct Image URL</label>
                  <input
                    type="url"
                    id="customUrl"
                    value={customUrl}
                    onChange={(e) => updateField("customUrl", e.target.value)}
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
        <button className="btn-download" onClick={onDownload} disabled={exporting}>
          {exporting ? (
            <>
              <span className="spinner"></span>
              Exporting Cover...
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z" />
              </svg>
              Download Cover (1584 × 396)
            </>
          )}
        </button>
      </div>
    </section>
  );
};
