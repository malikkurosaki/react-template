const text = process.argv.slice(2).join(" ");

import { markdownToPlainText } from "./lib/markdown_to_wa";

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

// Validasi input
if (!text) {
  console.error("Error: Teks notifikasi tidak boleh kosong");
  process.exit(1);
}

if (!BOT_TOKEN) {
  console.error("Error: Variabel lingkungan BOT_TOKEN harus ditetapkan");
  process.exit(1);
}

if (!CHAT_ID) {
  console.error("Error: Variabel lingkungan CHAT_ID harus ditetapkan");
  process.exit(1);
}

// Tambahkan metadata ke pesan
const timestamp = new Date().toISOString();
const notificationType = text.startsWith("Task completed:") ? "COMPLETED" :
                      text.startsWith("Need user input:") ? "INPUT_REQUIRED" : "INFO";

const messageWithMetadata = `[${timestamp}] [${notificationType}] ${markdownToPlainText(text)}`;

// Logging lokal
import fs from "fs";
import path from "path";

const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFilePath = path.join(logDir, "notifications.log");
const logEntry = `${timestamp} - ${notificationType} - ${markdownToPlainText(text)}\n`;

try {
  fs.appendFileSync(logFilePath, logEntry);
} catch (error: any) {
  console.error("Gagal menulis ke file log:", error.message);
  // Tetap lanjutkan ke pengiriman Telegram meskipun logging gagal
}

try {
  const res = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: messageWithMetadata,
      }),
    }
  );

  if (!res.ok) {
    throw new Error(`Gagal mengirim notifikasi: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  console.log("Notifikasi berhasil dikirim:", data);
} catch (error: any) {
  console.error("Error saat mengirim notifikasi:", error.message);
  process.exit(1);
}
