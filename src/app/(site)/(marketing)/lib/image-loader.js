import { readdir } from "fs/promises";
import path from "path";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".svg"]);

function getFsPath(folder) {
  const segments = String(folder ?? "")
    .split("/")
    .map((seg) => seg.trim())
    .filter(Boolean);
  return path.join(process.cwd(), "public", ...segments);
}

async function listFolderImages(folder) {
  if (!folder) return [];
  try {
    const dirPath = getFsPath(folder);
    const entries = await readdir(dirPath);
    const files = entries.filter((entry) =>
      IMAGE_EXTENSIONS.has(path.extname(entry).toLowerCase())
    );
    return files
      .sort()
      .map((fileName) => {
        const normalizedFolder = folder.replace(/\\/g, "/").replace(/\/$/, "");
        return `/${normalizedFolder}/${fileName}`;
      });
  } catch {
    return [];
  }
}

async function attachImages(items, folderField) {
  return Promise.all(
    items.map(async (item) => {
      const images = await listFolderImages(item[folderField]);
      return {
        ...item,
        images: images.length > 0 ? images : item.images ?? [],
      };
    })
  );
}

export function attachRoomImages(rooms) {
  return attachImages(rooms, "imageFolder");
}

export function attachFacilityImages(facilities) {
  return attachImages(facilities, "imageFolder");
}
