import { useState, useEffect } from "react";
import { api } from "../api/api";

export default function usePageContent(pageName, defaultContent) {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api.getContent(pageName)
      .then(res => {
        if (active && res && res.data) {
          // Merge API content with default content
          const merged = { ...defaultContent };
          Object.keys(res.data).forEach(key => {
            if (res.data[key] !== null && res.data[key] !== undefined) {
              merged[key] = res.data[key];
            }
          });
          setContent(merged);
        }
      })
      .catch(err => {
        console.warn(`Failed to load site content for page "${pageName}":`, err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [pageName]);

  return { content, loading };
}
