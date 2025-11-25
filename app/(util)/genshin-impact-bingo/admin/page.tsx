import GenshinData from 'genshin-data';
import { AdminPanel } from './components/AdminPanel';

export default async function AdminPage() {
  const genshinData = new GenshinData({ language: 'korean' });
  const characters = await genshinData.characters();
  const characterNames = characters.map((c) => c.name);

  return <AdminPanel characterNames={characterNames} />;
}
