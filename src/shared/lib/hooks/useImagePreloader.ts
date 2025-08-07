import { useEffect } from 'react';

/**
 * A custom hook to preload a list of images.
 * This works by creating `Image` objects in memory, which prompts the browser
 * to fetch and cache them without rendering them to the DOM.
 * @param urls - An array of image URLs to preload.
 */
export const useImagePreloader = (urls: string[]) => {
    useEffect(() => {
        urls.forEach(url => {
            if (url) {
                const img = new Image();
                img.src = url;
            }
        });
    }, [urls]); // Re-run effect if the list of URLs changes
};
