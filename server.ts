
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "node:path";
import { fileURLToPath } from "url";
import fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", mode: process.env.NODE_ENV || "development" });
  });

  const isProduction = process.env.NODE_ENV === "production";

  // Vite middleware for development
  if (!isProduction) {
    console.log(`Starting server in development mode...`);
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      console.log(`Vite server created successfully`);
      app.use(vite.middlewares);
      
      // SPA fallback for development (if needed, though appType: spa handles it)
      app.get('*', async (req, res, next) => {
        if (req.url.startsWith('/api')) return next();
        console.log(`[DevServer] Serving SPA for: ${req.url}`);
        try {
          const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
          const transformedHtml = await vite.transformIndexHtml(req.url, html);
          res.status(200).set({ 'Content-Type': 'text/html' }).end(transformedHtml);
        } catch (e) {
          console.error(`[DevServer] Error transforming HTML:`, e);
          vite.ssrFixStacktrace(e as Error);
          next(e);
        }
      });
    } catch (e) {
      console.error(`Failed to create Vite server:`, e);
    }
  } else {
    console.log(`Starting server in production mode`);
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
