import prismadb from "@/lib/prismadb";
import { ColorsClient } from "./components/client";
import { ColorColumn } from "./components/columns";
import {format} from 'date-fns'


const ColorsPage = async ({
    params
}:  { params: Promise<{storeId: string}> }) => {
    const id = (await params).storeId
    const color = await prismadb.colors.findMany({
        where: {
            storeId: id
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    const formattedColor: ColorColumn[] = color.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, 'MMMM do, yyyy')
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-x-4 p-8 pt-6">
               <ColorsClient data={formattedColor}/>  
            </div>
        </div>
    )
}

export default ColorsPage;