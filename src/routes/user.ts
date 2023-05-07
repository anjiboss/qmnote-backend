import express from "express";
import { tokenVerify } from "../middleware/token";
import { dbclient } from "../server";
import { responser } from "@utils/responser";
import HttpStatusCode from "@utils/httpStatus";
const router = express.Router();

router.get("/profile", tokenVerify, async (req, res) => {
    const id = req.profile.id;
    const user = await dbclient.user.findFirst({
        where: {
            profile: {
                id,
            },
        },
        select: {
            createdAt: true,
            email: true,
            updatedAt: true,
            profile: true,
        },
    });
    if (!user) {
        return responser(res, HttpStatusCode.UNAUTHORIZED, "User not found");
    }
    return responser(res, HttpStatusCode.OK, "Found", { user });
});

export { router as userRouter };
