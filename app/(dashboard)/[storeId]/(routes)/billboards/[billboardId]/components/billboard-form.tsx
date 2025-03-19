'use client';

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Billboard } from "@prisma/client";
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
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1)
})

interface BillBoardFormProps {
    intialData: Billboard | null
}


type BillBoardFormValues = z.infer<typeof formSchema>;


export const BillBoardform: React.FC<BillBoardFormProps> = ({intialData}: BillBoardFormProps) => {
  const params = useParams()
  const router = useRouter();
  const origin = useOrigin();

  const [ open, setOpen ] = useState(false) ;
  const [ loading, setLoading] = useState(false);

  const title = intialData ? "Edit Billboard" : 'Create BillBoard';
  const description = intialData ? "Edit a Billboard" : 'Add a new BillBoard';
  const toastMessage = intialData ? 'BillBoard updated' : 'BillBoard Created';
  const action = intialData ? 'Save Changes' : 'Create'

  const form = useForm<BillBoardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: intialData || {
      label: '',
      imageUrl: ''
    }
  })

  const onSubmit = async (data: BillBoardFormValues) => {
      try {
          setLoading(true);
          await axios.patch(`/api/stores/${params.storeId}`, data);
          router.refresh();
          toast.success('Store Updated');
      }catch(error) {
          toast.error('Something went wrong.');
      }finally {
          setLoading(false)
      }
  }
  const onDelete = async () => {
    try {
       setLoading(true);
       await axios.delete(`/api/stores/${params.storeId}`);
       router.refresh();
       router.push('/');
       toast.success('Store Deleted.');
    } catch (error) {
        toast.error('Make sure you removie all product and categries.')
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
           <FormField control={form.control} name='imageUrl' render={({field}) => {
               return <FormItem>
                <FormLabel className="ml-2">
                     Background Image
                </FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="Billboard label" {...field}/>
                </FormControl>
                <FormMessage/>
               </FormItem>
            }}/>
          <div className="grid grid-cols-3 m-5">
            <FormField control={form.control} name='label' render={({field}) => {
               return <FormItem>
                <FormLabel className="ml-2">
                  Name
                </FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="Billboard label" {...field}/>
                </FormControl>
                <FormMessage/>
               </FormItem>
            }}/>
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
