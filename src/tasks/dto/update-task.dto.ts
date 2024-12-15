import { z } from 'zod';

export const UpdateTaskSchema = z.object({
  agent_id: z.number().optional().nullable(),
  start_time: z.string(),
  end_time: z.string().datetime().optional(),
});

export type UpdateTaskDto = {
  schedule_id: string;
  agent_id: number | undefined;
  start_time: Date | undefined;
  end_time: Date | undefined;
};
