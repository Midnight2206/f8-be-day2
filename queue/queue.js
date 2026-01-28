import "#src/config/dotenv.config.js";
import tasks from "#src/tasks/index.js";
import { dequeue, enqueue } from "./memory.queue.js";

console.log("Redis queue worker started...");

async function run() {
  while (true) {
    const job = await dequeue();
    console.log(job)
    const task = tasks[job.type];
    if (!task) {
      console.error(`Task not found: ${job.type}`);
      continue;
    }

    try {
      console.log(`Running task: ${job.type}`, job.id);
      await task(job.payload);
      console.log(`Done task: ${job.type}`, job.id);
    } catch (err) {
      job.attempts += 1;

      console.error(
        `Task failed (${job.attempts}/${job.maxAttempts}):`,
        job.type,
        err.message
      );

      if (job.attempts < job.maxAttempts) {
        // retry
        await enqueue(job.type, job.payload, {
          maxAttempts: job.maxAttempts,
        });
      } else {
        console.error(`Job dead: ${job.id}`);
      }
    }
  }
}

run();
