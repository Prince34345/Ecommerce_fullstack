'use client';

import {Heading} from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { OrderColumn } from './columns';

interface OrderClientProps {
  data: OrderColumn[]
}


export const OrderClient: React.FC<OrderClientProps> = ({data}) => {
    return (
        <>
          <Heading title={`Orders (${data.length})`} description='Manage Orders for your store'/>
          <Separator className='mt-4 mb-3'/>
          <DataTable searchKey='products' columns={columns} data={data}/>           
        </>
    )
}