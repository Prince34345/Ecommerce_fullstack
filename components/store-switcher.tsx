'use client'
import { useStoreModal } from "@/hooks/use-store-modal";
import { Store } from "@prisma/client";
import { Popover, PopoverTrigger} from "@/components/ui/popover";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "./ui/button";
import {Check, ChevronsUpDown, PlusCircle, Store as StoreIcon} from 'lucide-react';
import { cn } from "@/lib/utils";
import { PopoverContent } from "@radix-ui/react-popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PopoverTriggerProps {
    items: Store[]
}

export default function StoreSwitcher ({items = []}: StoreSwitcherProps) {
  const storeModal = useStoreModal();
  const params = useParams()
  const router = useRouter();
  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id
  }))

  const currentStore = formattedItems.find((item) => item.value === params.storeId)

  const [open, setOpen] = useState(false);

  const onSelectStore = (store: {value: string, label: string}) => {
      setOpen(true);
      router.push(`/${store.value}`)
  }

    return (
     <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="bg-blue-400" asChild>
            <Button size={'sm'} role='combobox' aria-expanded={open} aria-label="Select a store" className={cn('w-[200px] justify-between')}>
                <StoreIcon className="mr-2 h-4 w-4"/>
                {currentStore?.label}
                <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50"/>
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
            <Command>
                <CommandList>
                    <CommandInput placeholder="Search Store..."/>
                <CommandEmpty>No Store found.</CommandEmpty>
                <CommandGroup heading='Stores'>
                    {formattedItems.map((store) => {
                        return <CommandItem key={store.value} onSelect={() => onSelectStore(store)} className="text-sm">
                             <StoreIcon className="mr-2 h-4 w-4">
                             </StoreIcon>
                                {store.label}
                             <Check
                               className={cn("ml-auto h-4 w-4", currentStore?.value === store.value ? 'opacity-100' : 'opacity-0')}
                             />
                        </CommandItem>                           
                    })}
                </CommandGroup>
              </CommandList>
              <CommandSeparator />
              <CommandList>
                <CommandGroup>
                    <CommandItem onSelect={() => {setOpen(false); storeModal.onOpen()}}>
                    <PlusCircle className="mr-2 h-5 w-5"/> Create Store    
                    </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
        </PopoverContent>
     </Popover>
  )
}
