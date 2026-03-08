import { Router } from "express";
import * as noteController from "./noteController";
import { authenticateToken, validateRequest } from "../../../shared/middleware";
import { createNoteSchema, getNotesByUserSchema, updateNoteSchema } from "./validation";

const router = Router();

router.use(authenticateToken);

router.post("/", validateRequest(createNoteSchema), noteController.createNote);
router.get("/", validateRequest(getNotesByUserSchema), noteController.getNotes);
router.get("/:noteId", noteController.getNoteById);
router.put("/:noteId", validateRequest(updateNoteSchema), noteController.updateNote);
router.delete("/:noteId", noteController.deleteNote);

export default router;
