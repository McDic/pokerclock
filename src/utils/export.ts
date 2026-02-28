import type { TournamentStructure } from "../types/tournament";

export function exportStructure(structure: TournamentStructure): void {
  const json = JSON.stringify(structure, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${structure.name.replace(/[^a-zA-Z0-9]/g, "_")}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importStructure(file: File): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        resolve(JSON.parse(reader.result as string));
      } catch {
        reject(new Error("Invalid JSON file"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}
