import { COLOR_PRESETS, GOOGLE_FONTS } from "../shared/consts";
import { useShallow } from "zustand/react/shallow";
import { useCoverStore } from "../store/useCoverStore";

export const DesignControls: React.FC = () => {
  const { font, dividerColor, dividerWidth, panelColor, rightPanelOpacity, updateField } = useCoverStore(
    useShallow((state) => ({
      font: state.font,
      dividerColor: state.dividerColor,
      dividerWidth: state.dividerWidth,
      panelColor: state.panelColor,
      rightPanelOpacity: state.rightPanelOpacity,
      updateField: state.updateField,
    }))
  );
  return (
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
  );
};
