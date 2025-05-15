import prismadb from "@/lib/prismadb";

interface GraphData {
    name:string;
    total: number
}

export const getGraphRevenue = async (storeId: string) => {
    const paidOrders = await prismadb.order.findMany({
        where: {
            storeId,
            isPaid: true,
        },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            }
        }
    })
    const monthlyRevneue : {[key: number]: number} = {};
    for (const order of paidOrders) {
        const month = order.createdAt.getMonth();
        let revenueforOrder = 0;
        for (const item of order.orderItems) {
            revenueforOrder += item.product.price.toNumber()
        }

        monthlyRevneue[month] = (monthlyRevneue[month] || 0) + revenueforOrder
    }

    const graphData: GraphData[] = [
        {name: "JAN", total: 0},
        {name: "FEB", total: 0},
        {name: "MAR", total: 0},
        {name: "APR", total: 0},
        {name: "MAY", total: 0},
        {name: "JUN", total: 0},
        {name: "JUL", total: 0},
        {name: "AUG", total: 0},
        {name: "SEP", total: 0},
        {name: "OCT", total: 0},
        {name: "NOV", total: 0},
        {name: "DEC", total: 0},
    ];

    for (const month in monthlyRevneue) {
        graphData[parseInt(month)].total = monthlyRevneue[parseInt(month)];
    }

    return graphData;

}