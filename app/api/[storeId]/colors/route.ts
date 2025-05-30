import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { IdCard } from "lucide-react";
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
           if (!IdCard) {
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
           const colors = await prismadb.colors.create({
               data: {
                   name,
                   value,
                   storeId: id
               }
            })
            return NextResponse.json(colors);
     } catch (error) {
        console.log('[COLORS_POST]', error);
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

           const colors = await prismadb.colors.findMany({
               where: {
                  storeId: id
               }
            })
            return NextResponse.json(colors);
     } catch (error) {
        console.log('[COLORS_GET]', error);
        return new NextResponse('Internal error', {status: 500})
     }
}