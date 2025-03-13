import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";
import { useEffect, useState } from "react"

export default async function DashboardLayout({
    children,
    params
}: {
    children: React.ReactNode,
    params: {storeId: string}
}) {
    const {userId} = await auth();
    if (!userId) {
        redirect('/sign-in')
    }

    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
            userId
        }
    })

    if (!store) {
        redirect('/')
    }
    return (
        <>
          <div>
              this will be navbar;
              {children}
          </div>
        </>
    )

}