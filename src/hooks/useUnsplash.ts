import { useCallback } from "react";
import { useCoverStore } from "../store/useCoverStore";

export const useUnsplash = () => {
  const updateField = useCoverStore((state) => state.updateField);

  const fetchUnsplashPhoto = useCallback(
    async (queryStr = "") => {
      updateField("loading", true);
      updateField("error", null);

      try {
        const baseUrl = "https://apis.scrimba.com/unsplash/photos/random/?orientation=landscape";
        const url = queryStr ? `${baseUrl}&query=${encodeURIComponent(queryStr)}` : baseUrl;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch image");
        const data = await res.json();

        updateField("unsplashPhoto", data);
        updateField("backgroundUrl", data.urls.regular);
      } catch (err: any) {
        console.error("Unsplash Error:", err);
        updateField("error", "Could not load random image. Try a different query.");
      } finally {
        updateField("loading", false);
      }
    },
    [updateField],
  );

  return { fetchUnsplashPhoto };
};
