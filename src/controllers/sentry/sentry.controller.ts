import { sentry_client } from "../../services/service-clients.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

class SentryController {
  async getOrganizations(): Promise<CallToolResult> {
    const organizations = await sentry_client.get("/organizations/");

    return {
      content: [{ type: "text", text: JSON.stringify(organizations) }],
    };
  }
  async getProjects({ org_id }: { org_id: string }): Promise<CallToolResult> {
    try {
      const projects = await sentry_client.get(
        `/organizations/${org_id}/projects/`
      );

      return {
        content: [{ type: "text", text: JSON.stringify(projects) }],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error fetching projects: ${error}, params org_id: ${org_id}`,
          },
        ],
      };
    }
  }

  async getIssues({
    org_id,
    project_id,
  }: {
    org_id: string;
    project_id: string;
  }): Promise<CallToolResult> {
    try {
      const issues = await sentry_client.get(
        `/projects/${org_id}/${project_id}/issues/`
      );

      return {
        content: [{ type: "text", text: JSON.stringify(issues) }],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error fetching issues: ${error}, params org_id: ${org_id}, project_id: ${project_id}`,
          },
        ],
      };
    }
  }
  
  async getLastEventHashes({
    org_id,
    project_id,
    issue_id,
  }: {
    org_id: string;
    project_id: string;
    issue_id: string;
  }): Promise<CallToolResult> {
    try {
      const hashes = await sentry_client.get(`/issues/${issue_id}/hashes/`);

      if (hashes.length === 0) {
        return {
          content: [{ type: "text", text: "No hashes found for issue" }],
        };
      }

      return {
        content: [{ type: "text", text: JSON.stringify(hashes) }],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error fetching last event hashes: ${error}, params org_id: ${org_id}, project_id: ${project_id}, issue_id: ${issue_id}`,
          },
        ],
      };
    }
  }
}

const sentryController = new SentryController();
Object.freeze(sentryController);

export { sentryController };
