'use client';

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Category, Colors, Image, Product, Size } from "@prisma/client";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(1),
  images: z.object({url: z.string()}).array(),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  colorId: z.string().min(1),
  sizeId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
})

interface ProductFormProps {
    intialData: Product & {
      images: Image[]
    } | null;
    categories: Category[];
    colors: Colors[];
    sizes: Size[];
}


type ProductFormValues = z.infer<typeof formSchema>;


export const ProductForm: React.FC<ProductFormProps> = ({
  intialData,
  categories,
  colors,
  sizes
}: ProductFormProps) => {
  const params = useParams()
  const router = useRouter();

  const [ open, setOpen ] = useState(false) ;
  const [ loading, setLoading] = useState(false);

  const title = intialData ? "Edit Product" : 'Create Product';
  const description = intialData ? "Edit a Product" : 'Add a new Product';
  const toastMessage = intialData ? 'Product updated' : 'BillBoard Created';
  const action = intialData ? 'Save Changes' : 'Create'

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: intialData ? {
      ...intialData,
      price: parseFloat(String(intialData?.price))
    } : {
      name: "",
      images: [],
      price: 0,
      categoryId: '',
      colorId: "",
      sizeId: '',
      isFeatured: false,
      isArchived: false
    }
  })

  const onSubmit = async (data: ProductFormValues) => {
      try {
          setLoading(true);
          if (intialData) {
              await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data); 
          }else {
              await axios.post(`/api/${params.storeId}/billboards`, data)
          }
          router.refresh();
          router.push(`/${params.storeId}/billboards`)
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
       await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
       router.refresh();
       router.push(`/${params.storeId}/billboards`);
       toast.success('Billboard deleted.');
    } catch (error) {
        toast.error('Make sure you removed all categries. using this billboard first')
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
       <FormField
  control={form.control}
  name="images"
  render={({ field }) => {
    return (
      <FormItem>
        <FormLabel className="ml-1">Images</FormLabel>
        <ImageUpload
          value={field.value.map((image) => image.url)}
          disabled={loading}
          onChange={(urls) => field.onChange(urls)}
          onRemove={(url) =>
            field.onChange([
              ...field.value.filter((current) => current.url !== url),
            ])
          }
        />
        <FormMessage />
      </FormItem>
    );
  }}
/>

          </div>
          <div className="grid grid-cols-3">
            <FormField control={form.control} name='name' render={({field}) => {
               return <FormItem>
                <FormLabel className="ml-2">
                  Name
                </FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="Product Name" {...field}/>
                </FormControl>
                <FormMessage/>
               </FormItem>
            }}/>
            <FormField control={form.control} name='price' render={({field}) => {
               return <FormItem className="ml-10">
                <FormLabel className="ml-2">
                  Price
                </FormLabel>
                <FormControl>
                  <Input disabled={loading} type="number" placeholder="9.99" {...field}/>
                </FormControl>
                <FormMessage/>
               </FormItem>
            }}/>
            <br/>
          <div className="mt-5 grid grid-cols-3 w-[50vw]">
            <FormField control={form.control} name="categoryId" render={({field}) => {
               return <FormItem className="">
                <FormLabel className="">
                  Category
                </FormLabel>
                <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                   <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder='Select Category'/>
                      </SelectTrigger>
                   </FormControl>
                   <SelectContent>
                       {categories.map((categoryItem) => {
                        return <SelectItem value={categoryItem.id} key={categoryItem.id}>
                          {categoryItem.name}
                        </SelectItem>
                       })}
                   </SelectContent>
                </Select>
                <FormMessage/>
               </FormItem>
            }}/>
            <FormField control={form.control} name="sizeId" render={({field}) => {
               return <FormItem className="ml-5">
                <FormLabel className="">
                  Size
                </FormLabel>
                <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                   <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder='Select Size'/>
                      </SelectTrigger>
                   </FormControl>
                   <SelectContent>
                       {sizes.map((sizeItem) => {
                        return <SelectItem value={sizeItem.id} key={sizeItem.id}>
                          {sizeItem.name}
                        </SelectItem>
                       })}
                   </SelectContent>
                </Select>
                <FormMessage/>
               </FormItem>
            }}/>
            <FormField control={form.control} name="colorId" render={({field}) => {
               return <FormItem className="ml-5">
                <FormLabel className="">
                  Color
                </FormLabel>
                <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                   <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder='Select a Color'/>
                      </SelectTrigger>
                   </FormControl>
                   <SelectContent>
                       {colors.map((colorItem) => {
                        return <SelectItem value={colorItem.id} key={colorItem.id}>
                          {colorItem.name}
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
