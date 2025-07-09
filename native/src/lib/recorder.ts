import { v4 as uuid } from 'uuid';
import React from 'react';
import io from 'socket.io-client';
import { hidePluginWindow } from './utils';

let videoTransferFileName: string | undefined;
let mediaRecorder: MediaRecorder | undefined;
let userId: string;

const socket = io(import.meta.env.VITE_SOCKET_URL);

export const StartRecording = (onSources: {
  id: string;
  screen: string;
  audio: string;
}) => {
  if (!mediaRecorder) {
    throw new Error('MediaRecorder not initialized');
  }
  hidePluginWindow(true);
  videoTransferFileName = `${uuid()}-${onSources?.id.slice(0, 8)}.webm`;
  mediaRecorder.start(1000);
};

export const onStopRecording = () => {
  if (mediaRecorder) {
    mediaRecorder.stop();
  }
};

const stopRecording = () => {
  hidePluginWindow(false);
  socket.emit('process-video', {
    filename: videoTransferFileName,
    userId,
  });
};

export const onDataAvailable = (e: BlobEvent) => {
  if (e.data && e.data.size > 0) {
    socket.emit('video-chunks', {
      chunks: e.data,
      userId,
    });
  }
};

export const selectSources = async (
  onSources: {
    id: string;
    screen: string;
    audio: string;
    preset: 'HD' | 'SD';
  },
  videoElement: React.RefObject<HTMLVideoElement>
) => {
  if (onSources && onSources.id && onSources.screen && onSources.audio) {
    const constraints: any = {
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: onSources.screen,
          minWidth: onSources.preset === 'HD' ? 1920 : 1280,
          maxWidth: onSources.preset === 'HD' ? 1920 : 1280,
          minHeight: onSources.preset === 'HD' ? 1080 : 720,
          maxHeight: onSources.preset === 'HD' ? 1080 : 720,
          frameRate: 30,
          surfaceSwitching: 'exclude',
          selfBrowserSurface: 'exclude',
          systemAudio: 'include'
        },
      },
    };

    userId = onSources.id;

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      const audioStream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: onSources?.audio
          ? { deviceId: { exact: onSources.audio } }
          : false,
      });

      if (videoElement && videoElement.current) {
        videoElement.current.srcObject = stream;
        await videoElement.current.play();
      }

      const combinedStream = new MediaStream([
        ...stream.getTracks(),
        ...audioStream.getTracks(),
      ]);

      mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: 'video/webm; codecs=vp9',
      });

      mediaRecorder.ondataavailable = onDataAvailable;
      mediaRecorder.onstop = stopRecording;
    } catch (error) {
      console.error(error);
    }
  }
};