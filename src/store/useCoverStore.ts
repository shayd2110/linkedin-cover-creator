import { create } from "zustand";
import { UnsplashPhoto } from "../shared/interfaces";

interface CoverState {
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

  // -- משתני התמונות שהוספנו --
  bgSource: "unsplash" | "upload" | "url";
  unsplashPhoto: UnsplashPhoto | null;
  unsplashQuery: string;
  customUrl: string;
  uploadedFile: string | null;
  loading: boolean;
  error: string | null;

  updateField: <K extends keyof Omit<CoverState, "updateField" | "fetchUnsplashPhoto">>(field: K, value: CoverState[K]) => void;
}

export const useCoverStore = create<CoverState>((set) => ({
  firstName: "Shay",
  lastName: "Doron",
  jobTitle: "Frontend/Full Stack Developer",
  email: "your.email@example.com",
  phone: "050-0000000",
  dividerColor: "#00AEB3",
  dividerWidth: 50,
  panelColor: "#000000",
  font: "Sora",
  rightPanelOpacity: 0.85,
  backgroundUrl: null,

  bgSource: "unsplash",
  unsplashPhoto: null,
  unsplashQuery: "AI FRONTEND",
  customUrl: "",
  uploadedFile: null,
  loading: false,
  error: null,

  updateField: (field, value) =>
    set((state) => ({
      ...state,
      [field]: value,
    })),
}));
