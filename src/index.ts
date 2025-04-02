import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { startServer } from "./utils/start-server.js";
import { z } from "zod";
import { sentryController } from "./controllers/sentry/sentry.controller.js";
import { mondayController } from "./controllers/monday/monday.controller.js";
const server = new McpServer({
  name: "sentry-monday-integration",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {
      sentry_get_organizations: {
        description: "Get all organizations from Sentry",
        parameters: z.object({
          org_id: z.string().describe("the id of the organization"),
        }),
      },
      sentry_get_projects: {
        description: "Get all projects from Sentry",
        parameters: z.object({
          org_id: z.string().describe("the id of the organization"),
        }),
      },
      sentry_get_issues: {
        description: "Get all issues from Sentry",
        parameters: z.object({
          org_id: z.string().describe("the id of the organization"),
          project_id: z.string().describe("the id of the project"),
        }),
      },
      sentry_get_last_event_hashes: {
        description: "Get the last event hashes from Sentry",
        parameters: z.object({
          issue_id: z.string().describe("the id of the issue"),
        }),
      },
      monday_get_boards: {
        description: "Get all boards from Monday",
        parameters: z.object({
          limit: z.number().describe("the limit of boards to be shown"),
        }),
      },
      monday_get_groups: {
        description: "Get all groups from Monday",
        parameters: z.object({
          board_id: z.string().describe("the id of the board"),
        }),
      },
      monday_get_columns: {
        description: "Get all columns from Monday",
        parameters: z.object({
          board_id: z.string().describe("the id of the board"),
        }),
      },
      monday_get_columns_data: {
        description: "Get all columns data from Monday",
        parameters: z.object({
          board_id: z.string().describe("the id of the board"),
        }),
      },
      monday_create_item: {
        description: "Create an item in Monday",
        parameters: z.object({
          board_id: z.string().describe("the id of the board"),
          group_id: z.string().describe("the id of the group"),
          item_name: z.string().describe("the name of the item"),
          description: z.string().describe("the description of the item"),
          column_values: z
            .record(z.string(), z.string())
            .describe(
              "the column values, the key is the column id and the value is the value of the column"
            ),
        }),
      },
    },
  },
});

server.tool("sentry_get_organizations", async () => {
  return await sentryController.getOrganizations();
});

server.tool(
  "sentry_get_projects",
  {
    org_id: z.string().describe("the id of the organization"),
  },
  async ({ org_id }: { org_id: string }) => {
    return await sentryController.getProjects(org_id);
  }
);

server.tool(
  "sentry_get_issues",
  {
    org_id: z.string().describe("the id of the organization"),
    project_id: z.string().describe("the id of the project"),
  },
  async ({ org_id, project_id }: { org_id: string; project_id: string }) => {
    return await sentryController.getIssues(org_id, project_id);
  }
);

server.tool(
  "sentry_get_last_event_hashes",
  {
    issue_id: z.string().describe("the id of the issue"),
  },
  async ({ issue_id }: { issue_id: string }) => {
    return await sentryController.getLastEventHashes(issue_id);
  }
);

server.tool(
  "monday_get_boards",
  {
    limit: z.number().describe("limit of boards to be shown"),
  },
  async ({ limit }: { limit: number }) => {
    return await mondayController.getBoards(limit);
  }
);

server.tool(
  "monday_get_groups",
  {
    board_id: z.string().describe("the id of the board"),
  },
  async ({ board_id }: { board_id: string }) => {
    return await mondayController.getGroups(board_id);
  }
);

server.tool(
  "monday_get_columns",
  {
    board_id: z.string().describe("the id of the board"),
  },
  async ({ board_id }: { board_id: string }) => {
    return await mondayController.getColumns(board_id);
  }
);

server.tool(
  "monday_get_columns_data",
  {
    board_id: z.string().describe("the id of the board"),
  },
  async ({ board_id }: { board_id: string }) => {
    return await mondayController.getColumnsData(board_id);
  }
);

server.tool(
  "monday_create_item",
  {
    board_id: z.string().describe("the id of the board"),
    group_id: z.string().describe("the id of the group"),
    item_name: z.string().describe("the name of the item"),
    description: z.string().describe("the description of the item"),
    column_values: z
      .record(z.string(), z.string())
      .describe(
        "the column values, the key is the column id and the value is the value of the column"
      ),
  },
  async ({
    board_id,
    group_id,
    item_name,
    description,
    column_values,
  }: {
    board_id: string;
    group_id: string;
    item_name: string;
    column_values: { [key: string]: string };
    description: string;
  }) => {
    return await mondayController.createItem(
      board_id,
      group_id,
      item_name,
      description,
      column_values
    );
  }
);

const transportType = process.argv[2] === "sse" ? "sse" : "stdio";

if (!transportType) {
  console.error("Please provide a transport type: 'stdio' or 'sse'");
  process.exit(1);
}

startServer(transportType, server).catch((error) => {
  console.error("Error starting server:", error);
  process.exit(1);
});
