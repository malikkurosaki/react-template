import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import fs from "fs";
import path from "path";

// Mock environment variables
process.env.BOT_TOKEN = "mock_bot_token";
process.env.CHAT_ID = "mock_chat_id";

// Mock fetch
global.fetch = vi.fn();

describe("scripts/notify_user.ts", () => {
  beforeEach(() => {
    // Bersihkan mock dan siapkan untuk tes
    vi.clearAllMocks();
    
    // Mock fetch response
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, result: { message_id: 1 } }),
    });
  });

  afterEach(() => {
    // Hapus file log jika ada
    const logFilePath = path.join(process.cwd(), "logs", "notifications.log");
    if (fs.existsSync(logFilePath)) {
      fs.unlinkSync(logFilePath);
    }
    
    // Hapus direktori logs jika kosong
    const logDir = path.join(process.cwd(), "logs");
    if (fs.existsSync(logDir)) {
      fs.rmdirSync(logDir);
    }
  });

  it("harus mengirim notifikasi ke Telegram dan mencatat ke log", async () => {
    // Simulasikan argumen baris perintah
    const originalArgv = process.argv;
    process.argv = ["node", "notify_user.ts", "Test", "notification"];

    // Impor skrip
    await import("../scripts/notify_user");

    // Verifikasi bahwa fetch dipanggil dengan parameter yang benar
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.telegram.org/botmock_bot_token/sendMessage",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: expect.any(String),
      }
    );

    // Verifikasi bahwa body berisi teks notifikasi
    const callArgs = (global.fetch as any).mock.calls[0];
    const requestBody = JSON.parse(callArgs[1].body);
    expect(requestBody.text).toContain("Test notification");

    // Verifikasi bahwa file log dibuat dan berisi entri
    const logFilePath = path.join(process.cwd(), "logs", "notifications.log");
    expect(fs.existsSync(logFilePath)).toBe(true);
    
    const logContent = fs.readFileSync(logFilePath, "utf8");
    expect(logContent).toContain("Test notification");
    expect(logContent).toContain("INFO"); // Karena bukan "Task completed:" atau "Need user input:"
  });

  it("harus gagal dengan pesan kesalahan jika tidak ada teks", async () => {
    // Simulasikan argumen tanpa teks
    const originalArgv = process.argv;
    process.argv = ["node", "notify_user.ts"];

    // Tangkap error
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, "exit").mockImplementation((() => {}) as any);

    try {
      await import("../scripts/notify_user");
    } catch (e) {
      // Abaikan error karena kita hanya ingin memeriksa perilaku
    }

    // Verifikasi bahwa pesan kesalahan dicetak
    expect(consoleSpy).toHaveBeenCalledWith("Error: Teks notifikasi tidak boleh kosong");
    expect(exitSpy).toHaveBeenCalledWith(1);

    // Kembalikan spy
    consoleSpy.mockRestore();
    exitSpy.mockRestore();
  });

  it("harus gagal dengan pesan kesalahan jika BOT_TOKEN tidak disetel", async () => {
    // Hapus BOT_TOKEN
    delete process.env.BOT_TOKEN;

    // Simulasikan argumen
    const originalArgv = process.argv;
    process.argv = ["node", "notify_user.ts", "Test", "notification"];

    // Tangkap error
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, "exit").mockImplementation((() => {}) as any);

    try {
      await import("../scripts/notify_user");
    } catch (e) {
      // Abaikan error karena kita hanya ingin memeriksa perilaku
    }

    // Verifikasi bahwa pesan kesalahan dicetak
    expect(consoleSpy).toHaveBeenCalledWith("Error: Variabel lingkungan BOT_TOKEN harus ditetapkan");
    expect(exitSpy).toHaveBeenCalledWith(1);

    // Kembalikan spy
    consoleSpy.mockRestore();
    exitSpy.mockRestore();
  });

  it("harus gagal dengan pesan kesalahan jika CHAT_ID tidak disetel", async () => {
    // Hapus CHAT_ID
    delete process.env.CHAT_ID;

    // Simulasikan argumen
    const originalArgv = process.argv;
    process.argv = ["node", "notify_user.ts", "Test", "notification"];

    // Tangkap error
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, "exit").mockImplementation((() => {}) as any);

    try {
      await import("../scripts/notify_user");
    } catch (e) {
      // Abaikan error karena kita hanya ingin memeriksa perilaku
    }

    // Verifikasi bahwa pesan kesalahan dicetak
    expect(consoleSpy).toHaveBeenCalledWith("Error: Variabel lingkungan CHAT_ID harus ditetapkan");
    expect(exitSpy).toHaveBeenCalledWith(1);

    // Kembalikan spy
    consoleSpy.mockRestore();
    exitSpy.mockRestore();
  });
});