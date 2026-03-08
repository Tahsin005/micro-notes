import { Request, Response } from "express";
import { asyncHandler } from "@shared/middleware";
import { NotesService } from "./noteService";
import { createErrorResponse, createSuccessResponse } from "@shared/utils";

const noteService = new NotesService();

export const createNote = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json(createErrorResponse("Unauthorized"));
    }

    // Extract JWT token from auth header
    const authHeader = req.headers.authorization;
    const authToken = authHeader?.startsWith("Bearer ")
        ? authHeader.slice(7)
        : undefined;

    const note = await noteService.createNote(userId, req.body, authToken);

    return res.status(201).json(createSuccessResponse(note, "Note created successfully"));
});

export const getNoteById = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { noteId } = req.params;

    if (!userId) {
        return res.status(401).json(createErrorResponse("Unauthorized"));
    }

    const note = await noteService.getNoteById(noteId, userId);

    return res.status(200).json(createSuccessResponse(note, "Note retrieved successfully"));
});