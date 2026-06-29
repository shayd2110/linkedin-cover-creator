import { UnsplashPhoto } from "../shared/interfaces";

export const getBgImageSrc = (
    bgSource: "unsplash" | "upload" | "url",
    uploadedFile: string | null,
    customUrl: string,
    unsplashPhoto: UnsplashPhoto | null
): string => {
    if (bgSource === "upload" && uploadedFile) {
        return uploadedFile;
    }
    if (bgSource === "url" && customUrl) {
        return customUrl;
    }
    if (unsplashPhoto) {
        return unsplashPhoto.urls.regular;
    }
    return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1584&auto=format&fit=crop"; // fallback
};
