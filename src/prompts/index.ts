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
        name: "error_message",
        description:
          "The error message that the user wants to complete.",
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

export const prompt_mapping: Record<string, PromptFunction<{stack_trace: string, error_message: string, task_name: string}>> = {
  "task-description": ({
    stack_trace,
    error_message,
    task_name,
  }: {
    stack_trace: string;
    error_message: string;
    task_name: string;
  }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `You are a specialist in the field of software development. You are given a stack trace and an error message. 
          You need to generate a task description for your team to be able to understand the task context and the possible solutions,
          you only write descriptions that pragmatically solve the problem, you don't write descriptions that are not related to the problem.
          to create the task description you use the following format:

          Contexto:
          <context of the task>
          Problema:
          <problem_description>
          Resultado esperado:
          <result_expected>
          Soluções possíveis:
          <possible_solutions>
          
          knowing that the stack trace is: ${stack_trace} and the error message is: ${error_message} and the task name is: ${task_name}
          `,
        },
      },
    ],
  }),
};
