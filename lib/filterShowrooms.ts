import type { ShowroomGroup } from '../types/bike';

export function filterShowroomGroups(groups: ShowroomGroup[], query: string): ShowroomGroup[] {
  const q = query.trim().toLowerCase();
  if (!q) return groups;

  return groups.filter((g) => {
    if (g.showroomName.toLowerCase().includes(q)) return true;
    if (g.showroomAddress?.toLowerCase().includes(q)) return true;
    if (g.showroomProvince?.toLowerCase().includes(q)) return true;
    return g.bikes.some(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.brand.toLowerCase().includes(q) ||
        (b.showroom_name?.toLowerCase().includes(q) ?? false),
    );
  });
}
