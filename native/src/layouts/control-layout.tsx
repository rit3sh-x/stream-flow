import { cn, onCloseApp } from '@/lib/utils';
import { UserButton } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import { XIcon } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export const ControlLayout = ({ children, className }: Props) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  window.ipcRenderer.on('hide-plugin', (_, payload) => {
    console.log("hello", payload.state)
    setIsVisible(payload.state);
    if (payload.state) {
      toast.dismiss();
    }
  });

  return (
    <div
      className={cn(
        className,
        isVisible && 'invisible',
        'bg-[#171717] border-2 draggable border-neutral-700 flex flex-col rounded-3xl overflow-hidden',
        'min-h-screen w-full'
      )}
    >
      <div className='flex justify-between items-center p-5 draggable'>
        <span className='non-draggable'>
          <UserButton appearance={{
            baseTheme: dark
          }} />
        </span>
        <XIcon
          size={20}
          className='text-gray-400 non-draggable cursor-pointer hover:text-white'
          onClick={onCloseApp}
        />
      </div>
      <div className='flex-1 h-0 items-center justify-center flex flex-col overflow-hidden px-1'>{children}</div>
      <div className='p-5 flex w-full'>
        <div className='flex items-center gap-x-2'>
          <img src='/logo.svg' alt='Flow' />
          <p className='text-white text-2xl'>Flow</p>
        </div>
      </div>
    </div>
  );
};