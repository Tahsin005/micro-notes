import { createServiceError } from "@shared/utils";
import { prisma } from "./database";
import { Note } from "@shared/types";

export class NotesService {
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