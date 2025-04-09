export type Prompt = {
  name: string;
  description: string;
  arguments: {
    name: string;
    description: string;
    required: boolean;
  }[];
};

export const PROMPTS: Record<string, Prompt> = {
  "task-description": {
    name: "task-description",
    description:
      "This prompt is used to describe the task that the user wants to complete.",
    arguments: [
      {
        name: "task_name",
        description: "The name of the task that the user wants to complete.",
        required: true,
      },
      {
        name: "stack_trace",
        description:
          "The stack trace of the error that the user wants to complete.",
        required: true,
      },
    ],
  },
};

export type Message = {
  role: string;
  content: {
    type: string;
    text: string;
  };
};
export type PromptFunction<T> = (args: T) => {
  messages: Message[];
};

export const prompt_mapping: Record<string, PromptFunction<{stack_trace: string, task_name: string}>> = {
  "task-description": ({
    stack_trace,
    task_name,
  }: {
    stack_trace: string;
    task_name: string;
  }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Generate a concise task description for the following error: ${stack_trace} and the task name: ${task_name}`,
        },
      },
    ],
  }),
};
