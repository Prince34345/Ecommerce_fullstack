import { UserButton } from "@clerk/nextjs";
import { MainNav } from "@/components/main-nav";
import StoreSwitcher from "./store-switcher";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

const Navbar = async () => {
   
   const {userId} = await auth();

   if (!userId) {
       redirect('/sign-in')
   }
   const stores = await prismadb.store.findMany({
    where: {
        userId
    }
   })

  return (
    <nav className="relative top-0 left-0 right-0 bottom-0 w-full z-50 bg-[rgba(0,0,0,.8)] backdrop-blur-lg bg-opacity-30 shadow-lg px-8 py-4 flex justify-between items-center">

      <StoreSwitcher items={stores}/>
      <MainNav className="mx-6"/>
      <div className="ml-auto flex right-10 border-2 rounded-4xl ">
          <UserButton/>
      </div>
    </nav>
  );
};

export default Navbar;