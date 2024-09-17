import { FirearmsMaintenanceData } from "../app/team/gunsmithing/columns";

export const cycleFirearms = (
  firearms: FirearmsMaintenanceData[],
  count: number,
  startIndex: number = 0
): FirearmsMaintenanceData[] => {
  if (firearms.length === 0) {
    console.warn("No firearms provided to cycle through.");
    return [];
  }

  const cycledFirearms: FirearmsMaintenanceData[] = [];
  let index = startIndex % firearms.length;

  while (cycledFirearms.length < count) {
    cycledFirearms.push(firearms[index]);
    index = (index + 1) % firearms.length;
  }

  return cycledFirearms;
};