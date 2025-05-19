import Navbar from "@/components/navbar";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
    params
}: {
    children: React.ReactNode,
    params: Promise<{storeId: string}>
}) {
    const {userId} = await auth();
    if (!userId) {
        redirect('/sign-in')
    }
    const id = (await params).storeId; 
    const store = await prismadb.store.findFirst({
        where: {
            id,
            userId
        }
    })

    if (!store) {
        redirect('/')
    }
    return (
        <>
          <div className="">
              <Navbar/>
              {children}
          </div>
        </>
    )

}