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
           const { name, billboardId } = body;
           if (!userId) {
              return new NextResponse('unauthenticated', {status: 401});
           }
           if (!name) {
              return new NextResponse('Name is Required', {status: 400});
           }
           if (!billboardId) {
              return new NextResponse('Billboard is Required', {status: 400});
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
           const category = await prismadb.category.create({
               data: {
                   name,
                   billboardId,
                   storeId: id
               }
            })
            return NextResponse.json(category);
     } catch (error) {
        console.log('[CATEGORY_POST]', error);
        return new NextResponse('Internal error', {status: 500})
     }
}

export async function GET(
     req: Request,
    {params} : {params: Promise<{storeId: string}>}
) {
     try {
           const id = (await params).storeId;
           if (!id) {
              return new NextResponse('Store Id is required', {status: 400})
           }

           const categories = await prismadb.category.findMany({
               where: {
                  storeId: id
               }
            })
            return NextResponse.json(categories);
     } catch (error) {
        console.log('[CATEGORIES_GET]', error);
        return new NextResponse('Internal error', {status: 500})
     }
}