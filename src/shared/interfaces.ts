import { RefObject } from "react";

export interface UnsplashPhoto {
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

export interface ControlPanelProps {
  onDownload: () => void;
  exporting: boolean;
}

export interface CoverState {
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phone: string;
  dividerColor: string;
  dividerWidth: number;
  panelColor: string;
  font: string;
  rightPanelOpacity: number;
  backgroundUrl: string | null;

  bgSource: "unsplash" | "upload" | "url";
  unsplashPhoto: UnsplashPhoto | null;
  unsplashQuery: string;
  customUrl: string;
  uploadedFile: string | null;
  loading: boolean;
  error: string | null;

  updateField: <K extends keyof Omit<CoverState, "updateField" | "fetchUnsplashPhoto">>(field: K, value: CoverState[K]) => void;
}

export interface PreviewAreaProps {
  coverRef: RefObject<HTMLDivElement>;
  showMockup: boolean;
  setShowMockup: (show: boolean) => void;
}
