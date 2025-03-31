import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express, { Request, Response } from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export async function startServer(transportType: "stdio" | "sse", server: McpServer) {
  if (transportType === "stdio") {
    const transport = new StdioServerTransport();
    await server.connect(transport);
  }
  if (transportType === "sse") {
    const app = express();
    const port = 3000;
    let transport: SSEServerTransport | null = null;

    app.get("/sse", async (req: Request, res: Response) => {
      transport = new SSEServerTransport("/messages", res);
      await server.connect(transport);
    });

    app.post("/messages", async (req: Request, res: Response) => {
      if (transport) {
        await transport.handlePostMessage(req, res);
      }
    })

    app.listen(port, () => {
      console.log(`SSE server started on http://localhost:${port}/sse`);
    });
  }
}