import "dotenv/config";
import { app } from "./app";

// Ensure /api/ai is mounted publicly without auth middleware
// If your routes are defined directly on app in app.ts, make sure 
// app.use("/api/ai", aiRouter) is used without an authMiddleware wrapper.

const PORT = Number(process.env.PORT) || 4000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;