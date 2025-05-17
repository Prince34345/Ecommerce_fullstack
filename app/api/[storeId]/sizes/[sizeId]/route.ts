import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
   {params} : {params: Promise<{sizeId: string}>}
) {
   const id = (await params).sizeId;
    try {
          if (!id) {
             return new NextResponse('Size Id is required', {status: 400})
          }

          const size = await prismadb.size.findUnique({
              where: {
                  id,
              }
           })
           return NextResponse.json(size);
    } catch (error) {
       console.log('[SIZE_GET]', error);
       return new NextResponse('Internal error', {status: 500})
    }
}

export async function PATCH(
    req: Request,
    {params} : {params: Promise<{storeId: string, sizeId: string}>}
) {
     try {
           const storeId = (await params).storeId;
           const sizeId = (await params).sizeId;
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
           if (!sizeId) {
              return new NextResponse('Size Id is required', {status: 400})
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

           const size = await prismadb.size.updateMany({
               where: {
                   id: sizeId,
               },
               data: {
                   name,
                   value
               }
            })
            return NextResponse.json(size);
     } catch (error) {
        console.log('[Size_PATCH]', error);
        return new NextResponse('Internal error', {status: 500})
     }
}

export async function DELETE(
     req: Request,
    {params} : {params: Promise<{storeId: string, sizeId: string}>}
) {
     try {
           const storeId = (await params).storeId;
           const sizeId = (await params).sizeId;
           const {userId} = await auth();
           if (!userId) {
              return new NextResponse('unauthenticated', {status: 401});
           }
           if (!sizeId) {
              return new NextResponse('Size Id is required', {status: 400})
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


           const size = await prismadb.size.deleteMany({
               where: {
                   id: sizeId,
               }
            })
            return NextResponse.json(size);
     } catch (error) {
        console.log('[SIZE_DELETE]', error);
        return new NextResponse('Internal error', {status: 500})
     }
}