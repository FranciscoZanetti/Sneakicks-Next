import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { apiKeyMiddleware } from "@/utils/apiKeyMiddleware";
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

    let products = await redis.get('products');
    
    console.log("\nREDIS PRODUCTS: " + JSON.stringify(products) + "\n");
    
    if (!products) {
        try {
            products = await prisma.product.findMany({
                include: {
                    brand: true,
                    product_sizes: true,
                },
            });
            await redis.set("products", JSON.stringify(products));
        } catch (error) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'Internal Server Error',
                        message: 'Failed to fetch products.',
                    },
                    status: 500
                },
                { status: 500 }
            );
        } finally {
            await prisma.$disconnect();
        }
    }

    let newOnes = [];
    let used = [];
    let bargains = [];
    let unreleased = [];

    let counterNewOnes = 0;
    let counterUsed = 0;
    let counterBargains = 0;
    let counterUnreleased = 0;

    const year = new Date().getFullYear();

    products.forEach(product => {
        if (product.shoe_condition == "new_no_def"){
            newOnes.push(product);
            counterNewOnes++;
        } else {
            used.push(product);
            counterUsed++;
        }
        if (product.release_year > year){
            used.push(product);
            counterUnreleased++;
        }
        if (product.discount > 0){
            bargains.push(product);
            counterBargains++;
        }
    });

    let data = {
        counterNewones: counterNewOnes,
        counterUsed: counterUsed,
        counterBargains: counterBargains,
        counterUnreleased: counterUnreleased,
        newones: newOnes,
        used: used,
        bargains: bargains,
        unreleased: unreleased
    }

    return NextResponse.json(
        {
          success: true,
          data: data,
          message: 'Products fetched successfully.',
          status: 200
        },
        { status: 200 }
    );

}
