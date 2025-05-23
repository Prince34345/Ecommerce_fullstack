import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    {params} : {params: Promise<{storeId: string}>}
) {
     const id = (await params).storeId;
     try {
           const {userId} = await auth();
           const body = await req.json()
           const {name} = body;
           if (!userId) {
              return new NextResponse('unauthenticated', {status: 401});
           }
           if (!name) {
              return new NextResponse('Name is Required', {status: 400});
           }
           if (!id) {
              return new NextResponse('Store Id is required', {status: 400})
           }

           const store = await prismadb.store.updateMany({
               where: {
                   id,
                   userId
               },
               data: {
                   name
               }
            })
            return NextResponse.json(store);
     } catch (error) {
        console.log('[STORE_PATCH]', error);
        return new NextResponse('Internal error', {status: 500})
     }
}

export async function DELETE(
     req: Request,
    {params} : {params: Promise<{storeId: string}>}
) {
     const id = (await params).storeId;
     try {
           const {userId} = await auth();
           if (!userId) {
              return new NextResponse('unauthenticated', {status: 401});
           }
           if (!id) {
              return new NextResponse('Store Id is required', {status: 400})
           }

           const store = await prismadb.store.deleteMany({
               where: {
                   id: id,
                   userId
               }
            })
            return NextResponse.json(store);
     } catch (error) {
        console.log('[STORE_DELETE]', error);
        return new NextResponse('Internal error', {status: 500})
     }
}