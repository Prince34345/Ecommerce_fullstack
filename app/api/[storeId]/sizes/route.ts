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
           const { name, value} = body;
           if (!userId) {
              return new NextResponse('unauthenticated', {status: 401});
           }
           if (!name) {
              return new NextResponse('Name is Required', {status: 400});
           }
           if (!value) {
              return new NextResponse('Image URL is Required', {status: 400});
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
           const sizes = await prismadb.size.create({
               data: {
                   name,
                   value,
                   storeId: id
               }
            })
            return NextResponse.json(sizes);
     } catch (error) {
        console.log('[SIZES_POST]', error);
        return new NextResponse('Internal error', {status: 500})
     }
}

export async function GET(
     req: Request,
    {params} : {params: Promise<{storeId: string}>}
) {
    const id = (await params).storeId;
     try {
           if (!id) {
              return new NextResponse('Store Id is required', {status: 400})
           }

           const sizes = await prismadb.size.findMany({
               where: {
                  storeId: id
               }
            })
            return NextResponse.json(sizes);
     } catch (error) {
        console.log('[SIZES_GET]', error);
        return new NextResponse('Internal error', {status: 500})
     }
}