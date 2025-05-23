import prismadb from "@/lib/prismadb";

export const getStockCount = async (storeId: string) => {
    const StockCount = await prismadb.product.count({
        where: {
            storeId,
            isArchived: false
        }
    })
    return StockCount;
}