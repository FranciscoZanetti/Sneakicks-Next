import { NextResponse } from 'next/server';
import { upload, getPublicIdFromUrl } from '@/utils/cloudinary';
import { prisma } from '@/libs/prisma';
import { registerSchema } from "@/utils/validations/user";
import { userFileValidator } from "@/utils/validations/file";
import { apiKeyMiddleware } from '@/utils/apiKeyMiddleware';
import cloudinary from 'cloudinary';
import { redis } from "@/libs/redis";
require('dotenv').config();


export async function GET(req) {
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

    try {
        const users = await prisma.user.findMany();
        await redis.set('users', JSON.stringify(users));

        return NextResponse.json(
            {
                success: true,
                data: users,
                status: 200
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'Internal Server Error',
                    message: 'An error occurred while fetching users.'
                },
                status: 500
            },
            { status: 500 }
        );
    }
}