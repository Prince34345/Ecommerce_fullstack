import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
   {params} : {params: Promise<{categoryId: string}>}
) {
    const {categoryId} = await params;
    try {
          if (!categoryId) {
             return new NextResponse('Category Id is required', {status: 400})
          }

          const category = await prismadb.category.findUnique({
              where: {
                  id: categoryId,
              },
              include: {
               billboard: true
              }
           })
           return NextResponse.json(category);
    } catch (error) {
       console.log('[CATEGORY_GET]', error);
       return new NextResponse('Internal error', {status: 500})
    }
}

export async function PATCH(
    req: Request,
    {params} : {params: Promise<{storeId: string, categoryId: string}>}
) { 
     const {storeId, categoryId} = await params
     try {
           const {userId} = await auth();
           const body = await req.json()
           const {name, billboardId} = body;
           if (!userId) {
              return new NextResponse('unauthenticated', {status: 401});
           }
           if (!name) {
              return new NextResponse('Name is Required', {status: 400});
           }
           if (!billboardId) {
            return new NextResponse('BillboardID is Required', {status: 400});
           }
           if (!categoryId) {
              return new NextResponse('Category Id is required', {status: 400})
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

           const category = await prismadb.category.updateMany({
               where: {
                   id: categoryId,
               },
               data: {
                   name,
                   billboardId
               }
            })
            return NextResponse.json(category);
     } catch (error) {
        console.log('[Category_PATCH]', error);
        return new NextResponse('Internal error', {status: 500})
     }
}

export async function DELETE(
     req: Request,
    {params} : {params: Promise<{storeId: string, categoryId: string}>}
) {
     try {
           const {storeId, categoryId} = await params;
           const {userId} = await auth();
           if (!userId) {
              return new NextResponse('unauthenticated', {status: 401});
           }
           if (!categoryId) {
              return new NextResponse('Category Id is required', {status: 400})
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


           const category = await prismadb.category.deleteMany({
               where: {
                   id: categoryId,
               }
            })
            return NextResponse.json(category);
     } catch (error) {
        console.log('[CATEGORY_DELETE]', error);
        return new NextResponse('Internal error', {status: 500})
     }
}