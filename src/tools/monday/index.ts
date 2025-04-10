import { CallToolResult, Tool } from "@modelcontextprotocol/sdk/types.js"
import { mondayController } from "../../controllers/monday/monday.controller.js"
import { z } from "zod"

export const tools: Record<string, Tool> = {
  "monday_get_boards": {
    name: "monday_get_boards",
    description: "Get all boards from Monday",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Limit of boards to be shown"
        }
      },
    }
  },
  "monday_get_groups": {
    name: "monday_get_groups",
    description: "Get all groups from Monday",
    inputSchema: {
      type: "object",
      properties: {
        board_id: {
          type: "string",
          description: "Id of the board"
        }
      },
      required: ["board_id"]
    }
  },
  "monday_get_columns": {
    name: "monday_get_columns",
    description: "Get all columns from Monday",
    inputSchema: {
      type: "object",
      properties: {
        board_id: {
          type: "string",
          description: "Id of the board"
        }
      },
      required: ["board_id"]
    },
  },
  "monday_get_columns_data": {
    name: "monday_get_columns_data",
    description: "Get all columns data from Monday",
    inputSchema: {
      type: "object",
      properties: {
        board_id: {
          type: "string",
          description: "Id of the board"
        }
      },
      required: ["board_id"]
    }
  },
  "monday_create_item": {
    name: "monday_create_item",
    description: "Create an item in Monday",
    inputSchema: {
      type: "object",
      properties: {
        board_id: {
          type: "string",
          description: "Id of the board"
        },
        group_id: {
          type: "string",
          description: "Id of the group"
        },
        item_name: {
          type: "string",
          description: "Name of the item"
        },
        description: {
          type: "string",
          description: "Description of the item"
        },
        column_values: {
          type: "object",
          description: "Column values of the item"
        }
      },
      required: ["board_id", "group_id", "item_name", "description", "column_values"]
    }
  }
}

export const tools_schemas: Record<string, z.ZodSchema> = {
    "monday_get_boards": z.object({
        limit: z.number()
    }),
    "monday_get_groups": z.object({
        board_id: z.string()
    }),
    "monday_get_columns": z.object({
        board_id: z.string()
    }),
    "monday_get_columns_data": z.object({
        board_id: z.string()
    }),
    "monday_create_item": z.object({
        board_id: z.string(),
        group_id: z.string(),
        item_name: z.string(),
        description: z.string(),
        column_values: z.record(z.string(), z.any())
    })
}

export const tools_functions_mapping: Record<string, (...args: any[]) => Promise<CallToolResult>> = {
    "monday_get_boards": mondayController.getBoards,
    "monday_get_groups": mondayController.getGroups,
    "monday_get_columns": mondayController.getColumns,
    "monday_get_columns_data": mondayController.getColumnsData,
    "monday_create_item": mondayController.createItem
}
