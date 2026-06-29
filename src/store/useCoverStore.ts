import { create } from "zustand";
import { CoverState, UnsplashPhoto } from "../shared/interfaces";



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
