import prismadb from "@/lib/prismadb"
import { ColorForm } from "./components/color-form"

const ColorPage = async ({
  params
}: {params: Promise<{colorId : string}>}) => {
  const id = (await params).colorId
  const color = await prismadb.colors.findUnique({
      where: {
          id
      }    
  })
  return (
     <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <ColorForm intialData={color}/>
        </div>
     </div>
  )
}

export default ColorPage