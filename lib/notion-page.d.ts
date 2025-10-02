export interface NotionPage {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  cover: string | null;
  category: string | null;
  categoryColor: string | null;
  url: string;
  created_date: string;
  post_id: string | null;
}
