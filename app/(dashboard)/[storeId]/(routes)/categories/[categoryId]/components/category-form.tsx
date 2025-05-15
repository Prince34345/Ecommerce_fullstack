'use client';

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Billboard, Category } from "@prisma/client";
import { Trash } from "lucide-react";
import {Separator} from '@/components/ui/separator'
import * as z from 'zod';
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import { Select, SelectContent, SelectValue, SelectTrigger, SelectItem } from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(1),
  billboardId: z.string().min(1)
})

interface CategoryFormProps {
    intialData: Category | null
    billboards: Billboard[]
}


type CategoryFormValues = z.infer<typeof formSchema>;


export const Categoryform: React.FC<CategoryFormProps> = ({intialData, billboards}: CategoryFormProps) => {
  const params = useParams()
  const router = useRouter();

  const [ open, setOpen ] = useState(false) ;
  const [ loading, setLoading] = useState(false);

  const title = intialData ? "Edit Category" : 'Create Category';
  const description = intialData ? "Edit a Category" : 'Add new Category';
  const toastMessage = intialData ? 'Category updated' : 'Category Created';
  const action = intialData ? 'Save Changes' : 'Create'

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: intialData || {
     name: '',
     billboardId: ''
    }
  })

  const onSubmit = async (data: CategoryFormValues) => {
      try {
          setLoading(true);
          if (intialData) {
              await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data); 
          }else {
              await axios.post(`/api/${params.storeId}/categories`, data)
          }
          router.refresh();
          router.push(`/${params.storeId}/categories`)
          toast.success(toastMessage);
      }catch(error) {
          toast.error('Smoething went wrong');
          console.log(error);
      }finally {
          setLoading(false)
      }
  }
  const onDelete = async () => {
    try {
       setLoading(true);
       await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`);
       router.refresh();
       router.push(`/${params.storeId}/categories`);
       toast.success('Category deleted.');
    } catch (error) {
        console.log(error)
        toast.error('Make sure you removed all categries using this category first'); 
    } finally {
       setLoading(false);
       setOpen(false)
    }
  }

  return (
    <>
    <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading}/>
    <div className="flex items-center justify-between">
       <Heading title={title} description={description}/>
      {intialData &&
       <Button variant={'destructive'} size='icon' onClick={() => setOpen(true)}>
        <Trash className="h-4 w-4"/>
       </Button> }
    </div>
    <Separator className="mt-3"/>
    <Form {...form} >
       <form className="space-y-8 w-full" onSubmit={form.handleSubmit(onSubmit)}>
       <div className="grid grid-cols-3 m-5">  
          </div>
          <div className="grid grid-cols-3 grid-rows-4 m-5">
            <FormField control={form.control} name='name' render={({field}) => {
               return <FormItem>
                <FormLabel className="ml-2">
                  Name
                </FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="Category name" {...field} />
                </FormControl>
                <FormMessage/>
               </FormItem>
            }}/>
            <div className="ml-5">
            <FormField control={form.control} name="billboardId" render={({field}) => {
               return <FormItem >
                <FormLabel className="ml-2">
                   Billboard
                </FormLabel>
                <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                   <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder='Select BillBoard'/>
                      </SelectTrigger>
                   </FormControl>
                   <SelectContent>
                       {billboards.map((billboardItem) => {
                        return <SelectItem value={billboardItem.id} key={billboardItem.id}>
                          {billboardItem.label}
                        </SelectItem>
                       })}
                   </SelectContent>
                </Select>
                <FormMessage/>
               </FormItem>
            }}/>
            </div>
          </div>
          <Button type="submit" className="ml-auto bg-blue-400" >
            {action}
          </Button>
       </form>
    </Form>
    <Separator className="my-5"/>
    </>
  )
}
