export interface ApiResponse<T> {
    data: T;
    message?: string;
    status?: number;
}

export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
    code?: string;
}

export class AppError extends Error {
    constructor(
        public message: string,
        public status?: number,
        public code?: string,
        public errors?: Record<string, string[]>
    ) {
        super(message);
        this.name = 'AppError';
    }
}
