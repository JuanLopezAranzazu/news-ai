export interface ScrapedArticle {
  title: string;
  url: string;
  content: string;
  imageUrl?: string | null;
  author?: string | null;
  publishedAt?: Date | null;
}

export interface AiResult {
  summary: string;
  category: string;
}

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
