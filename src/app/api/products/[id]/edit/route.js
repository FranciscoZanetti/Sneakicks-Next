// import { NextResponse } from 'next/server';
// import { upload, getPublicIdFromUrl } from '@/utils/cloudinary';
// import { prisma } from '@/libs/prisma';
// import { productSchema } from "@/utils/validations/product";
// import { apiKeyMiddleware } from '@/utils/apiKeyMiddleware';
// import { redis } from '@/libs/redis';
// import authUtils from "@/utils/auth";
// import cloudinary from 'cloudinary';
// require('dotenv').config();


// export async function PATCH(req, { params }){

//     const apiKey = await apiKeyMiddleware(req);

//     if (!apiKey) {
//       return NextResponse.json(
//         {
//             success: false,
//             error: {
//                 code: 'Unauthorized',
//                 message: 'Unauthorized. Invalid or non existent Api Key.'
//             },
//             status: 401
//         },
//         { status: 401 }
//       );
//     }

//     const sessionData = await authUtils.getSession();
//     // if (sessionData?.category == 'admin') {
//     //     return NextResponse.json(
//     //     {
//     //         success: false,
//     //         error: {
//     //             code: 'Forbidden',
//     //             message: 'Forbidden. Access denied.',
//     //         },
//     //         old: req.body,
//     //         status: 403
//     //     },
//     //     { status: 403 }
//     //     );
//     // }

//     const productId = parseInt(params.id);

//     const uploadMiddleware = upload.array('images', 5);

//     const formData = new Promise((resolve, reject) => {
//       uploadMiddleware(req, null, (err) => {
//         if (err) return reject(err);
//         resolve(req);
//       });
//     });

//     let request;
  
//     try {
//       request = await formData;
  
//       // Validar el resto de los datos del formulario
//       const body = request.body;
//       const result = productSchema.safeParse(body);
  
//       if (!result.success) {
//         console.log(result.error.format());
//         return NextResponse.json(
//           {
//               success: false,
//               error: {
//                 code: 'Bad Request',
//                 message: 'Bad Request. Invalid or malformed request.',
//               },
//               old: body,
//               status: 400
//           },
//           { status: 400 }
//         );
//       }
  
//       // Preparar los datos para guardar en la base de datos
//         let data = {
//             brandId: (await prisma.brand.upsert({
//             where: { name: request.body.brand_name },
//             update: {},
//             create: { name: request.body.brand_name },
//             })).id,
//             category: request.body.category,
//             colorwave: request.body.colorwave,
//             discount: request.body.discount,
//             name: request.body.name,
//             wholeName: `${request.body.name} '${request.body.colorwave}'`,
//             releaseYear: request.body.release_year,
//             priceOriginal: request.body.price_original,
//             priceFinal: (100 - request.body.discount) * request.body.price_original / 100,
//             shoeCondition: request.body.shoe_condition,
//             story: request.body.story
//             // ...(imageUrls[0] && { main_picture: imageUrls[0] }),
//             // ...(imageUrls[1] && { picture1: imageUrls[1] }),
//             // ...(imageUrls[2] && { picture2: imageUrls[2] }),
//             // ...(imageUrls[3] && { picture3: imageUrls[3] }),
//             // ...(imageUrls[4] && { picture4: imageUrls[4] }),
//         }

//       const imageUrls = [];
//       if (request.files && request.files.length>0){
//         imageUrls = request.files.map(file => file.path);
//         data.main_picture = imageUrls[0];
//         data.picture1 = imageUrls[1] || null;
//         data.picture2 = imageUrls[2] || null;
//         data.picture3 = imageUrls[3] || null;
//         data.picture4 = imageUrls[4] || null;
//       }
  
//       // Iniciar una transacción
//       const [product, product_sizes] = await prisma.$transaction(async (prisma) => {
//         // Guardar el producto
//         const product = await prisma.product.update({
//             where: { id: productId },
//             data: data,
//         });
  
//         // Guardar tamaños
//         const product_sizes = await Promise.all(
//           [
//             { size: 3.0, stock: request.body.size_30 },
//             { size: 3.5, stock: request.body.size_35 },
//             { size: 4.0, stock: request.body.size_40 },
//             { size: 4.5, stock: request.body.size_45 },
//             { size: 5.0, stock: request.body.size_50 },
//             { size: 5.5, stock: request.body.size_55 },
//             { size: 6.0, stock: request.body.size_60 },
//             { size: 6.5, stock: request.body.size_65 },
//             { size: 7.0, stock: request.body.size_70 },
//             { size: 7.5, stock: request.body.size_75 },
//             { size: 8.0, stock: request.body.size_80 },
//             { size: 8.5, stock: request.body.size_85 },
//             { size: 9.0, stock: request.body.size_90 },
//             { size: 9.5, stock: request.body.size_95 },
//             { size: 10.0, stock: request.body.size_100 },
//             { size: 10.5, stock: request.body.size_105 },
//             { size: 11.0, stock: request.body.size_110 },
//             { size: 11.5, stock: request.body.size_115 },
//             { size: 12.0, stock: request.body.size_120 },
//             { size: 12.5, stock: request.body.size_125 },
//             { size: 13.0, stock: request.body.size_130 },
//             { size: 14.0, stock: request.body.size_140 },
//           ].map(async ({ size, stock }) => {
//                 return prisma.product_size.update({
//                     where: { product_id: params.id },
//                     data: {
//                         product_id: product.id,
//                         size,
//                         stock,
//                     },
//                 });
//             })
//         );
  
//         return [product, product_sizes];
//       });

//       await redis.del("products");
  
//       return NextResponse.json(
//         {
//           success: true,
//           url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/products/${product.id}`,
//           message: 'Product edited successfully.',
//           status: 201
//         },
//         { status: 201 }
//       );

//     } catch (error) {
//       if (request?.files && request.files.length>0) {
//           const deletionPromises = request.files.map(file => {
//             const publicId = getPublicIdFromUrl(file.path);
//             return cloudinary.uploader.destroy(publicId);
//           });
//           await Promise.all(deletionPromises);
//       }
  
//       return NextResponse.json(
//         {
//             success: false,
//             error: {
//                 code: 'Internal Server Error',
//                 message: 'Failed to edit product.',
//             },
//             old: body,
//             status: 500
//         },
//         { status: 500 }
//       );

//     } finally {
//       await prisma.$disconnect();
//     }
// }

