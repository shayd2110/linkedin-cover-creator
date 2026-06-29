import { useState } from "react";

import { ControlPanelProps } from "../shared/interfaces";
import { DesignControls } from "./DesignControls";
import { ImageControls } from "./ImageControls";
import { PersonalDetailsForm } from "./PersonalDetailsForm";

export const ControlPanel: React.FC<ControlPanelProps> = ({ onDownload, exporting }) => {
  const [activeTab, setActiveTab] = useState<"content" | "style" | "background">("content");

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
        {activeTab === "content" && <PersonalDetailsForm />}

        {/* TAB 2: AESTHETIC STYLE */}
        {activeTab === "style" && <DesignControls />}

        {/* TAB 3: BACKGROUND IMAGE */}
        {activeTab === "background" && <ImageControls />}
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
