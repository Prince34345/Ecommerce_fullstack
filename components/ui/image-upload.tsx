'use client';

import { useCallback } from "react";
import { Button } from "./button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget, CloudinaryUploadWidgetInfo, CloudinaryUploadWidgetResults} from 'next-cloudinary';

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: { url: string }[]) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled, onChange, onRemove, value
}) => {
  const handleUploadComplete = useCallback((results: CloudinaryUploadWidgetResults) => {
    if (typeof results.info === 'object' && results.info !== null && 'files' in results.info) {
      const files = (results.info as CloudinaryUploadWidgetInfo).files as Array<{ uploadInfo: { secure_url: string }}>
      const uploadedUrls = files?.map((file: { uploadInfo: { secure_url: string; }; }) => file.uploadInfo.secure_url) || [];

      const merged = Array.from(new Set([...value, ...uploadedUrls]));
      const imageObjects = merged.map(url => ({ url }));
      onChange(imageObjects);
    }
  }, [value, onChange]);

  console.log("values", value)

  return (
    <div>
      <div className="mb-4 flex items-center gap-4 flex-wrap">
        {value.map((url) => (
          <div className="relative w-[200px] h-[200px] rounded-md overflow-hidden" key={url}>
            <div className="z-10 absolute top-2 right-2">
              <Button variant={'destructive'} size={'icon'} type="button" onClick={() => onRemove(url)}>
                <Trash className="h-4 w-4" />
              </Button>
            </div>
           {typeof url == "string" && url.trim() !== "" && (<Image src={url} fill alt="Image" className="object-cover" />)}
          </div>
        ))}
      </div>
      <CldUploadWidget options={{ multiple: true }} onQueuesEnd={handleUploadComplete} uploadPreset="q9f4szbz">
        {({ open }) => (
          <Button variant={'outline'} onClick={() => open()} disabled={disabled}>
            <ImagePlus />
            Upload an Image
          </Button>
        )}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
