import { getNotionCategories } from '../../server/get-notion-categories';
import { getNotionPages } from '../../server/get-notion-pages';
import { NotionDomainPageClient } from './page-client';

export default async function NotionDomainPage() {
  const { data, total } = await getNotionPages(false, 1, 10);
  const categoriesData = await getNotionCategories();

  return <NotionDomainPageClient pages={data} total={total} categories={categoriesData} />;
}
