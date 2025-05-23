import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    {params} : {params: Promise<{storeId: string}>}
) {
     try {
           const id = (await params).storeId;
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
          
           if (!id) {
              return new NextResponse('Store ID is required', {status: 400})
           }

           const storeByUserId = await prismadb.store.findFirst({
            where: {
                id,
                userId
            }
           })

           if (!storeByUserId) {
              return new NextResponse('Unauthorized', {status: 403});
           }
           const product = await prismadb.product.create({
               data: {
                   name,
                   price,
                   isArchived,
                   isFeatured,
                   categoryId,
                   colorId,
                   sizeId,
                   storeId: id,
                   images: {
                     createMany:  {
                        data: [...images.map((image : {url: string}) => image)]
                     }
                   }
               }
            })
            return NextResponse.json(product);
     } catch (error) {
        console.log('[BILLBOARD_POST]', error);
        return new NextResponse('Internal error', {status: 500})
     }
}

export async function GET(
     req: Request,
    {params} : {params: Promise<{storeId: string}>}
) {
     try {
           const id = (await params).storeId;
           const {searchParams} = new URL(req.url);
           const categoryId = searchParams.get('categoryId') || undefined;
           const sizeId = searchParams.get('sizeId') || undefined;
           const colorId = searchParams.get('colorId') || undefined;
           const isFeatured = searchParams.get("isFeatured");

           if (!id) {
              return new NextResponse('Store Id is required', {status: 400})
           }

           const products = await prismadb.product.findMany({
               where: {
                  storeId: id,
                  categoryId,
                  colorId,
                  sizeId,
                  isFeatured: isFeatured ? true : undefined,
               },
               include: {
                  images: true,
                  category: true,
                  color: true,
                  size: true
               },
               orderBy: {
                  createdAt: "desc"
               }
            })
            console.log(products)
            return NextResponse.json(products);
     } catch (error) {
        console.log('[PRODUCTS_GET]', error);
        return new NextResponse('Internal error', {status: 500})
     }
}