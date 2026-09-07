// Enregistre ici les routes métier du projet.
// Exemple : app.get("/api/hello", async () => ({ message: "Bonjour depuis Ednah" }));
import type { FastifyInstance } from "fastify";

export async function registerRoutes(app: FastifyInstance): Promise<void> {
  app.get("/api/hello", async () => ({
    message: "Bonjour depuis Hello Ednah 👋",
    project: "hello-ednah",
  }));
}
