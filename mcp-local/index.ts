import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import z from "zod"
import { markdownToPlainText } from "./src/markdown_to_wa"

const mcpServer = new McpServer({
    name: "tanstack-mcp",
    version: "1.1.0",
    title: "mcp-local"
})

/* ------------------------------------------------------------------
 * 📦 TOOL: Mantine Component
 * ------------------------------------------------------------------ */
mcpServer.registerTool(
    "mantine_component",
    {
        description: "Get Mantine LLM reference",
    },
    async () => {
        const res = await fetch("https://mantine.dev/llms.txt")
        const text = await res.text()
        return {
            content: [{ type: "text", text }],
        }
    }
)

/* ------------------------------------------------------------------
 * 🔔 TOOL: Notify User
 * ------------------------------------------------------------------ */


mcpServer.registerTool(
  "notify_user",
  {
    title: "kirim informasi ke user",
    description: "Gunakan tool ini untuk mengirim informasi kepada pengguna",
    inputSchema: z.object({
      text: z.string(),
    }),
  },
  async ({ text }) => {
    const BOT_TOKEN = process.env.BOT_TOKEN;
    const CHAT_ID = process.env.CHAT_ID;

    const res = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: markdownToPlainText(text),
        }),
      }
    );

    const data = await res.json();

    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
    };
  }
);
;


/* ------------------------------------------------------------------
 * 🚀 CONNECT
 * ------------------------------------------------------------------ */
await mcpServer.connect(new StdioServerTransport())
