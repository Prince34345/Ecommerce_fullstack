'use client';

import { useEffect, useState } from "react"
import { Button } from "./button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import {CldUploadWidget} from 'next-cloudinary'

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
        onChange(result.info.secure_url);
    }
    
    if (!isMounted) {
        return null
    }
 
  

    return (
        <div>
            <div className="mb-4 flex items-center gap-4">
                  {value.map((url) => {
                     return <div className="relative-w-[200px] h-[200px] rounded-md overflow-hidden" key={url}>
                            <div className="z-10 absolute top-2 right-2">
                               <Button variant={'destructive'} size={'icon'} type="button" onClick={() => onRemove(url)}>
                                 <Trash className="h-4 w-4" />
                               </Button>
                               <Image fill className="object-cover" alt="Image" src={url}/>
                            </div>
                      </div>
                  })}
            </div>
            <CldUploadWidget onSuccess={onUpload} uploadPreset="opskdck">
               {({open}) =>  {
                   const onClick = () => {
                      open()
                   }
                   return (
                    <Button onClick={onClick}  type='button' disabled={disabled} variant='secondary' >
                        <ImagePlus className="h-4 w-4 mr-2"/>
                    </Button>
                   )
               }}
            </CldUploadWidget>
        </div>
    )
}

export default ImageUpload