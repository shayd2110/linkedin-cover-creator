import { create } from "zustand";
import { UnsplashPhoto } from "../shared/interfaces"; // נוודא שזה מיובא

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
  fetchUnsplashPhoto: (queryStr?: string) => Promise<void>;
}

export const useCoverStore = create<CoverState>((set, get) => ({
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

  fetchUnsplashPhoto: async (queryStr = "") => {
    set({ loading: true, error: null });
    try {
      const baseUrl = "https://apis.scrimba.com/unsplash/photos/random/?orientation=landscape";
      const url = queryStr ? `${baseUrl}&query=${encodeURIComponent(queryStr)}` : baseUrl;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch image");
      const data = await res.json();

      set({
        unsplashPhoto: data,
        loading: false,
      });
    } catch (err: any) {
      console.error(err);
      set({
        error: "Could not load random image.",
        loading: false,
      });
    }
  },
}));
