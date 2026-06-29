import { create } from "zustand";

// הגדרת הממשק (Interface) של הסטייט
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

  updateField: <K extends keyof Omit<CoverState, "updateField">>(field: K, value: CoverState[K]) => void;
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

  updateField: (field, value) =>
    set((state) => ({
      ...state,
      [field]: value,
    })),
}));
