import prismadb from "@/lib/prismadb";
import { BillBoardClient } from "./components/client";
import { BillBoardColumn } from "./components/columns";
import {format} from 'date-fns'


const BillboardPage = async ({
    params
}:  { params: Promise<{storeId: string}>}) => {
    const id = (await params).storeId
    const billboards = await prismadb.billboard.findMany({
        where: {
            storeId: id
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    const formattedBillBoards: BillBoardColumn[] = billboards.map((item) => ({
        id: item.id,
        label: item.label,
        createdAt: format(item.createdAt, 'MMMM do, yyyy')
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-x-4 p-8 pt-6">
               <BillBoardClient data={formattedBillBoards}/>  
            </div>
        </div>
    )
}

export default BillboardPage;