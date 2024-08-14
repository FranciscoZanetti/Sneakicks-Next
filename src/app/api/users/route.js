import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { apiKeyMiddleware } from "@/utils/apiKeyMiddleware";
import { userSchema } from "@/utils/validations/user";
import authUtils from "@/utils/auth";
require('dotenv').config();


export async function GET(req){
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

    let sessionData = await authUtils.getSession();
    if (!sessionData) {
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'Forbidden',
                    message: 'Forbidden. Access denied.',
                },
                status: 403
            },
            { status: 403 }
        );
    }

    delete sessionData.password;

    return NextResponse.json(
        {
            success: true,
            data: sessionData,
            message: 'Profile loaded successfully.',
            status: 200
        },
        { status: 200 }
    );
}


export async function PATCH(req) {
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

    let sessionData = await authUtils.getSession();

    if (!sessionData) {
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'Forbidden',
                    message: 'Forbidden. Access denied.',
                },
                status: 403
            },
            { status: 403 }
        );
    }

    const isPassword = bcrypt.compare(req.body.oldPassword, sessionData.password);

    if (!isPassword) {
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'Bad Request',
                    message: 'Bad Request. Password is incorrect.',
                },
                old: req.body,
                status: 400
            },
            { status: 400 }
        );
    }

    const result = userSchema.safeParse({ email: sessionData.email, password: req.body.newPassword });

    if (!result.success) {
        console.log(result.error.format());
        return NextResponse.json(
            {
                success: false,
                error: {
                code: 'Bad Request',
                message: 'Bad Request. Invalid or malformed request.',
                },
                old: req.body,
                status: 400
            },
            { status: 400 }
        );
    }

    const cryptedPassword = await bcrypt.hash(req.body.newPassword, 10);

    const newUserInfo = {
        ...(req.body.first_name && { first_name: req.body.first_name }),
        ...(req.body.last_name && { last_name: req.body.last_name }),
        ...(req.body.email && { email: req.body.email }),
        ...(req.body.newPassword && { password: cryptedPassword })
    };

    const newSessionData = {
        ...sessionData.user,
        ...(req.body.first_name && { first_name: req.body.first_name }),
        ...(req.body.last_name && { last_name: req.body.last_name }),
        ...(req.body.email && { email: req.body.email }),
        ...(req.body.newPassword && { password: cryptedPassword })
    }

    try {
        await prisma.user.update({
            where: { id: sessionData.id },
            data: newUserInfo,
        });

        await authUtils.setSessionCookie(newSessionData);

        return NextResponse.json(
            {
                success: true,
                message: 'User updated successfully.',
                status: 201
            },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: {
                code: 'Internal Server Error',
                message: 'Failed to update user.',
            },
            old: req.body,
            status: 500
        }, { status: 500 });
    }
}


export async function DELETE(req) {
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
                status: 403
            },
            { status: 403 }
        );
    }

    const isPassword = bcrypt.compare(req.body.password, sessionData.password);
    if (!isPassword) {
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'Bad Request',
                    message: 'Bad Request. Password is incorrect.',
                },
                old: req.body,
                status: 400
            },
            { status: 400 }
        );
    }

    try {

        await prisma.$transaction(async (prisma) => {
            await prisma.products_cart.delete({
                where: { user_id: sessionData.id, bought: 0 },
            });
            await prisma.user.delete({
                where: { id: sessionData.id }
            });
        });

        const publicId = getPublicIdFromUrl(sessionData.image);
        await cloudinary.uploader.destroy(publicId);

        await authUtils.clearSessionCookie();

        return NextResponse.json(
            {
                success: true,
                message: 'User deleted successfully.',
                status: 201
            },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: {
                code: 'Internal Server Error',
                message: 'Failed to update user.',
            },
            old: req.body,
            status: 500
        }, { status: 500 });
    }
}
