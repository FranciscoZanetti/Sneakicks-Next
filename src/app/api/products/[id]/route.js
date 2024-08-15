import { NextResponse } from 'next/server';
import { prisma } from "@/libs/prisma";
import { getPublicIdFromUrl } from '@/utils/cloudinary';
import { apiKeyMiddleware } from '@/utils/apiKeyMiddleware';
import { redis } from "@/libs/redis";
import authUtils from "@/utils/auth";
import cloudinary from 'cloudinary';
// import { backendClient } from '../../edgestore/[...edgestore]/route';
import { backendClient } from "@/utils/edgestore-router";

export async function GET(req, {params}) {

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

  const id = parseInt(params.id);

  let products = await redis.get('products');
  let product;
  let colorwaves = [];
  let otherColorwaves = [];
  let recommended = [];
  let reviews = [];

  if (products){
    product = products.find(product => product.id == parseInt(id));

    try {
      reviews = await prisma.review.findMany({
        where: {
          id_product: id,
        },
      });

      product.reviews = reviews;
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        {
            success: false,
            error: {
                code: 'Internal Server Error',
                message: 'Failed to fetch product.',
            },
            status: 500
        },
        { status: 500 }
      );
    }

    colorwaves = products.filter(p => p.name == product.name && p.id != product.id);

    otherColorwaves = colorwaves.map(colorwave => ({
      id: colorwave.id,
      colorwave: colorwave.colorwave,
    }));

    recommended = products.filter(p => p.id_brand == product.id_brand && p.id != product.id);
  } else {
    try {
      product = await prisma.product.findUnique({
        where: { id: id },
        include: {
          product_sizes: true,
          reviews: true,
          brand: true,
        },
      });

      if (!product.reviews){
        product.reviews = [];
      };

      colorwaves = await prisma.product.findMany({
        where: {
          name: product.name,
          NOT: { id: product.id },
        },
        include: {
          brand: true,
        },
      });

      otherColorwaves = colorwaves.map(colorwave => ({
        id: colorwave.id,
        colorwave: colorwave.colorwave,
      }));

      recommended = await prisma.product.findMany({
        where: {
            id_brand: product.id_brand,
            id: {
                not: product.id,
            },
        },
        include: {
          brand: true,
        }
      });

    } catch (error) {
      console.error(error);
      return NextResponse.json(
        {
            success: false,
            error: {
                code: 'Internal Server Error',
                message: 'Failed to fetch product.',
            },
            status: 500
        },
        { status: 500 }
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  let checkerMen = false;
  let checkerWomen = false;
  let checkerKids = false;

  product.product_sizes.forEach(product_size => {
    if (!checkerMen && product_size.size_id > 7.0 && product_size.stock > 0) {
      checkerMen = true;
    }
    if (!checkerWomen && product_size.size_id > 4.0 && product_size.size < 10.0 && product_size.stock > 0) {
      checkerWomen = true;
    }
    if (!checkerKids && product_size.size_id < 7.0 && product_size.stock > 0) {
      checkerKids = true;
    }
  });

  // product.hasStock = {
  //   men: checkerMen,
  //   women: checkerWomen,
  //   kids: checkerKids,
  // };

  product.hasStock = false;
  if (checkerMen || checkerWomen || checkerKids){
    product.hasStock = true;
  }
  
  const data = {
    product: product,
    colorwaves: otherColorwaves,
    recommended: recommended,
  };

  return NextResponse.json(
    {
      success: true,
      data: data,
      message: 'Product fetched successfully.',
      status: 200
    },
    { status: 200 }
  );

}


export async function DELETE(req, { params }){

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
  if (sessionData?.category == 'admin') {
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

  const id = parseInt(params.id);
  let products = await redis.get("products");
  let product;
  let image_urls = [];
  
  try {
    if (!products) {
      product = await prisma.product.findUnique({
        where: { id: id }
      });
    } else {
      console.log(products, " ", JSON.stringify(products));
      
      product = products.find(p => p.id == id);
    }

    image_urls = [
      product.main_picture, product.picture1, product.picture2, product.picture3
    ].filter(url => url != null);

    await prisma.product.delete({
      where: { id: parseInt(id) }
    });

    for (const url of image_urls) {
      const res = await backendClient.products.deleteFile({ url: url });
    }

    await redis.del("products");

    products = await redis.get('products');
    console.log("REDIS PRODUCTS:  ", JSON.stringify(products));
    

    return NextResponse.json(
      {
        success: true,
        message: 'Product deleted successfully.',
        status: 200
      },
      { status: 200 }
    );

  } catch (error) {
    console.error(error);
      return NextResponse.json(
        {
            success: false,
            error: {
              code: 'Internal Server Error',
              message: 'Failed to delete product.',
              status: 500
            },
        },
        { status: 500 }
      );
  } finally {
      await prisma.$disconnect();
  }
  
}
