import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tasks = {};

const files = fs.readdirSync(__dirname);

for (const file of files) {
  if (
    file === "index.js" ||
    !file.endsWith(".task.js")
  ) {
    continue;
  }

  const taskName = file.replace(".task.js", "");
  const module = await import(`./${file}`);

  tasks[taskName] = module.default;
}

export default tasks;
