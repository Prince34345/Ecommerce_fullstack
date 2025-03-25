'use client';

import { useEffect, useState } from "react"
import { Button } from "./button";
import { ImagePlus, Plus, Trash } from "lucide-react";
import Image from "next/image";
import {CldImage, CldUploadWidget} from 'next-cloudinary'
import DummyImage from "@/asset/dummy.jpg";
interface ImageUploadProps {
    disabled?:  boolean
    onChange: (value: string) => void
    onRemove: (value: string) => void
    value: string[]
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    disabled, onChange, onRemove, value
}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
       setIsMounted(true)
    }, [])
  
    const onUpload = (result: any) => {
        onChange(result?.info?.secure_url);
    }
    
    if (!isMounted) {
        return null
    }

    return (
        <div>
            <div className="mb-4 flex items-center gap-4">
                  {value.map((url) => {
                    if (!url) return null;
                    console.log("values", url)
                     return <div className="relative w-[200px] h-[200px] rounded-md overflow-hidden" key={url}>
                            <div className="z-10 absolute top-2 right-2">
                               <Button variant={'destructive'} size={'icon'} type="button" onClick={() => onRemove(url)}>
                                 <Trash className="h-4 w-4" />
                               </Button>
                            </div>
                            <Image fill alt="Image" className="object-cover" src={url}/>
                      </div>
                  })}
            </div>
            <CldUploadWidget onSuccess={onUpload} uploadPreset="q9f4szbz">
  {({ open }) => {
    return (
        <>
      <Button variant={'outline'}  onClick={() => open()}>
        <ImagePlus/>
        Upload an Image
      </Button>
      </>
    );
  }}
</CldUploadWidget>
        </div>
    )
}

export default ImageUpload