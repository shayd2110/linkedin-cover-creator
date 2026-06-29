import { useRef } from "react";
import { useUnsplash } from "../hooks/useUnsplash";
import { useCoverStore } from "../store/useCoverStore";

export const ImageControls: React.FC = () => {
  const { bgSource, unsplashQuery, unsplashPhoto, customUrl, uploadedFile, loading, error, updateField } = useCoverStore();
  const { fetchUnsplashPhoto } = useUnsplash();
  const fileInputRef = useRef<HTMLInputElement>(null);
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
  );
};
