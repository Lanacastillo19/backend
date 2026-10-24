import "dotenv/config";
import { reviewProject } from "./gemini";

async function tryAi() {
  const review = await reviewProject(
    "I need to study for my ITELECT4 exam on Saturday and finish " +
      "my GT5 task before Friday night."
  );
  console.log(JSON.stringify(review, null, 2));
}

tryAi().catch((err: unknown) => {
  console.error("Gemini call failed:", err);
  process.exit(1);
});