export interface Source {
  id: string
  name: string
  url: string
  active: boolean
}

export interface Category {
  id: string
  name: string
  _count?: { news: number }
}

export interface Summary {
  id: string
  content: string
  createdAt: string
}

export interface News {
  id: string
  title: string
  url: string
  content: string
  imageUrl?: string | null
  author?: string | null
  publishedAt?: string | null
  createdAt: string
  source: Source
  category?: Category | null
  summary?: Summary | null
}

export interface PaginatedNews {
  items: News[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
