import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';
import { registerSchema } from "@/utils/validations/user";
import { apiKeyMiddleware } from '@/utils/apiKeyMiddleware';
import { redis } from "@/libs/redis";
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

    console.log("BODY:  ", JSON.stringify(body));
    

    let users = await redis.get('users');
    let user;

    if (users) {
        user = users.find(user => user.email == body.email);
    } else {
        try {
            user = await prisma.user.findUnique({
                where: { email: body.email }
            });
        } catch (error) {
            console.error(error);
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

    if (user) {
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'Bad Request',
                    message: 'Bad Request. User already exists.',
                },
                old: body,
                status: 404
            },
            { status: 404 }
        );
    }

    const validationResults = registerSchema.safeParse(body);
    if (!validationResults.success) {
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

    let data = {
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        category: "user",
        image: body.image ?? "https://res.cloudinary.com/dm4xprvtz/image/upload/v1721423795/dummy_user_mwn1rb.webp"
    }

    console.log("\DATA:  ", JSON.stringify(data));
    

    try {
        const newUser = await prisma.user.create({ data: data });

        await redis.del('users');

        console.log("USER CREATED  ", JSON.stringify(newUser));
        

        return NextResponse.json(
            {
                success: true,
                data: newUser,
                message: 'User registered successfully.',
                status: 201
            },
            { status: 201 }
        );

    } catch (error) {
        console.error(error);
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

};
