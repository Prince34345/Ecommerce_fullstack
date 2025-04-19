'use client';

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Size } from "@prisma/client";
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
import { useOrigin } from "@/hooks/use-origin";
import ImageUpload from "@/components/ui/image-upload";

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(4).regex(/^#/, {
    message: 'String must be valid hex code.'
  })
})

interface ColorFormProps {
    intialData: Size | null
}


type ColorFormValues = z.infer<typeof formSchema>;


export const ColorForm: React.FC<ColorFormProps> = ({intialData}: ColorFormProps) => {
  const params = useParams()
  const router = useRouter();
  const origin = useOrigin();

  const [ open, setOpen ] = useState(false) ;
  const [ loading, setLoading] = useState(false);

  const title = intialData ? "Edit Color" : 'Create Color';
  const description = intialData ? "Edit a Color" : 'Add a new Color';
  const toastMessage = intialData ? 'Color updated' : 'Color Created';
  const action = intialData ? 'Save Changes' : 'Create'

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: intialData || {
      name: '',
      value: ''
    }
  })

  const onSubmit = async (data: ColorFormValues) => {
      try {
          setLoading(true);
          if (intialData) {
              await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, data); 
          }else {
              await axios.post(`/api/${params.storeId}/colors`, data)
          }
          router.refresh();
          router.push(`/${params.storeId}/colors`)
          toast.success(toastMessage);
      }catch(error) {
          toast.error('Something went wrong');
          console.log(error);
      }finally {
          setLoading(false)
      }
  }
  const onDelete = async () => {
    try {
       setLoading(true);
       await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
       router.refresh();
       router.push(`/${params.storeId}/colors`);
       toast.success('Color deleted.');
    } catch (error) {
        toast.error('Make sure you removed all product using this color first')
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
            <FormField control={form.control} name='name' render={({field}) => {
               return <FormItem>
                <FormLabel className="ml-2">
                  Color
                </FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="Color Name" {...field}/>
                </FormControl>
                <FormMessage/>
               </FormItem>
            }}/>
             <FormField control={form.control} name='value' render={({field}) => {
               return <FormItem className="ml-5">
                <FormLabel className="ml-2">
                  Value
                </FormLabel>
                <FormControl>
                  <div className="flex items-center gap-x-2">
                  <Input disabled={loading} placeholder="Color Value" {...field}/>
                  <div className="border p-4 rounded-full" style={{backgroundColor: field.value}}/>
                  </div>
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
