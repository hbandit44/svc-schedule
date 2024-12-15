-- CreateView
CREATE VIEW "TaskWithDuration" AS 
SELECT 
    id,
    account_id,
    schedule_id,
    start_time,
    end_time,
    (end_time - start_time) as duration,
    type,
    created_at,
    updated_at
FROM 
  "Task";

