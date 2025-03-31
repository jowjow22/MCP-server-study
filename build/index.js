import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { startServer } from "./startServer.js";
import { z } from "zod";
const server = new McpServer({
    name: "test",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {},
    },
});
server.tool("hello", {
    name: z.string().describe("name of user"),
    country: z.string().describe("country of user"),
}, async ({ name, country }) => {
    return {
        content: [{ type: "text", text: `Hello ${name} from ${country} (Random text to see if it works)` }],
    };
});
const transportType = process.argv[2] === "sse" ? "sse" : "stdio";
if (!transportType) {
    console.error("Please provide a transport type: 'stdio' or 'sse'");
    process.exit(1);
}
startServer(transportType, server).catch((error) => {
    console.error("Error starting server:", error);
    process.exit(1);
});
