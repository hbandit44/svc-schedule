import { z } from 'zod';

export enum TaskType {
  break = 'break',
  work = 'work',
}

export const CreateTaskSchema = z.object({
  account_id: z.number(),
  start_time: z.string().datetime().optional().nullable(),
  end_time: z.string().datetime().optional().nullable(),
  type: z.enum(['break', 'work']),
});

export type CreateTaskDto = {
  account_id: number | undefined;
  type: TaskType;
};
