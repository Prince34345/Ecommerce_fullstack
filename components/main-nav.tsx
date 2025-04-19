'use client'
import Link from "next/link";

import { cn } from "@/lib/utils"
import { useParams, usePathname } from "next/navigation";
import { Clipboard as ClipBoardIcon, PaperclipIcon, LayoutList, Settings, SquareArrowOutUpRight, Palette }from "lucide-react";
import {motion} from 'framer-motion'


export function MainNav({
    className,
    ...props
}: React.HtmlHTMLAttributes<HTMLElement>) {
    const pathname = usePathname();
    const params = useParams();

    const routes = [
        {
            Icon: PaperclipIcon, 
            href: `/${params.storeId}`,
            label: 'Overview',
            active: pathname === `/${params.storeId}`,
        },
        {
            Icon: ClipBoardIcon, 
            href: `/${params.storeId}/billboards`,
            label: 'BillBoards',
            active: pathname.startsWith(`/${params.storeId}/billboards`),
        },
        {
            Icon: LayoutList, 
            href: `/${params.storeId}/categories`,
            label: 'Categories',
            active: pathname.startsWith(`/${params.storeId}/categories`),
        },
        {
            Icon: Palette, 
            href: `/${params.storeId}/colors`,
            label: 'Colors',
            active: pathname.startsWith(`/${params.storeId}/colors`),
        },
        {
            Icon: SquareArrowOutUpRight, 
            href: `/${params.storeId}/sizes`,
            label: 'Sizes',
            active: pathname.startsWith(`/${params.storeId}/sizes`),
        },
        {
            Icon: Settings, 
            href: `/${params.storeId}/settings`,
            label: 'Settings',
            active: pathname === `/${params.storeId}/settings`,
        },
       
    ];
    return (
        <nav className={cn('flex items-center space-x-4 lg-space-x-6', className)}>
            {
                routes.map((route) => {
                   const Icon = route.Icon
                   return <div key={route.href} className="ml-3">
                   <div  className="flex items-center justify-center">
                    <Icon className={cn("text-blue-300", route.active && "text-blue-400")}/>
                    <Link className={cn(' ml-2 font-mono text-sm font-medium transition-colors hover:text-blue-400 ', route.active ? 'text-blue-400 dark:text-white' : 'text-blue-200')} key={route.href} href={route.href}>
                     <p>{route.label}</p>
                    </Link>
                    </div>
                    <motion.div initial={{width: 0}} animate={{width: route.active ? "100%" : 0}} style={{width: "100%"}} className="h-0.5 w-full mt-[0.30rem] bg-blue-400">

                    </motion.div>
                   </div>
                 })
            }
        </nav>
    )
}