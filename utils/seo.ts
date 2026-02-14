
export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

const DEFAULT_TITLE = "PageDraft | Professional Content Management & Minimalist Blogging Platform";
const DEFAULT_DESC = "PageDraft is a high-performance, minimalist content drafting platform designed for visionary creators.";
const DEFAULT_KEYWORDS = "PageDraft, minimalist blogging, content drafting, professional writing platform";

export const updateSEO = ({
  title,
  description,
  keywords,
  image,
  url
}: SEOProps) => {
  const fullTitle = title ? `${title} | PageDraft` : DEFAULT_TITLE;
  const metaDesc = description || DEFAULT_DESC;
  const metaKeywords = keywords || DEFAULT_KEYWORDS;
  const metaImage = image || "https://pagedraft.pages.dev/og-image.jpg";
  const metaUrl = url || window.location.href;

  // Update Title
  document.title = fullTitle;

  // Helper to update or create meta tags
  const setMetaTag = (attrName: string, attrValue: string, content: string) => {
    let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attrName, attrValue);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  // Standard Meta Tags
  setMetaTag('name', 'description', metaDesc);
  setMetaTag('name', 'keywords', metaKeywords);
  setMetaTag('name', 'title', fullTitle);

  // Open Graph / Facebook
  setMetaTag('property', 'og:title', fullTitle);
  setMetaTag('property', 'og:description', metaDesc);
  setMetaTag('property', 'og:image', metaImage);
  setMetaTag('property', 'og:url', metaUrl);

  // Twitter
  setMetaTag('property', 'twitter:title', fullTitle);
  setMetaTag('property', 'twitter:description', metaDesc);
  setMetaTag('property', 'twitter:image', metaImage);
};
