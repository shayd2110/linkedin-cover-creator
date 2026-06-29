import { useEffect, useRef, useState } from "react";
import { useCoverStore } from "../store/useCoverStore";
import { CoverPreview } from "./CoverPreview";
import { LinkedInMockup } from "./LinkedInMockup";
import { PreviewAreaProps } from "../shared/interfaces";


export const PreviewArea: React.FC<PreviewAreaProps> = ({
    coverRef,
    showMockup,
    setShowMockup,
}) => {
    const {
        firstName,
        lastName,
    } = useCoverStore();

    // Interface State
    const [previewScale, setPreviewScale] = useState(1);
    const previewContainerRef = useRef<HTMLDivElement>(null);


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
    return (
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
                {showMockup && <LinkedInMockup />}
            </div>
        </section>
    )
}
