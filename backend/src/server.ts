import "dotenv/config";
import cron from "node-cron";
import app from "@/app";
import { scrapeAllActiveSources } from "@/services/news.service";

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => {
  console.log(`[server] API escuchando en http://localhost:${PORT}`);
});

if (process.env.ENABLE_SCRAPE_CRON === "true") {
  const schedule = process.env.SCRAPE_CRON || "0 * * * *";
  cron.schedule(schedule, async () => {
    console.log("[cron] Ejecutando scraping programado...");
    try {
      await scrapeAllActiveSources();
    } catch (err) {
      console.error("[cron] Error en scraping programado:", err);
    }
  });
  console.log(`[cron] Scraping automático activado (${schedule})`);
}
