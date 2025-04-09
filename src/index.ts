import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { z } from "zod";
import { PROMPTS, prompt_mapping } from "./prompts/index.js";
import { CallToolRequestSchema, GetPromptRequestSchema, ListPromptsRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { tools as sentry_tools, tools_functions_mapping as sentry_tools_functions_mapping, tools_schemas as sentry_tools_schemas } from "./tools/sentry/index.js";
import { tools as monday_tools, tools_functions_mapping as monday_tools_functions_mapping, tools_schemas as monday_tools_schemas } from "./tools/monday/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server({
  name: "sentry-monday-integration",
  version: "1.0.0",
}, {
  capabilities: {
    resources: {
    },
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
    prompts: {
      list: true,
      get: true,
    }
  },
});

 server.setRequestHandler(ListPromptsRequestSchema, async (request) => {
  return {
    prompts: Object.values(PROMPTS)
  };
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const promptName = request.params.name;
  const prompt = PROMPTS[promptName];
  if (!prompt) {
    throw new Error(`Prompt ${promptName} not found`);
  }
  const promptFunction = prompt_mapping[promptName](request.params.arguments as any);
  return promptFunction;
}); 

server.setRequestHandler(ListToolsRequestSchema, async (request) => {
  return {
    tools: Object.values({...sentry_tools, ...monday_tools})
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const tools = { ...sentry_tools, ...monday_tools };
  const tools_functions_mapping = { ...sentry_tools_functions_mapping, ...monday_tools_functions_mapping };
  const tools_schemas = { ...sentry_tools_schemas, ...monday_tools_schemas };
  const tool_name = request.params.name;
  const tool = tools[tool_name];
  
  if (!tool) {
    throw new Error(`Tool ${tool_name} not found`);
  }

  const tool_callback = tools_functions_mapping[tool_name];
  if (!tool_callback) {
    throw new Error(`Tool function ${tool_name} not found`);
  }

  try {
    const params = tools_schemas[tool_name].parse(request.params.arguments);
    const result = await tool_callback(params);
    return result;
  } catch (error) {
    throw new Error(`Tool function ${tool_name} call failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
});

const transport = new StdioServerTransport();
server.connect(transport);