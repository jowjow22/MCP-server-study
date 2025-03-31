import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";
export async function startServer(transportType, server) {
    if (transportType === "stdio") {
        const transport = new StdioServerTransport();
        await server.connect(transport);
    }
    if (transportType === "sse") {
        const app = express();
        const port = 3000;
        let transport = null;
        app.get("/sse", async (req, res) => {
            transport = new SSEServerTransport("/messages", res);
            await server.connect(transport);
        });
        app.post("/messages", async (req, res) => {
            if (transport) {
                await transport.handlePostMessage(req, res);
            }
        });
        app.listen(port, () => {
            console.log(`SSE server started on http://localhost:${port}/sse`);
        });
    }
}
