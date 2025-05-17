import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {Settingsform} from './components/settings-form'
interface SettingsProps {
    params: Promise<{
        storeId: string;
    }>
}
const SettingsPage: React.FC<SettingsProps> = async ({params}) => {
   
   const {userId} = await auth();
   if (!userId) {
       redirect('/sign-in')
   }
   const id = (await params).storeId
   const store = await prismadb.store.findFirst({
      where: {
        id: id
      }
   })

   if (!store) {
       redirect('/')
   }
  return (
    <div className="flex-col">
        <div className="flex-1 space-x-4 p-8 pt-6">
           <Settingsform intialData={store}/>
        </div>
    </div>
  )
}

export default SettingsPage