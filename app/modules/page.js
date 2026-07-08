import { getModules } from '@/lib/store';
import ModuleCatalog from './ModuleCatalog';

export const dynamic = 'force-dynamic';

export default async function ModulesPage() {
  const modules = await getModules();
  const cats = [...new Set(modules.map((m) => m.category))];

  const statusClass = (s) => ({
    Planned: 'planned', 'In Progress': 'progress', Complete: 'complete',
  })[s] || 'planned';

  const enriched = modules.map((m) => ({
    ...m,
    status_class: statusClass(m.status),
  }));

  return <ModuleCatalog modules={enriched} categories={cats} />;
}
