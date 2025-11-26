import GenshinData from 'genshin-data';
import { AdminPanel } from './components/AdminPanel';

export default async function AdminPage() {
  const genshinData = new GenshinData({ language: 'korean' });
  const characters = await genshinData.characters();
  const characterNames = characters
    .map((c) => c.name)
    .filter((c) => {
      if (c.includes('여행자') || c.includes('별인형')) return false;
      return true;
    });

  return <AdminPanel characterNames={characterNames} />;
}
