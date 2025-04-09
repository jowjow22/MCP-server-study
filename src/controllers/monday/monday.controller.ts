import { monday_client } from "../../services/service-clients.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { formatDescription } from "../../utils/format-description.js";

class MondayController {
  async getBoards({ limit }: { limit: number }): Promise<CallToolResult> {
    try {
      const boards = await monday_client.query(
        `query{
        boards (limit:${limit}) {
          id
          name
        } 
      }`
    );

    return {
        content: [{ type: "text", text: JSON.stringify(boards) }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error fetching boards: ${error}, params limit: ${limit}` }],
      };
    }
  }
  async getGroups({ board_id }: { board_id: string }): Promise<CallToolResult> {
    try {
      const groups = await monday_client.query(
        `query {
        boards (ids: ${board_id}) {
          groups {
            title
            id
          }
        }
      }`
      );

    return {
        content: [{ type: "text", text: JSON.stringify(groups) }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error fetching groups: ${error}, params board_id: ${board_id}` }],
      };
    }
  }

  async getColumns({
    board_id,
  }: {
    board_id: string;
  }): Promise<CallToolResult> {
    try {
      const allowed_columns = await monday_client.query(
        `query {
        boards(ids: ${board_id}) {
          columns {
            id
            title
            type
          }
        }
      }`
    );

    return {
        content: [{ type: "text", text: JSON.stringify(allowed_columns) }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error fetching columns: ${error}, params board_id: ${board_id}` }],
      };
    }
  }

  async getColumnsData({
    board_id,
  }: {
    board_id: string;
  }): Promise<CallToolResult> {
    try {
      const emails = await monday_client.query(
        `query {
        boards(ids: ${board_id}) {
          owners {
            email
            name
          }
          subscribers {
            email
            name
          }
        }
      }`
    );
    const response = await monday_client.query(
      `query {
        boards(ids: ${board_id}) {
          columns {
            id
            title
            type
            settings_str
          }
        }
      }`
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ emails, columns: response }),
        },
      ],
    };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error fetching columns data: ${error}, params board_id: ${board_id}` }],
      };
    }
  }

  async createItem({
    board_id,
    group_id,
    item_name,
    description,
    column_values,
  }: {
    board_id: string;
    group_id: string;
    item_name: string;
    description: string;
    column_values: { [key: string]: string };
  }): Promise<CallToolResult> {
    try {
      const column_values_json = JSON.stringify(column_values);

    const escaped_column_values = column_values_json.replace(/"/g, '\\"');

    const query = `mutation {
      create_item (
        board_id: ${board_id},
        group_id: "${group_id}",
        item_name: "${item_name}",
        column_values: "${escaped_column_values}"
      ) {
        id
        name
        }
      }`;

    const update_query = (item_id: string) => `mutation {
      create_update (item_id: ${item_id}, body: "${formatDescription(
      description
    )}") {
        id
      }
    }`;

    const result = await monday_client.query(query);
    const item_id = result.data.create_item.id;
    const item_update = await monday_client.query(update_query(item_id));
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            created_item: result,
            created_update: item_update.data,
          }),
        },
      ],
    };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error creating item: ${error}, params board_id: ${board_id}, group_id: ${group_id}, item_name: ${item_name}, description: ${description}, column_values: ${column_values}` }],
      };
    }
  }
}

const mondayController = new MondayController();

Object.freeze(mondayController);

export { mondayController };
