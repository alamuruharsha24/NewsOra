export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

export interface NewsSection {
  id: string;
  name: string;
  color: string;
  rssUrl: string;
}