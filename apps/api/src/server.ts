// Point d'entrée du backend Fastify (Projet Ednah).
// En production, sert l'API sous /api ET le front React buildé (apps/web/dist).
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { existsSync } from "node:fs";
import { registerRoutes } from "./routes/index.js";

const PORT = Number(process.env.PORT ?? 3000);
const HOST = "0.0.0.0"; // OBLIGATOIRE pour le déploiement conteneurisé

const app = Fastify({ logger: true });

// --- API ---
// Route santé obligatoire (healthcheck Coolify). Ne pas supprimer.
app.get("/api/health", async () => ({ status: "ok" }));
await registerRoutes(app);

// --- Front statique en production ---
const __dirname = dirname(fileURLToPath(import.meta.url));
const webDist = join(__dirname, "../../web/dist");
if (existsSync(webDist)) {
  await app.register(fastifyStatic, { root: webDist });
  // Fallback SPA : toute route non-API renvoie index.html
  app.setNotFoundHandler((req, reply) => {
    if (req.url.startsWith("/api")) return reply.code(404).send({ error: "Not found" });
    return reply.sendFile("index.html");
  });
}

app
  .listen({ port: PORT, host: HOST })
  .then(() => app.log.info(`API Ednah démarrée sur http://${HOST}:${PORT}`))
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
