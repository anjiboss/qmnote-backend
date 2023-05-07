/**
 * ROUTE: /sync
 * @description Syncs the notes of the user with the server
 * find syncing flow at: https://github.com/anjiboss/quick-markdown-note/blob/master/.idea/folder-structure.excalidraw
 */

import express from "express";
import { tokenVerify } from "../middleware/token";
import { dbclient } from "../server";
import { responser } from "../utils/responser";
import HttpStatusCode from "../utils/httpStatus";
const router = express.Router();

/**
 * @description Get note with title
 * @param {string} title - title of the note ( unique )
 */
router.get("/:title", tokenVerify, async (req, res) => {
    // get user's notes
    const profile = await dbclient.profile.findFirst({
        where: {
            id: req.profile.id,
        },
    });

    if (!profile) {
        return responser(res, HttpStatusCode.NOT_FOUND, "User not found", []);
    }

    // find note
    const noteFound = await dbclient.note.findFirst({
        where: {
            title: req.params.title,
            user: {
                id: req.profile.id,
            },
        },
    });

    return responser(res, HttpStatusCode.OK, "Notes found", {
        note: noteFound,
    });
});

/**
 * @description Rewrite server's notes with the client's notes
 * @param {string} title - title of the note ( unique )
 * @body {string} note - note content
 */
router.post("/:title", tokenVerify, async (req, res) => {
    const content = req.body.content;
    const title = req.params.title;
    console.log({
        body: req.body,
        param: req.params,
    });

    // find note
    const noteFound = await dbclient.note.findFirst({
        where: {
            title: title,
            user: {
                id: req.profile.id,
            },
        },
    });

    if (!noteFound) {
        // create note
        const createdNote = await dbclient.note.create({
            data: {
                title: title,
                content: content,
                user: {
                    connect: {
                        id: req.profile.id,
                    },
                },
            },
        });

        return responser(res, HttpStatusCode.OK, "Note created", createdNote);
    }

    // update note
    await dbclient.note.update({
        where: {
            id: noteFound.id,
        },
        data: {
            content: content,
        },
    });

    return responser(res, HttpStatusCode.OK, "Note updated", noteFound);
});

export { router as syncnoteRouter };
