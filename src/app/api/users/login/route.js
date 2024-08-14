import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { apiKeyMiddleware } from "@/utils/apiKeyMiddleware";
import { loginSchema } from "@/utils/validations/user";
import authUtils from "@/utils/auth";
import bcrypt from 'bcrypt';
require('dotenv').config();


export async function POST(req) {
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

    let body = await req.json();

    const result = loginSchema.safeParse(body);

    if (!result.success) {
        console.log(result.error.format());
        console.log("FLAG 1");
      return NextResponse.json(
        {
            success: false,
            error: {
                code: 'Bad Request',
                message: 'Bad Request. Invalid or malformed request.',
            },
            old: body,
            status: 400
        },
        { status: 400 }
      );
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: body.email },
        });

        if (!user) {
            console.log("FLAG 2");
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'Not Found',
                        message: 'Not Found. User not found.',
                    },
                    old: body,
                    status: 404
                },
                { status: 404 }
            );
        } else {
            const isPassword = await bcrypt.compare(body.password, user.password);

            if (!isPassword) {
                console.log("FLAG 3");
                return NextResponse.json(
                    {
                        success: false,
                        error: {
                            code: 'Bad Request',
                            message: 'Bad Request. Password is incorrect.',
                        },
                        old: body,
                        status: 400
                    },
                    { status: 400 }
                );
            }

            await authUtils.setSessionCookie(user);
            console.log("FLAG 4");
            return NextResponse.json(
                {
                    success: true,
                    data: user,
                    message: 'Login Successful.',
                    status: 200
                },
                { status: 200 }
            );
        }
    } catch (error) {
        console.log(error);
        console.log("FLAG 5");
        return NextResponse.json({
            success: false,
            error: {
              code: 'Internal Server Error',
              message: 'Failed to fetch products.',
            },
            old: body,
            status: 500
        }, { status: 500 });
    }
}
