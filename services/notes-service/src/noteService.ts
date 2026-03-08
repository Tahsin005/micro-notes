import { createServiceError, sanitizeInput } from "@shared/utils";
import { prisma } from "./database";
import { CreateNoteRequest, Note } from "@shared/types";

export class NotesService {
    constructor() {}

    async createNote(
        userId: string,
        noteData: CreateNoteRequest,
        authToken?: string
    ): Promise<Note> {
        // sanitize input data
        const sanitizedTitl = sanitizeInput(noteData.title);
        const sanitizedContent = sanitizeInput(noteData.content);

        //Create note
        const note = await prisma.note.create({
        data: {
            userId,
            title: sanitizedTitl,
            content: sanitizedContent,
        },
        include: {
            noteTags: true,
        },
        });

        // TODO: add tags to note if provided

        return note as Note;
    }

    async getNoteById(noteId: string, userId: string): Promise<Note> {
        const note = await prisma.note.findFirst({
            where: {
                id: noteId,
                userId,
                isDeleted: false,
            },
            include: {
                noteTags: true,
            },
        });

        if (!note) {
            throw createServiceError("Note not found", 404);
        }

        return note as Note;
    }
}