import { onStopRecording, selectSources, StartRecording } from '@/lib/recorder';
import { cn, videoRecordingTime } from '@/lib/utils';
import { CastIcon, PauseIcon, SquareIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export const StudioTray = () => {
    const initialTimeRef = useRef(new Date());
    const [preview, setPreview] = useState(false);
    const [onTimer, setOnTimer] = useState<string>('00:00:00');
    const [count, setCount] = useState(0);

    const [recording, setRecording] = useState(false);
    const [onSources, setOnSources] = useState<
        | {
            id: string;
            screen: string;
            audio: string;
            preset: 'HD' | 'SD';
            plan: 'PRO' | 'FREE';
        }
        | undefined
    >(undefined);

    const clearTime = () => {
        setOnTimer('00:00:00');
        setCount(0);
    };

    window.ipcRenderer.on('profile-received', (_, payload) => {
        setOnSources(payload);
    });

    const videoElement = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        if (onSources && onSources.screen) selectSources(onSources, videoElement);
        return () => {
            selectSources(onSources!, videoElement);
        };
    }, [onSources]);

    useEffect(() => {
        if (preview && onSources && onSources.screen) {
            selectSources(onSources, videoElement);
        }
    }, [preview]);

    useEffect(() => {
        interface ProfilePayload {
            id: string;
            screen: string;
            audio: string;
            preset: 'HD' | 'SD';
            plan: 'PRO' | 'FREE';
        }
        
        const handleProfileReceived = (_: unknown, payload: ProfilePayload) => {
            setOnSources(payload);
        };
        
        window.ipcRenderer.on('profile-received', handleProfileReceived);
        
        return () => {
            window.ipcRenderer.off('profile-received', handleProfileReceived);
        };
    }, []);

    useEffect(() => {
        if (!recording) return;
        initialTimeRef.current = new Date();
        const recordingTimeInterval = setInterval(() => {
            const time = count + (new Date().getTime() - initialTimeRef.current.getTime());
            setCount(time);
            const recordingTime = videoRecordingTime(time);
            if (onSources?.plan === 'FREE' && recordingTime.minutes === '05') {
                setRecording(false);
                clearTime();
                onStopRecording();
            }
            setOnTimer(recordingTime.length);
            if (time <= 0) {
                setOnTimer('00:00:00');
                clearInterval(recordingTimeInterval);
            }
        }, 1);
        return () => clearInterval(recordingTimeInterval);
    }, [recording]);

    return !onSources ? (
        <></>
    ) : (
        <div className='flex flex-col justify-end gap-y-3 h-screen'>
            {preview && (
                <video
                    autoPlay
                    ref={videoElement}
                    className='w-6/12 self-end bg-white rounded-md'
                />
            )}
            <div className='rounded-full flex justify-around items-center h-12 w-full border-2 bg-[#171717] draggable border-white/40'>
                <div
                    {...(onSources && {
                        onClick: () => {
                            setRecording(true);
                            StartRecording(onSources);
                        },
                    })}
                    className={cn(
                        'non-draggable rounded-full cursor-pointer relative hover:opacity-80',
                        recording ? 'bg-red-500 w-4 h-4' : 'bg-red-400 w-6 h-6'
                    )}
                >
                    {recording && (
                        <span className='absolute -right-16 top-1/2 transform -translate-y-1/2 text-white'>
                            {onTimer}
                        </span>
                    )}
                </div>

                {!recording ? (
                    <PauseIcon
                        className='non-draggable opacity-50'
                        size={28}
                        fill='white'
                        stroke='none'
                    />
                ) : (
                    <SquareIcon
                        size={28}
                        fill='white'
                        stroke='white'
                        className='non-draggable cursor-pointer hover:scale-110 transform transition duration-150'
                        onClick={() => {
                            setRecording(false);
                            clearTime();
                            onStopRecording();
                        }}
                    />
                )}
                <CastIcon
                    onClick={() => setPreview((prev) => !prev)}
                    className='non-draggable cursor-pointer hover:opacity-60'
                    size={28}
                    stroke='white'
                />
            </div>
        </div>
    );
};