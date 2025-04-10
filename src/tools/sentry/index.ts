import { CallToolResult, Tool } from "@modelcontextprotocol/sdk/types.js"
import { sentryController } from "../../controllers/sentry/sentry.controller.js"
import { z } from "zod"

export const tools: Record<string, Tool> = {
    "sentry_get_organizations": {
        name: "sentry_get_organizations",
        description: "Get all organizations from Sentry",
        inputSchema: {
            type: "object",
        }
    },
    "sentry_get_projects": {
        name: "sentry_get_projects",
        description: "Get all projects from Sentry",
        inputSchema: {
            type: "object",
            properties: {
                org_id: {
                    type: "string",
                    description: "The id of the organization"
                },
            },
            required: ["org_id"]
        }
    },
    "sentry_get_issues": {
        name: "sentry_get_issues",
        description: "Get all issues from Sentry",
        inputSchema: {
            type: "object",
            properties: {
                org_id: {
                    type: "string",
                    description: "The id of the organization"
                },
                project_id: {
                    type: "string",
                    description: "The id of the project"
                }
            },
        }
    },
    "sentry_get_last_event_hashes": {
        name: "sentry_get_last_event_hashes",
        description: "Get the last event hashes from Sentry",
        inputSchema: {
            type: "object",
            properties: {
                issue_id: {
                    type: "string",
                    description: "The id of the issue"
                }
            },
        }
    }
}

export const tools_schemas: Record<string, z.ZodSchema> = {
    "sentry_get_organizations": z.object({}),
    "sentry_get_projects": z.object({
        org_id: z.string()
    }),
    "sentry_get_issues": z.object({
        org_id: z.string(),
        project_id: z.string()
    }),
    "sentry_get_last_event_hashes": z.object({
        issue_id: z.string()
    })
}

export const tools_functions_mapping: Record<string, (...args: any[]) => Promise<CallToolResult>> = {
    "sentry_get_organizations": sentryController.getOrganizations,
    "sentry_get_projects": sentryController.getProjects,
    "sentry_get_issues": sentryController.getIssues,
    "sentry_get_last_event_hashes": sentryController.getLastEventHashes
}
