import { z } from 'zod';

export const updateTaskSchema = z.object({
  agent_id: z.number().optional().nullable(),
  start_time: z.string().datetime().optional().nullable(),
  end_time: z.string().datetime().optional().nullable(),
});

export type UpdateTaskDto = {
  schedule_id: string;
  agent_id: number | undefined;
  start_time: Date | undefined;
  end_time: Date | undefined;
};
