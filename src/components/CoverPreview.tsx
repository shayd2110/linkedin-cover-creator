import { forwardRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { useCoverStore } from "../store/useCoverStore";

export const CoverPreview = forwardRef<HTMLDivElement>((_, ref) => {
  const {
    firstName,
    lastName,
    jobTitle,
    email,
    phone,
    dividerColor,
    dividerWidth,
    panelColor,
    font,
    rightPanelOpacity,
    backgroundUrl,
  } = useCoverStore(
    useShallow((state) => ({
      firstName: state.firstName,
      lastName: state.lastName,
      jobTitle: state.jobTitle,
      email: state.email,
      phone: state.phone,
      dividerColor: state.dividerColor,
      dividerWidth: state.dividerWidth,
      panelColor: state.panelColor,
      font: state.font,
      rightPanelOpacity: state.rightPanelOpacity,
      backgroundUrl: state.backgroundUrl,
    }))
  );

  const getPanelBgColor = () => {
    const hex = panelColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16) || 0;
    const g = parseInt(hex.substring(2, 4), 16) || 0;
    const b = parseInt(hex.substring(4, 6), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${rightPanelOpacity})`;
  };

  return (
    <div
      ref={ref}
      id="linkedin-cover"
      className="linkedin-cover-element"
      style={{
        fontFamily: font,
      }}
    >
      {/* Background Image */}
      {backgroundUrl ? (
        <img className="cover-bg-image" src={backgroundUrl} alt="Cover Background" crossOrigin="anonymous" />
      ) : (
        <div className="cover-bg-image" style={{ backgroundColor: "#1e293b" }}></div> // Fallback if no image
      )}

      {/* Aspect crop helper */}
      <div className="cover-border-frame"></div>

      {/* Personal details right-hand card */}
      <div
        className="right-info-panel"
        style={{
          backgroundColor: getPanelBgColor(),
        }}
      >
        <h4 className="name-header first-name">{firstName || "Shay"}</h4>
        <h4 className="name-header last-name">{lastName || "Doron"}</h4>
        <div
          className="accent-divider"
          style={{
            backgroundColor: dividerColor,
            width: `${dividerWidth}%`,
          }}
        ></div>
        <h5 className="title-text">{jobTitle || "Developer"}</h5>
        <h5 className="contact-text email">{email || "email@example.com"}</h5>
        <h5 className="contact-text phone">{phone || "050-0000000"}</h5>
      </div>
    </div>
  );
});
