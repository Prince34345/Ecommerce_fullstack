'use client';

import { Button } from '@/components/ui/button';
import {Heading} from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { BillBoardColumn, columns } from './columns';
import { DataTable } from '@/components/ui/data-table';

interface BillBoardClientProps {
  data: BillBoardColumn[]
}

export const BillBoardClient: React.FC<BillBoardClientProps> = ({data}) => {
    const router = useRouter();
    const params = useParams();
    return (
        <>
          <div className="flex items-center justify-between">
          <Heading title={`Billboards (${data.length})`} description='Manage billboards for your store'/>
          <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)}  className='p-3 bg-blue-400'>
               <Plus className='mr-2 h-4 w-4'/>
               Add new
          </Button>
          </div>
          <Separator className='mt-4 mb-3'/>
          <DataTable  columns={columns} data={data}/>
        </>
    )
}