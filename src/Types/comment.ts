export interface Comment {
  id?: string;
  blog_id: string;
  author_id: string;
  content: string;
  image_url: string | null;
  created_at?: string;
}
