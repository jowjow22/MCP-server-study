import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { startServer } from "./start-server.js";
import { z } from "zod";
import service from "./services/index.js";
import { formatStacktrace } from "./utils/format-stacktrace.js";

const server = new McpServer({
  name: "test",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

server.tool(
  "get_organizations",
  async () => {
    const organizations = await service.get('/organizations/');

      return {
          content: [{type: "text", text: JSON.stringify(organizations)}],
      }
  }
)

server.tool(
  "get_projects",
  {
    org_id: z.string().describe("the id of the organization"),
  },
  async ({ org_id }: { org_id: string }) => {
    const projects = await service.get(`/organizations/${org_id}/projects/`);

    return {
      content: [{type: "text", text: JSON.stringify(projects)}],
    }
  }
)

server.tool(
  "get_issues",
  {
    org_id: z.string().describe("the id of the organization"),
    project_id: z.string().describe("the id of the project"),
  },
  async ({ org_id, project_id }: { org_id: string, project_id: string }) => {
    const issues = await service.get(`/projects/${org_id}/${project_id}/issues/`);

    return {
      content: [{type: "text", text: JSON.stringify(issues)}],
    }
  }
)

server.tool(
  "get_last_event_hashes",
  {
    issue_id: z.string().describe("the id of the issue"),
  },
  async ({ issue_id }: { issue_id: string }) => {
    const issue = await service.get(`/issues/${issue_id}/`);
    const hashes = await service.get(`/issues/${issue_id}/hashes/`);

    if (hashes.length === 0) {
      return {
        content: [{type: "text", text: "No hashes found for issue"}],
      }
    }


    return {
      content: [{type: "text", text: JSON.stringify(hashes)}],
    }
  }
)

const transportType = process.argv[2] === "sse" ? "sse" : "stdio";
if (!transportType) {
  console.error("Please provide a transport type: 'stdio' or 'sse'");
  process.exit(1);
}

startServer(transportType, server).catch((error) => {
  console.error("Error starting server:", error);
  process.exit(1);
});