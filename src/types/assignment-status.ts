export const ASSIGNMENT_STATUSES = ["created", "finished"] as const;
export type AssignmentStatuses = (typeof ASSIGNMENT_STATUSES)[number];
