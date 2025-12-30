export type IssuePriority = "Low" | "Medium" | "High";
export type IssueStatus = "Open" | "In Progress" | "Done";

export interface IssueInput {
    title: string;
    description: string;
    priority: IssuePriority;
    assignedTo?: string;
    createdBy: string; // email from authenticated user
}

export interface IssueRecord extends IssueInput {
    status: IssueStatus;
    createdAt: Date;
    id: string;
}
