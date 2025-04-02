import { sentry_client } from "../../services/service-clients.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

class SentryController {
  async getOrganizations(): Promise<CallToolResult> {
    const organizations = await sentry_client.get("/organizations/");

    return {
      content: [{ type: "text", text: JSON.stringify(organizations) }],
    };
  }
  async getProjects(org_id: string): Promise<CallToolResult> {
    const projects = await sentry_client.get(
      `/organizations/${org_id}/projects/`
    );

    return {
      content: [{ type: "text", text: JSON.stringify(projects) }],
    };
  }
  async getIssues(org_id: string, project_id: string): Promise<CallToolResult> {
    const issues = await sentry_client.get(
      `/projects/${org_id}/${project_id}/issues/`
    );

    return {
      content: [{ type: "text", text: JSON.stringify(issues) }],
    };
  }
  async getLastEventHashes(issue_id: string): Promise<CallToolResult> {
    const hashes = await sentry_client.get(`/issues/${issue_id}/hashes/`);

    if (hashes.length === 0) {
      return {
        content: [{ type: "text", text: "No hashes found for issue" }],
      };
    }

    return {
      content: [{ type: "text", text: JSON.stringify(hashes) }],
    };
  }
}

const sentryController = new SentryController();
Object.freeze(sentryController);

export { sentryController };
