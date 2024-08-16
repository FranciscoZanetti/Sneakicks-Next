import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { apiKeyMiddleware } from "@/utils/apiKeyMiddleware";
import { redis } from "@/libs/redis";
import { productSchema } from "@/utils/validations/product";
import authUtils from "@/utils/auth";
require('dotenv').config();

export async function GET(req) {
  const apiKey = await apiKeyMiddleware(req);

  if (!apiKey) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'Unauthorized',
        message: 'Unauthorized. Invalid or non existent Api Key.'
      },
      status: 401
    }, { status: 401 });
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
      return NextResponse.json({
        success: false,
        error: {
          code: 'Internal Server Error',
          message: 'Failed to fetch products.',
        },
        status: 500
      }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  }

  let counterBasketball = 0;
  let counterLifestyle = 0;
  let counterOther = 0;
  let counterMen = 0;
  let counterWomen = 0;
  let counterKids = 0;

  let checkerMen;
  let checkerWomen;
  let checkerKids;

  let available = [];
  let unavailable = [];

  products.forEach(product => {
    if (product.category === "basketball") {
      counterBasketball += 1;
    }
    if (product.category === "lifestyle") {
      counterLifestyle += 1;
    }
    if (product.category !== "basketball" && product.category !== "lifestyle") {
      counterOther += 1;
    }

    checkerMen = false;
    checkerWomen = false;
    checkerKids = false;

    product.product_sizes.forEach(product_size => {
      if (!checkerMen && product_size.size_id > 7.0 && product_size.stock > 0) {
        counterMen += 1;
        checkerMen = true;
      }
      if (!checkerWomen && product_size.size_id > 4.0 && product_size.size < 10.0 && product_size.stock > 0) {
        counterWomen += 1;
        checkerWomen = true;
      }
      if (!checkerKids && product_size.size_id < 7.0 && product_size.stock > 0) {
        counterKids += 1;
        checkerKids = true;
      }
    });

    product.checkerMen = checkerMen;
    product.checkerWomen = checkerWomen;
    product.checkerKids = checkerKids;
    product.detail = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/products/${product.id}`;
  });

  available = products.filter(product =>
    product.product_sizes.some(product_size => product_size.stock > 0)
  );

  unavailable = products.filter(product =>
    product.product_sizes.every(product_size => product_size.stock <= 0)
  );

  response = {
    count: products.length,
    countByCategory: {
      basketball: counterBasketball,
      lifestyle: counterLifestyle,
      other: counterOther
    },
    countBySizeRange: {
      men: counterMen,
      women: counterWomen,
      kids: counterKids
    },
    products,
    available,
    unavailable
  }

  return NextResponse.json(
    {
      success: true,
      data: response,
      message: 'Products fetched successfully.',
      status: 200
    },
    { status: 200 }
  );
}


export async function POST(req) {

  console.log("ARRANCO\n");
  

  const apiKey = await apiKeyMiddleware(req);

  let body = await req.json();

  if (!apiKey) {
    return NextResponse.json(
      {
          success: false,
          error: {
              code: 'Unauthorized',
              message: 'Unauthorized. Invalid or non existent Api Key.'
          },
          old: body,
          status: 401
      },
      { status: 401 }
    );
  }

  const sessionData = await authUtils.getSession();
  // if (sessionData?.category == 'admin') {
  //   return NextResponse.json(
  //     {
  //         success: false,
  //         error: {
  //             code: 'Forbidden',
  //             message: 'Forbidden. Access denied.',
  //         },
  //         old: body,
  //         status: 403
  //     },
  //     { status: 403 }
  //   );
  // }

  try {
    let formattedValues = {
      brand_name: body.brand_name,
      category: body.category,
      colorwave: body.colorwave,
      discount: parseInt(body.discount),
      release_year: parseInt(body.release_year),
      price_original: parseInt(body.price_original),
      name: body.name,
      shoe_condition: body.shoe_condition,
      story: body.story,
      size_30: parseInt(body.size_30),
      size_35: parseInt(body.size_35),
      size_40: parseInt(body.size_40),
      size_45: parseInt(body.size_45),
      size_50: parseInt(body.size_50),
      size_55: parseInt(body.size_55),
      size_60: parseInt(body.size_60),
      size_65: parseInt(body.size_65),
      size_70: parseInt(body.size_70),
      size_75: parseInt(body.size_75),
      size_80: parseInt(body.size_80),
      size_85: parseInt(body.size_85),
      size_90: parseInt(body.size_90),
      size_95: parseInt(body.size_95),
      size_100: parseInt(body.size_100),
      size_105: parseInt(body.size_105),
      size_110: parseInt(body.size_110),
      size_115: parseInt(body.size_115),
      size_120: parseInt(body.size_120),
      size_125: parseInt(body.size_125),
      size_130: parseInt(body.size_130),
      size_135: parseInt(body.size_135),
      size_140: parseInt(body.size_140),
      size_145: parseInt(body.size_145),
      size_150: parseInt(body.size_150),
      size_155: parseInt(body.size_155),
      product_pictures: body.product_pictures,
    }

    console.log("FORMATTED VALUES:   ", formattedValues);
    

    const result = productSchema.safeParse(formattedValues);

    if (!result.success) {
      console.log(result.error.format());
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'Bad Request',
            message: 'Bad Request. Invalid or malformed body request.',
          },
          old: body,
          status: 400
        },
        { status: 400 }
      );
    }

    // Iniciar una transacción
    const [brand, product, product_sizes] = await prisma.$transaction(async (prisma) => {
      // Guardar el producto

      let brand = await prisma.brand.findFirst({
        where: { name: formattedValues.brand_name}
      });

      console.log("BRAND FOUND:  ", JSON.stringify(brand));
      

      if (!brand || typeof brand == null || typeof brand == undefined) {
        brand = await prisma.brand.create({
          data: {
            name: formattedValues.brand_name,
          }
        });
        console.log("BRAND CREATED:  ", JSON.stringify(brand));
      }

      const product = await prisma.product.create({
        data: {
          id_brand: brand.id,
          category: formattedValues.category,
          colorwave: formattedValues.colorwave,
          discount: formattedValues.discount,
          name: formattedValues.name,
          whole_name: `${formattedValues.name} ${formattedValues.colorwave}`,
          release_year: formattedValues.release_year,
          price_original: formattedValues.price_original,
          price_final: (100 - formattedValues.discount) * formattedValues.price_original / 100,
          shoe_condition: formattedValues.shoe_condition,
          story: formattedValues.story,
          main_picture: formattedValues.product_pictures[0],
          picture1: formattedValues.product_pictures[1] ?? null,
          picture2: formattedValues.product_pictures[2] ?? null,
          picture3: formattedValues.product_pictures[3] ?? null,
        },
      });

      console.log("PRODUCT CREATED:  ", JSON.stringify(product));
      

      const size_30_created = await prisma.products_size.create({
        data: {
          product_id: product.id,
          size_id: 3.0,
          stock: formattedValues.size_30,
        },
      });

      const size_35_created = await prisma.products_size.create({
        data: {
          product_id: product.id,
          size_id: 3.5,
          stock: formattedValues.size_35,
        },
      });

      const size_40_created = await prisma.products_size.create({
        data: {
          product_id: product.id,
          size_id: 4.0,
          stock: formattedValues.size_40,
        },
      });

      const size_45_created = await prisma.products_size.create({
        data: {
          product_id: product.id,
          size_id: 4.5,
          stock: formattedValues.size_45,
        },
      });

      const size_50_created = await prisma.products_size.create({
        data: {
          product_id: product.id,
          size_id: 5.0,
          stock: formattedValues.size_50,
        },
      });

      const size_55_created = await prisma.products_size.create({
        data: {
          product_id: product.id,
          size_id: 5.5,
          stock: formattedValues.size_55,
        },
      });

      const size_60_created = await prisma.products_size.create({
        data: {
          product_id: product.id,
          size_id: 6.0,
          stock: formattedValues.size_60,
        },
      });

      const size_65_created = await prisma.products_size.create({
        data: {
          product_id: product.id,
          size_id: 6.5,
          stock: formattedValues.size_65,
        },
      });

      const size_70_created = await prisma.products_size.create({
        data: {
          product_id: product.id,
          size_id: 7.0,
          stock: formattedValues.size_70,
        },
      });

      const size_75_created = await prisma.products_size.create({
        data: {
          product_id: product.id,
          size_id: 7.5,
          stock: formattedValues.size_75,
        },
      });

      const size_80_created = await prisma.products_size.create({
        data: {
          product_id: product.id,
          size_id: 8.0,
          stock: formattedValues.size_80,
        },
      });

      const size_85_created = await prisma.products_size.create({
        data: {
          product_id: product.id,
          size_id: 8.5,
          stock: formattedValues.size_85,
        },
      });

      const size_95_created = await prisma.products_size.create({
        data: {
          product_id: product.id,
          size_id: 9.5,
          stock: formattedValues.size_95,
        },
      });

      const size_100_created = await prisma.products_size.create({
        data: {
          product_id: product.id,
          size_id: 10.0,
          stock: formattedValues.size_100,
        },
      });

      const size_105_created = await prisma.products_size.create({
        data: {
          product_id: product.id,
          size_id: 10.5,
          stock: formattedValues.size_105,
        },
      });

      const size_110_created = await prisma.products_size.create({
        data: {
          product_id: product.id,
          size_id: 11.0,
          stock: formattedValues.size_110,
        },
      });

      const size_115_created = await prisma.products_size.create({
        data: {
          product_id: product.id,
          size_id: 11.5,
          stock: formattedValues.size_115,
        },
      });

      const size_120_created = await prisma.products_size.create({
        data: {
          product_id: product.id,
          size_id: 12.0,
          stock: formattedValues.size_120,
        },
      });

      const size_125_created = await prisma.products_size.create({
        data: {
          product_id: product.id,
          size_id: 12.5,
          stock: formattedValues.size_125,
        },
      });

      const size_130_created = await prisma.products_size.create({
        data: {
          product_id: product.id,
          size_id: 13.0,
          stock: formattedValues.size_130,
        },
      });

      const size_135_created = await prisma.products_size.create({
        data: {
          product_id: product.id,
          size_id: 13.5,
          stock: formattedValues.size_135,
        },
      });

      const size_140_created = await prisma.products_size.create({
        data: {
          product_id: product.id,
          size_id: 14.0,
          stock: formattedValues.size_140,
        },
      });

      const size_145_created = await prisma.products_size.create({
        data: {
          product_id: product.id,
          size_id: 14.5,
          stock: formattedValues.size_145,
        },
      });

      const size_150_created = await prisma.products_size.create({
        data: {
          product_id: product.id,
          size_id: 15.0,
          stock: formattedValues.size_150,
        },
      });

      const size_155_created = await prisma.products_size.create({
        data: {
          product_id: product.id,
          size_id: 15.5,
          stock: formattedValues.size_155,
        },
      });

      let product_sizes = [
        size_30_created,
        size_35_created,
        size_40_created,
        size_45_created,
        size_50_created,
        size_55_created,
        size_60_created,
        size_65_created,
        size_70_created,
        size_75_created,
        size_80_created,
        size_85_created,
        size_95_created,
        size_100_created,
        size_105_created,
        size_110_created,
        size_115_created,
        size_120_created,
        size_125_created,
        size_130_created,
        size_135_created,
        size_140_created,
        size_145_created,
        size_150_created,
        size_155_created,
      ]


      console.log("PRODUCT_SIZES CREATED:  ", JSON.stringify(product_sizes));
      

      return [brand, product, product_sizes];
    },
    {
      timeout: 20000,
    }
    );

    await redis.del("products");
    let products = await redis.get('products');
    console.log("REDIS PRODUCTS:  ", JSON.stringify(products));
    

    console.log("PRODUCT CREATED:  ", product);
    
    return NextResponse.json(
      {
        success: true,
        data: product,
        message: 'Product created successfully.',
        status: 201
      },
      { status: 201 }
    );

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
          success: false,
          error: {
              code: 'Internal Server Error',
              message: 'Failed to create product.',
          },
          old: body,
          status: 500
      },
      { status: 500 }
    );

  } finally {
    // await prisma.$disconnect();
  }
};


