'use client'
import Link from "next/link";

import { cn } from "@/lib/utils"
import { useParams, usePathname } from "next/navigation";


export function MainNav({
    className,
    ...props
}: React.HtmlHTMLAttributes<HTMLElement>) {
    const pathname = usePathname();
    const params = useParams();

    const routes = [
        {
            href: `/${params.storeId}`,
            label: 'Overview',
            active: pathname === `/${params.storeId}`,
        },
        {
            href: `/${params.storeId}/billboards`,
            label: 'BillBoards',
            active: pathname.startsWith(`/${params.storeId}/billboards`),
        },
        {
            href: `/${params.storeId}/categories`,
            label: 'Categories',
            active: pathname.startsWith(`/${params.storeId}/categories`),
        },
        {
            href: `/${params.storeId}/products`,
            label: 'Products',
            active: pathname.startsWith(`/${params.storeId}/products`),
        },
        {
            href: `/${params.storeId}/colors`,
            label: 'Colors',
            active: pathname.startsWith(`/${params.storeId}/colors`),
        },
        {
            href: `/${params.storeId}/sizes`,
            label: 'Sizes',
            active: pathname.startsWith(`/${params.storeId}/sizes`),
        },
        {
            href: `/${params.storeId}/orders`,
            label: 'Orders',
            active: pathname.startsWith(`/${params.storeId}/orders`),
        },
        {
            href: `/${params.storeId}/settings`,
            label: 'Settings',
            active: pathname === `/${params.storeId}/settings`,
        },
       
    ];
    return (
        <nav className={cn('flex items-center space-x-4 lg-space-x-6', className)}>
            {
                routes.map((route) => {
               return <div key={route.href} className="ml-2">
                   <div  className="flex items-center justify-center">
                    <Link className={cn(' ml-2 font-mono text-sm font-medium transition-colors hover:text-blue-400 ', route.active ? 'text-blue-400 dark:text-white' : 'text-blue-200')} key={route.href} href={route.href}>
                     <p>{route.label}</p>
                    </Link>
                    </div>
                   </div>
                 })
            }
        </nav>
    )
}