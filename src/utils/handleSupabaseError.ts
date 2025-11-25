import { AppError } from "../api/errors/AppError";

export function handleSupabaseError(error: any) {
    if (!error) return;

    const message = error.message ?? "Unknown database error";
    const status = error.code ?? 400;

    throw new AppError(message, status);
}
