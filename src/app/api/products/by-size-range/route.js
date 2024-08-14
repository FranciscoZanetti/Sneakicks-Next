import { NextResponse } from 'next/server';
import { prisma } from "@/libs/prisma";
import { apiKeyMiddleware } from '@/utils/apiKeyMiddleware';
import { redis } from "@/libs/redis";

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

  if (!products) {
    try {
      products = await prisma.product.findMany({
        include: {
          brand: true,
          product_sizes: true,
        },
      });

      await redis.set('products', JSON.stringify(products));

    } catch (error) {
      console.error(error);
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

  let counterMen = 0;
  let counterWomen = 0;
  let counterKids = 0;

  let productsMen = [];
  let productsWomen = [];
  let productsKids = [];

  let checkerMen = false;
  let checkerWomen = false;
  let checkerKids = false;

  products.forEach(product => {
    checkerMen = false;
    checkerWomen = false;
    checkerKids = false;

    product.product_sizes.forEach(product_size => {
      if (!checkerMen && product_size.size_id > 7.0 && product_size.stock > 0) {
        counterMen += 1;
        productsMen.push(product);
        checkerMen = true;
      }
      if (!checkerWomen && product_size.size_id > 4.0 && product_size.size < 10.0 && product_size.stock > 0) {
        counterWomen += 1;
        productsWomen.push(product);
        checkerWomen = true;
      }
      if (!checkerKids && product_size.size_id < 7.0 && product_size.stock > 0) {
        counterKids += 1;
        productsKids.push(product);
        checkerKids = true;
      }
    });
  });

  const data = {
    count: products.length,
    countBySizeRange: {
      men: counterMen,
      women: counterWomen,
      kids: counterKids
    },
    productsMen,
    productsWomen,
    productsKids,
  };

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
