import "dotenv/config";
import { reviewProject } from "./gemini";

async function tryAi() {
  const review = await reviewProject(
    "A course submission tracker in React and TypeScript. Students " +
      "log in, pick a course, and save the GitHub link of their " +
      "project. The API is Express and MongoDB, deployed on Vercel."
  );
  console.log(JSON.stringify(review, null, 2));
}

tryAi().catch((err: unknown) => {
  console.error("Gemini call failed:", err);
  process.exit(1);
});