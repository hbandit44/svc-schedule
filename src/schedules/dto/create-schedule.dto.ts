import { z } from 'zod';

export const CreateScheduleSchema = z.object({
  account_id: z.number(),
  agent_id: z.number().optional().nullable(),
  start_time: z.string().datetime().optional().nullable(),
  end_time: z.string().datetime().optional().nullable(),
});

export type CreateScheduleDto = z.infer<typeof CreateScheduleSchema>;
