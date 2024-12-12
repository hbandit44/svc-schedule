import { z } from 'zod';

export const createTaskSchema = z.object({
  account_id: z.number(),
  agent_id: z.number().optional().nullable(),
  start_time: z.string().datetime().optional().nullable(),
  end_time: z.string().datetime().optional().nullable(),
});

export type CreateTaskDto = {
  schedule_id: string;
  account_id: number;
  agent_id: number | undefined;
  start_time: Date | undefined;
  end_time: Date | undefined;
};
