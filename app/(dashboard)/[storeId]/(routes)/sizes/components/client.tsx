'use client';

import { Button } from '@/components/ui/button';
import {Heading} from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { SizeColumn, columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { ApiList } from '@/components/ui/api-list';

interface SizeClientProps {
  data: SizeColumn[]
}

export const SizesClient: React.FC<SizeClientProps> = ({data}) => {
    const router = useRouter();
    const params = useParams();
    return (
        <>
          <div className="flex items-center justify-between">
          <Heading title={`Sizes (${data.length})`} description='Manage sizes for your store'/>
          <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}  className='p-3 bg-blue-400'>
               <Plus className='mr-2 h-4 w-4'/>
               Add new
          </Button>
          </div>
          <Separator className='mt-4 mb-3'/>
          <DataTable searchKey='name' columns={columns} data={data}/>
          <Heading title='API' description='API calls for Sizes.'/>
          <Separator className='mt-4'/>
          <ApiList entityName='Sizes' entityIdName='sizeId'/>
           
        </>
    )
}