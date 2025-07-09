import { SourceDeviceStateProps } from '@/hooks/use-media-sources';
import { useStudioSettings } from '@/hooks/use-studio-settings';
import { Loader } from './loader';
import { Headphones, Monitor, Settings2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Props = {
  state: SourceDeviceStateProps;
  user: {
    userProfile: {
      id: string;
      email: string;
      firstname: string;
      lastname: string;
      createdAt: Date;
      clerkid: string;
      image: string;
      trial: boolean;
      firstView: boolean;
      plan: 'PRO' | 'FREE';
      studio: {
        id: string;
        screen: string;
        mic: string;
        camera: string | null;
        preset: 'HD' | 'SD';
        userId: string;
      };
    };
    hasPro: boolean;
  } | null;
};

export const MediaConfiguration = ({ state, user }: Props) => {
  const { isPending, onPreset, setValue, watch } = useStudioSettings(
    user!.userProfile.id,
    user?.userProfile.studio?.screen || state.displays?.[0]?.id,
    user?.userProfile.studio?.mic || state.audioInputs?.[0]?.deviceId,
    user?.userProfile.studio?.preset,
    user?.userProfile.plan
  );

  const watchedValues = watch();

  return (
    <form className='flex flex-col h-full w-full relative gap-y-5 non-draggable'>
      {isPending && (
        <div className='fixed z-50 w-full top-0 left-0 right-0 bottom-0 rounded-2xl h-full bg-black/80 flex justify-center items-center'>
          <Loader />
        </div>
      )}
      <div className='flex gap-x-5 justify-center items-center non-draggable'>
        <Monitor color='#575655' size={36} />
        <Select
          value={watchedValues.screen || user?.userProfile.studio?.screen || state.displays?.[0]?.id}
          onValueChange={(value) => setValue('screen', value)}
        >
          <SelectTrigger className='outline-none cursor-pointer px-5 py-2 rounded-xl border-2 text-white border-[#575655] bg-transparent w-full non-draggable overflow-hidden'>
            <SelectValue placeholder="Select a display" className='truncate' />
          </SelectTrigger>
          <SelectContent className='bg-[#171717] border-[#575655] non-draggable max-w-sm'>
            {state.displays?.map((display, key) => (
              <SelectItem
                key={key}
                value={display.id}
                className='text-white cursor-pointer hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] data-[highlighted]:bg-[#2a2a2a] data-[highlighted]:text-white data-[state=checked]:text-white non-draggable truncate'
              >
                <span className='truncate'>{display.name}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className='flex gap-x-5 justify-center items-center non-draggable'>
        <Headphones color='#575655' size={36} />
        <Select
          value={watchedValues.audio || user?.userProfile.studio?.mic || state.audioInputs?.[0]?.deviceId}
          onValueChange={(value) => setValue('audio', value)}
        >
          <SelectTrigger className='outline-none cursor-pointer px-5 py-2 rounded-xl border-2 text-white border-[#575655] bg-transparent w-full non-draggable overflow-hidden'>
            <SelectValue placeholder="Select an audio input" className='truncate' />
          </SelectTrigger>
          <SelectContent className='bg-[#171717] border-[#575655] non-draggable max-w-sm'>
            {state.audioInputs?.map((mic, key) => (
              <SelectItem
                key={key}
                value={mic.deviceId}
                className='text-white cursor-pointer hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] data-[highlighted]:bg-[#2a2a2a] data-[highlighted]:text-white data-[state=checked]:text-white non-draggable truncate'
              >
                <span className='truncate'>{mic.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className='flex gap-x-5 justify-center items-center non-draggable'>
        <Settings2 color='#575655' size={36} />
        <Select
          value={watchedValues.preset || onPreset || user?.userProfile.studio?.preset}
          onValueChange={(value: 'HD' | 'SD') => setValue('preset', value)}
        >
          <SelectTrigger className='outline-none cursor-pointer px-5 py-2 rounded-xl border-2 text-white border-[#575655] bg-transparent w-full non-draggable overflow-hidden'>
            <SelectValue placeholder="Select preset" className='truncate' />
          </SelectTrigger>
          <SelectContent className='bg-[#171717] border-[#575655] non-draggable max-w-sm'>
            <SelectItem
              value='HD'
              disabled={user?.userProfile.plan === 'FREE'}
              className='text-white cursor-pointer hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] data-[highlighted]:bg-[#2a2a2a] data-[highlighted]:text-white data-[state=checked]:text-white disabled:opacity-50 disabled:cursor-not-allowed non-draggable truncate'
            >
              <span className='truncate'>
                1080p
                {user?.userProfile.plan === 'FREE' && ' (Upgrade to PRO plan)'}
              </span>
            </SelectItem>
            <SelectItem
              value='SD'
              className='text-white cursor-pointer hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] data-[highlighted]:bg-[#2a2a2a] data-[highlighted]:text-white data-[state=checked]:text-white non-draggable truncate'
            >
              <span className='truncate'>720p</span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </form>
  );
};