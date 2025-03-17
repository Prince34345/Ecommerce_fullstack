'use client';

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "../ui/button";

interface AlertModalProps {
    isOpen: boolean,
    onClose: () => void,
    onConfirm: () => void,
    loading: boolean
}

export const AlertModal: React.FC<AlertModalProps> = ({isOpen, onClose, onConfirm, loading}) => {
   const [isMounted, setIsMounted] = useState(false);

   useEffect(() => {
      setIsMounted(true);
   }, [])

   if (!isMounted) {
       return null
   }

   return (
      <Modal title="Are You Sure?" description="This Action cannot be undone." isOpen={isOpen} onClose={onClose}>
          <div className="pt-6 space-x-2 flex items-center justify-center w-full">
              <Button onClick={onClose} disabled={loading} variant={'destructive'} className="p-5">
                  Cancel
              </Button>
              <Button onClick={onConfirm} disabled={loading} className="p-5 bg-blue-400">
                  Continue
              </Button>
          </div>
      </Modal>
   ) 
}