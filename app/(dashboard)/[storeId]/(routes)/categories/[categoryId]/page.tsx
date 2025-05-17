import prismadb from "@/lib/prismadb"
import { Categoryform } from "./components/category-form"

const CategoryPage = async ({
  params
}: {params: Promise<{categoryId : string, storeId: string}>}) => {
  const categoryId = (await params).categoryId
  const storeId = (await params).storeId
  const category = await prismadb.category.findUnique({
      where: {
          id:categoryId
      }    
  })

  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: storeId
    }
  })
  return (
     <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <Categoryform billboards={billboards} intialData={category}/>
        </div>
     </div>
  )
}

export default CategoryPage