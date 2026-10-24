import "dotenv/config";
import { app } from "./app";

const PORT = Number(process.env.PORT) || 4000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;