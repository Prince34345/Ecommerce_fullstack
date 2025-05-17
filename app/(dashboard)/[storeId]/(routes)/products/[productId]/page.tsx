import prismadb from "@/lib/prismadb"
import { ProductForm } from "./components/product-form"

const ProductPage = async ({
  params
}: {params: Promise<{productId : string, storeId: string}>}) => {
  const storeId = (await params).storeId
  const productId = (await params).productId

  const product = await prismadb.product.findUnique({
      where: {
          id: productId
      },
      include:{ 
        images: true
      }    
  })
  const categories = await prismadb.category.findMany({
    where: {
      storeId: storeId
    }
  })
  const sizes = await prismadb.size.findMany({
    where: {
      storeId: storeId
    }
  })
  const colors = await prismadb.colors.findMany({
    where: {
       storeId: storeId
    }
  })
  return (
     <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <ProductForm
              categories={categories}
              colors={colors}
              sizes={sizes}

              intialData={product}
            />
        </div>
     </div>
  )
}

export default ProductPage