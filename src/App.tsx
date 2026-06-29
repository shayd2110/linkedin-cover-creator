import { useEffect, useRef, useState } from "react";
import { ControlPanel } from "./components/ControlPanel";
import { CoverPreview } from "./components/CoverPreview";
import { useExportImage } from "./hooks/useExportImage";
import { UnsplashPhoto } from "./shared/interfaces";
import { useCoverStore } from "./store/useCoverStore";
import { useUnsplash } from "./hooks/useUnsplash";
export default function App() {
  // Personal Details
  const { firstName, lastName, jobTitle, email, phone, font, dividerColor, dividerWidth, panelColor, rightPanelOpacity, updateField } =
    useCoverStore();
  const { fetchUnsplashPhoto } = useUnsplash();
  // Background Image state
  const [bgSource, setBgSource] = useState<"unsplash" | "upload" | "url">("unsplash");
  const [unsplashPhoto, setUnsplashPhoto] = useState<UnsplashPhoto | null>(null);
  const [unsplashQuery, setUnsplashQuery] = useState("AI FRONTEND");
  const [customUrl, setCustomUrl] = useState("");
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Interface State

  const [showMockup, setShowMockup] = useState(true);
  const [previewScale, setPreviewScale] = useState(1);

  // Refs
  const coverRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const { exportAsPNG, exporting } = useExportImage();

  useEffect(() => {
    updateField("backgroundUrl", getBgImageSrc());
  }, [bgSource, uploadedFile, customUrl, unsplashPhoto]);

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
    window.addEventListener("resize", handleResize);
    // Add small delay to let layout settle
    const timeout = setTimeout(handleResize, 100);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeout);
    };
  }, [showMockup]);

  // Get background image source
  const getBgImageSrc = () => {
    if (bgSource === "upload" && uploadedFile) {
      return uploadedFile;
    }
    if (bgSource === "url" && customUrl) {
      return customUrl;
    }
    if (unsplashPhoto) {
      return unsplashPhoto.urls.regular;
    }
    return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1584&auto=format&fit=crop"; // fallback
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-logo">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
          <h1>LinkedIn Cover Creator</h1>
        </div>
        <div className="header-badge">
          <span>Based on code by </span>
          <a href="https://scrimba.com" target="_blank" rel="noopener noreferrer">
            Scrimba 💜
          </a>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="workspace">
        {/* Settings Panel */}
        <ControlPanel onDownload={() => exportAsPNG(coverRef)} exporting={exporting} />

        {/* Preview Area */}
        <section className="preview-area">
          <div className="preview-toolbar">
            <h2>Live View</h2>
            <div className="toolbar-controls">
              <label className="checkbox-control">
                <input type="checkbox" checked={showMockup} onChange={(e) => setShowMockup(e.target.checked)} />
                Show LinkedIn Profile Picture Mockup
              </label>
            </div>
          </div>

          <div className="preview-container" ref={previewContainerRef} style={{ paddingBottom: showMockup ? "100px" : "20px" }}>
            {/* Native 1584x396 pixel container, scaled using CSS transform to fit responsive width */}
            <div
              className="scaled-viewport-wrapper"
              style={{
                width: "100%",
                aspectRatio: "1584 / 396",
                overflow: "visible",
                position: "relative",
              }}
            >
              <div
                className="cover-canvas-outer"
                style={{
                  width: "1584px",
                  height: "396px",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  transform: `scale(${previewScale})`,
                  transformOrigin: "top left",
                }}
              >
                {/* Core cover element which is captured during export */}
                <CoverPreview ref={coverRef} />

                {/* LinkedIn Avatar Mockup Overlay */}
                {showMockup && (
                  <div className="linkedin-avatar-mockup">
                    <div className="mockup-circle">
                      {/* Generates a simple avatar preview */}
                      <span className="avatar-initials">
                        {firstName.charAt(0)}
                        {lastName.charAt(0)}
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
                <div className="mockup-profile-headline">{jobTitle}</div>
                <div className="mockup-profile-location">
                  Tel Aviv District, Israel • <span className="mockup-link">Contact info</span>
                </div>
                <div className="mockup-profile-connections">500+ connections</div>
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
