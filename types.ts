
export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  avatar: string;
}

export type PostStatus = 'draft' | 'published' | 'scheduled';

export interface Post {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  author: string;
  image: string;
  status: PostStatus;
  tags: string[];
  publishedAt?: string;
  likes_count?: number; // Virtual or computed field
  expand?: {
    author: User;
  };
}

export interface Comment {
  id: string;
  post: string;
  user: string;
  content: string;
  created: string;
  expand?: {
    user: User;
  };
}

export interface Like {
  id: string;
  post: string;
  user: string;
  created: string;
}

export interface Activity {
  id: string;
  user: string;
  type: 'comment' | 'like' | 'post';
  description: string;
  link: string;
  created: string;
}

export interface PocketBaseResponse<T> {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: T[];
}
