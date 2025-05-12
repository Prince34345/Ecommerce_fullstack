'use client';

import { Button } from '@/components/ui/button';
import {Heading} from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { ApiList } from '@/components/ui/api-list';
import { OrderColumn } from './columns';

interface OrderClientProps {
  data: OrderColumn[]
}


export const OrderClient: React.FC<OrderClientProps> = ({data}) => {
    const router = useRouter();
    const params = useParams();
    return (
        <>
          <Heading title={`Orders (${data.length})`} description='Manage Orders for your store'/>
          <Separator className='mt-4 mb-3'/>
          <DataTable searchKey='products' columns={columns} data={data}/>           
        </>
    )
}