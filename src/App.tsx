import { useEffect, useRef, useState } from "react";
import { ControlPanel } from "./components/ControlPanel";
import { Header } from "./components/Header";
import { useExportImage } from "./hooks/useExportImage";
import { useCoverStore } from "./store/useCoverStore";
import { useShallow } from "zustand/react/shallow";
import { getBgImageSrc } from "./utils/styleUtils";
import { PreviewArea } from "./components/PreviewArea";
export default function App() {
  const { bgSource, uploadedFile, customUrl, unsplashPhoto, updateField } = useCoverStore(
    useShallow((state) => ({
      bgSource: state.bgSource,
      uploadedFile: state.uploadedFile,
      customUrl: state.customUrl,
      unsplashPhoto: state.unsplashPhoto,
      updateField: state.updateField,
    })),
  );

  const [showMockup, setShowMockup] = useState(true);

  // Refs
  const coverRef = useRef<HTMLDivElement>(null);
  const { exportAsPNG, exporting } = useExportImage();

  useEffect(() => {
    updateField("backgroundUrl", getBgImageSrc(bgSource, uploadedFile, customUrl, unsplashPhoto));
  }, [bgSource, uploadedFile, customUrl, unsplashPhoto]);

  return (
    <div className="app-container">
      <Header />
      <main className="workspace">
        <ControlPanel onDownload={() => exportAsPNG(coverRef)} exporting={exporting} />
        <PreviewArea coverRef={coverRef} showMockup={showMockup} setShowMockup={setShowMockup} />
      </main>
    </div>
  );
}
