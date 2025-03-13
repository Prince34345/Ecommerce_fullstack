'use client'
import Link from "next/link";

import { cn } from "@/lib/utils"
import { useParams, usePathname } from "next/navigation";
import { Bolt } from "lucide-react";

export function MainNav({
    className,
    ...props
}: React.HtmlHTMLAttributes<HTMLElement>) {
    const pathname = usePathname();
    const params = useParams();
    const routes = [
        {
            Icon: Bolt, 
            href: `/${params.storeId}/settings`,
            label: 'Settings',
            active: pathname === `/${params.storeId}/settings`,

        }
    ];

    return (
        <nav className={cn('flex items-center space-x-4 lg-space-x-6', className)}>
            {
                routes.map((route) => {
                   const Icon = route.Icon
                   return <div key={route.href} className="border-b-2 pb-1 border-b-blue-300  flex items-center justify-center">
                    <Icon className="text-blue-300"/>
                    <Link className={cn(' ml-2 font-mono text-sm font-medium transition-colors hover:text-blue-400 ', route.active ? 'text-blue-400 dark:text-white' : 'text-blue-200')} key={route.href} href={route.href}>
                     <p>{route.label}</p>
                    </Link>
                    </div>
                 })
            }
        </nav>
    )
}