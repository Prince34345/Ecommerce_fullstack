import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface SettingsProps {
    params: {
        storeId: string
    }
}
const SettingsPage: React.FC<SettingsProps> = async ({params}) => {
   
   const {userId} = await auth();
   if (!userId) {
       redirect('/sign-in')
   }

   const store = await prismadb.store.findFirst({
      where: {
        id: params.storeId
      }
   })

   if (!store) {
       redirect('/')
   }
  return (
    <div className="flex-col">
        <div className="flex-1 space-x-4">

        </div>
    </div>
  )
}

export default SettingsPage