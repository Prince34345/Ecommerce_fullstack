import prismadb from "@/lib/prismadb";
import { OrderClient } from "./components/client";
import { OrderColumn } from "./components/columns";
import {format} from 'date-fns'
import { formatter } from "@/lib/utils";


const OrderPage = async ({
    params
}:  { params: Promise<{storeId: string}>}) => {
    const id = (await params).storeId
    const orders = await prismadb.order.findMany({
        where: {
            storeId: id
        },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    const formattedOrders: OrderColumn[] = orders.map((item) => ({
        id: item.id,
        phone: item.phone,
        address: item.address,
        products: item.orderItems.map((orderItem) => orderItem.product.name).join(", "),
        totalPrice: formatter.format(item.orderItems.reduce((total, item) => {
            return total + Number(item.product.price)
        }, 0)),
        isPaid: item.isPaid,
        createdAt: format(item.createdAt, 'MMMM do, yyyy')
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-x-4 p-8 pt-6">
               <OrderClient data={formattedOrders}/>  
            </div>
        </div>
    )
}

export default OrderPage;