import { RefObject, useState } from "react";
import { useCoverStore } from "../store/useCoverStore";
import { toPng } from "html-to-image";

export const useExportImage = () => {
  const [exporting, setExporting] = useState(false);

  const { firstName, lastName } = useCoverStore();

  const exportAsPNG = async (coverRef: RefObject<HTMLDivElement>) => {
    if (!coverRef.current) return;

    setExporting(true);

    try {
      await new Promise((res) => setTimeout(res, 300));

      const dataUrl = await toPng(coverRef.current, {
        width: 1584,
        height: 396,
        style: {
          transform: "none",
          position: "static",
        },
        cacheBust: true,
      });
      const link = document.createElement("a");
      const safeFirstName = firstName ? firstName.toLowerCase() : "cover";
      const safeLastName = lastName ? lastName.toLowerCase() : "image";

      link.download = `linkedin-cover-${safeFirstName.toLowerCase()}-${safeLastName.toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export error:", err);
      alert(
        "Could not export image. This is often caused by remote image access controls. Try uploading a local file, which bypasses CORS security checks!",
      );
    } finally {
      setExporting(false);
    }
  };
  return { exportAsPNG, exporting };
};
