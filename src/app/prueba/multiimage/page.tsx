'use client';

import {
  MultiImageDropzone,
  type FileState,
} from '@/components/edgestore/multi-image-dropzone';
import { useEdgeStore } from '@/libs/edgestore';
import Link from "next/link";
import { useState } from 'react';

export default function MultiImageDropzoneUsage() {
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const [urls, setUrls] = useState<string[]>([]);
  const { edgestore } = useEdgeStore();

  function updateFileProgress(key: string, progress: FileState['progress']) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key,
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  }

  return (
    <div>
      <MultiImageDropzone
        value={fileStates}
        dropzoneOptions={{
          maxFiles: 4,
        }}
        onChange={(files) => {
          setFileStates(files);
        }}
        onFilesAdded={async (addedFiles) => {
          setFileStates([...fileStates, ...addedFiles]);
          await Promise.all(
            addedFiles.map(async (addedFileState) => {
              try {
                const res = await edgestore.products.upload({
                  file: addedFileState.file as File,
                  options: {
                    temporary: true,
                  },
                  onProgressChange: async (progress) => {
                    updateFileProgress(addedFileState.key, progress);
                    if (progress === 100) {
                      // wait 1 second to set it to complete
                      // so that the user can see the progress bar at 100%
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                      updateFileProgress(addedFileState.key, 'COMPLETE');
                    }
                  },
                });
                // setUrls([...urls, res.url]);
                setUrls((prevUrls) => [...prevUrls, res.url]);
                console.log(res);
              } catch (err) {
                updateFileProgress(addedFileState.key, 'ERROR');
              }
            }),
          );
        }}
      />
      <button
        className='bg-white text-black rounded px-3 py-1 hover:opacity'
        onClick={async () => {
          for (const url of urls) {
            await edgestore.products.confirmUpload({
              url,
            });
          }
          setFileStates([]);
          setUrls([]);
        }}
      >
        UPLOAD
      </button>
      { urls.map((url, index) => (<Link key={index} href={url} target='_blank'>URL{index+1}</Link>)) }
    </div>
  );
}