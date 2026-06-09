export enum TaskStatus {
    todo = "todo",
    doing = "doing",
    done = "done"
}

export interface Task {
    title: string,
    status: TaskStatus
}