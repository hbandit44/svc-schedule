import { z } from 'zod';

export const UpdateScheduleSchema = z.object({
  account_id: z.number().optional(),
  start_time: z.string().datetime().optional(),
  end_time: z.string().datetime().optional(),
});

export type UpdateScheduleDto = z.infer<typeof UpdateScheduleSchema>;
