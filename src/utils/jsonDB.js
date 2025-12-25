import fs from "fs/promises";
import path from "path";

const dbDirPath = path.join(process.cwd(), "db");

function getFilePath(resourceName) {
  return path.join(dbDirPath, `${resourceName}.json`);
}

async function ensureDBFile(resourceName) {
  const filePath = getFilePath(resourceName);

  await fs.mkdir(dbDirPath, { recursive: true });

  try {
    const content = await fs.readFile(filePath, "utf-8");
    JSON.parse(content);
  } catch (error) {
    if (error.code !== "ENOENT" && !(error instanceof SyntaxError)) {
      throw error;
    }

    // file chưa tồn tại hoặc JSON lỗi
    await fs.writeFile(
      filePath,
      JSON.stringify([], null, 2),
      "utf-8"
    );
  }
  return filePath;
}

export async function loadDB(resourceName) {
  const filePath = await ensureDBFile(resourceName);
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}

export async function saveDB(resourceName, data) {
  const filePath = await ensureDBFile(resourceName);
  await fs.writeFile(
    filePath,
    JSON.stringify(data, null, 2),
    "utf-8"
  );
}
