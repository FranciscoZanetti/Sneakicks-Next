import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';
import { reviewSchema } from "@/utils/validations/product";
import { apiKeyMiddleware } from '@/utils/apiKeyMiddleware';
import authUtils from "@/utils/auth";
require('dotenv').config();

export async function POST(req, { params }) {

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

    // const sessionData = await authUtils.getSession();
    // if (!sessionData) {
    //     return NextResponse.json(
    //     {
    //         success: false,
    //         error: {
    //             code: 'Forbidden',
    //             message: 'Forbidden. Access denied.',
    //         },
    //         old: req.body,
    //         status: 403
    //     },
    //     { status: 403 }
    //     );
    // }

    const productId = parseInt(params.id);

    try{
        let body = await req.json();

        // console.log('Request:', req);
        // console.log('Request stringified:', JSON.stringify(req));

        console.log('Request body:', body);
        console.log('Request body stringified:', JSON.stringify(body));

        const result = reviewSchema.safeParse(body);
  
        if (!result.success) {
            console.log(result.error.format());
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

        const review = await prisma.review.create({
            data: {
                stars: body.stars,
                text: body.text,
                id_product: productId
            }
        });

        console.log("REVIEW CREATED:  ", JSON.stringify(review));
        

        return NextResponse.json(
            {
              success: true,
              data: review,
              message: 'Review created successfully.',
              status: 201
            },
            { status: 201 }
        );

    } catch (error){
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'Internal Server Error',
                    message: 'Failed to create review.',
                },
                old: body,
                status: 500
            },
            { status: 500 }
        );

    } finally {
        await prisma.$disconnect();
    };
};


export async function GET(req, { params }){

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

    const productId = parseInt(params.id);

    try {
        const reviews = await prisma.review.findMany({
            where: {
                id_product: productId
            }
        });

        return NextResponse.json(
            {
              success: true,
              data: reviews,
              message: 'Review created successfully.',
              status: 201
            },
            { status: 201 }
        );

    } catch(error){
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'Internal Server Error',
                    message: 'Failed to fetch reviews.',
                },
                old: req.body,
                status: 500
            },
            { status: 500 }
        );
    }
}