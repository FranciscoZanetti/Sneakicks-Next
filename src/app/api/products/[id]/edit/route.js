import { NextResponse } from 'next/server';
import { upload, getPublicIdFromUrl } from '@/utils/cloudinary';
import { prisma } from '@/libs/prisma';
import { productSchema } from "@/utils/validations/product";
import { apiKeyMiddleware } from '@/utils/apiKeyMiddleware';
import { redis } from '@/libs/redis';
import authUtils from "@/utils/auth";
import cloudinary from 'cloudinary';
require('dotenv').config();


export async function PATCH(req, { params }){

    return NextResponse.json({status: 200});
}

