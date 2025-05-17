import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
   {params} : {params: Promise<{productId: string}>}
) {
    try {
          const id = (await params).productId;
          if (!id) {
             return new NextResponse('Product Id is required', {status: 400})
          }

          const product = await prismadb.product.findUnique({
              where: {
                  id,
              },
              include: {
                 images: true,
                 category: true,
                 size: true,
                 color: true
              }
           })
           return NextResponse.json(product);
    } catch (error) {
       console.log('[Product_GET]', error);
       return new NextResponse('Internal error', {status: 500})
    }
}

export async function PATCH(
    req: Request,
    {params} : {params: Promise<{storeId: string, productId: string}>}
) {
     const {storeId, productId} = await params;
     try {
           const {userId} = await auth();
           const body = await req.json()
           const { 
            name,
            price,
            categoryId,
            colorId,
            sizeId,
            images,
            isFeatured,
            isArchived
        } = body;
            if (!userId) {
            return new NextResponse('unauthenticated', {status: 401});
            }
            if (!name) {
            return new NextResponse('Name is Required', {status: 400});
            }
            if (!price) {
             return new NextResponse('Name is Required', {status: 400});
            }
            if (!images || !images.length) {
             return new NextResponse('Images is Required', {status: 400});
            }
            if (!categoryId) {
             return new NextResponse('Name is Required', {status: 400});
            }
            if (!colorId) {
             return new NextResponse('Name is Required', {status: 400});
            }
            if (!sizeId) {
             return new NextResponse('Name is Required', {status: 400});
            }
           
           if (!productId) {
              return new NextResponse('Product Id is required', {status: 400})
           }
 
           const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: storeId,
                userId
            }
           })

           if (!storeByUserId) {
              return new NextResponse('Unauthorized', {status: 403})
           }

           await prismadb.product.update({
               where: {
                   id: productId,
               },
               data: {
                  name,
                  price,
                  categoryId,
                  colorId,
                  sizeId,
                  isArchived,
                  isFeatured,              
                  images: {
                     deleteMany: {

                     }
                  }
               }
            })
            const product = await prismadb.product.update({
               where: {
                  id: productId
               },
               data: {
                  images: {
                     createMany: {
                        data: [...images.map((image: {url: string}) => image)]
                     }
                  }
               }
            })
            return NextResponse.json(product);
     } catch (error) {
        console.log('[PRODUCT_PATCH]', error);
        return new NextResponse('Internal error', {status: 500})
     }
}

export async function DELETE(
     req: Request,
    {params} : {params: Promise<{storeId: string, productId: string}>}
) {
    const {productId, storeId} = await params;
     try {
           const {userId} = await auth();
           if (!userId) {
              return new NextResponse('unauthenticated', {status: 401});
           }
           if (!productId) {
              return new NextResponse('Product Id is required', {status: 400})
           }

           const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: storeId,
                userId
            }
           })

           if (!storeByUserId) {
              return new NextResponse('Unauthorized', {status: 403})
           }


           const product = await prismadb.product.deleteMany({
               where: {
                   id: productId
               }
            })
            return NextResponse.json(product);
     } catch (error) {
        console.log('[Product_DELETE]', error);
        return new NextResponse('Internal error', {status: 500})
     }
}