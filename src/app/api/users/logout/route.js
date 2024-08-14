import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { apiKeyMiddleware } from "@/utils/apiKeyMiddleware";
import authUtils from "@/utils/auth";
require('dotenv').config();

export async function POST() {
    const apiKey = await apiKeyMiddleware(req);
  
    if (!apiKey) {
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'Unauthorized',
                    message: 'Unauthorized. Invalid or non existent Api Key.'
                },
                status: 401
            },
            { status: 401 }
        );
    }

    const sessionData = await authUtils.getSession();
    if (!sessionData) {
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'Forbidden',
                    message: 'Forbidden. Access denied.',
                },
                old: req.body,
                status: 403
            },
            { status: 403 }
        );
    }

    await authUtils.clearSessionCookie();
    return NextResponse.json(
        {
            success: true,
            message: 'Logged out successfully.',
            status: 200
        },
        { status: 200 }
    );
}
