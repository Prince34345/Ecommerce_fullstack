import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
   {params} : {params: Promise<{colorId: string}>}
) {
    const {colorId} = await params;
    try {
          if (!colorId) {
             return new NextResponse('Color Id is required', {status: 400})
          }

          const color = await prismadb.colors.findUnique({
              where: {
                  id: colorId,
              }
           })
           return NextResponse.json(color);
    } catch (error) {
       console.log('[COLOR_GET]', error);
       return new NextResponse('Internal error', {status: 500})
    }
}

export async function PATCH(
    req: Request,
    {params} : {params: Promise<{storeId: string, colorId: string}>}
) {
     try {
           const storeId = (await params).storeId;
           const colorId = (await params).colorId;
           const {userId} = await auth();
           const body = await req.json()
           const {name, value} = body;
           if (!userId) {
              return new NextResponse('unauthenticated', {status: 401});
           }
           if (!name) {
              return new NextResponse('Name is Required', {status: 400});
           }
           if (!value) {
            return new NextResponse('Value is Required', {status: 400});
           }
           if (!colorId) {
              return new NextResponse('Color Id is required', {status: 400})
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

           const color = await prismadb.colors.updateMany({
               where: {
                   id: colorId,
               },
               data: {
                   name,
                   value
               }
            })
            return NextResponse.json(color);
     } catch (error) {
        console.log('[Color_PATCH]', error);
        return new NextResponse('Internal error', {status: 500})
     }
}

export async function DELETE(
     req: Request,
    {params} : {params: Promise<{storeId: string, colorId: string}>}
) {
    const {storeId, colorId} = await params;
     try {
           const {userId} = await auth();
           if (!userId) {
              return new NextResponse('unauthenticated', {status: 401});
           }
           if (colorId) {
              return new NextResponse('Color Id is required', {status: 400})
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


           const color = await prismadb.colors.deleteMany({
               where: {
                   id:colorId,
               }
            })
            return NextResponse.json(color);
     } catch (error) {
        console.log('[COLOR_DELETE]', error);
        return new NextResponse('Internal error', {status: 500})
     }
}