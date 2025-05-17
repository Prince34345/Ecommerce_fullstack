import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
   {params} : {params: Promise<{billboardId: string}>}
) {
    const id = (await params).billboardId;
    try {
          if (!id) {
             return new NextResponse('BillBoard Id is required', {status: 400})
          }

          const billboard = await prismadb.billboard.findUnique({
              where: {
                  id,
              }
           })
           return NextResponse.json(billboard);
    } catch (error) {
       console.log('[BIllBOARD_GET]', error);
       return new NextResponse('Internal error', {status: 500})
    }
}

export async function PATCH(
    req: Request,
    {params} : {params: Promise<{storeId: string, billboardId: string}>}
) {
     try {
           const billboardId = (await params).billboardId;
           const storeId = (await params).storeId;
           const {userId} = await auth();
           const body = await req.json()
           const {label, imageUrl} = body;
           if (!userId) {
              return new NextResponse('unauthenticated', {status: 401});
           }
           if (!label) {
              return new NextResponse('Label is Required', {status: 400});
           }
           if (!imageUrl) {
            return new NextResponse('Image Url is Required', {status: 400});
           }
           if (!billboardId) {
              return new NextResponse('BillBoard Id is required', {status: 400})
           }
 
           const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: billboardId,
                userId
            }
           })

           if (!storeByUserId) {
              return new NextResponse('Unauthorized', {status: 403})
           }

           const billboard = await prismadb.billboard.updateMany({
               where: {
                   id: storeId,
               },
               data: {
                   label,
                   imageUrl
               }
            })
            return NextResponse.json(billboard);
     } catch (error) {
        console.log('[BillBoard_PATCH]', error);
        return new NextResponse('Internal error', {status: 500})
     }
}

export async function DELETE(
     req: Request,
    {params} : {params: Promise<{storeId: string, billboardId: string}>}
) {
     const {storeId, billboardId} = await params;
     try {
           const {userId} = await auth();
           if (!userId) {
              return new NextResponse('unauthenticated', {status: 401});
           }
           if (!billboardId) {
              return new NextResponse('BillBoard Id is required', {status: 400})
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


           const billboard = await prismadb.billboard.deleteMany({
               where: {
                   id: billboardId,
               }
            })
            return NextResponse.json(billboard);
     } catch (error) {
        console.log('[BIllBOARD_DELETE]', error);
        return new NextResponse('Internal error', {status: 500})
     }
}