export interface NewsItem {
  id: number;
  created_at: string;
  title: string;
  text: string;
  image_id: string | null;
  image_url: string | null;
}
