// 'use client';

// import { formatFileSize } from '@edgestore/react/utils';
// import { UploadCloudIcon, X } from 'lucide-react';
// import * as React from 'react';
// import { useDropzone, type DropzoneOptions } from 'react-dropzone';
// import { twMerge } from 'tailwind-merge';

// const variants = {
//   base: 'relative rounded-md aspect-square flex justify-center items-center flex-col cursor-pointer min-h-[150px] min-w-[200px] border border-dashed border-gray-400 dark:border-gray-300 transition-colors duration-200 ease-in-out',
//   image:
//     'relative  bg-slate-200 dark:bg-slate-900 rounded-md border-0 p-0 w-24 h-24',
//   active: 'border-2',
//   disabled:
//     'bg-gray-200 border-gray-300 cursor-default pointer-events-none bg-opacity-30 dark:bg-gray-700',
//   accept: 'border border-blue-500 bg-blue-500 bg-opacity-10',
//   reject: 'border border-red-700 bg-red-700 bg-opacity-10',
// };

// export type FileState = {
//   file: File | string;
//   key: string; // used to identify the file in the progress callback
//   progress: 'PENDING' | 'COMPLETE' | 'ERROR' | number;
// };

// type InputProps = {
//   className?: string;
//   value?: FileState[];
//   onChange?: (files: FileState[]) => void | Promise<void>;
//   onFilesAdded?: (addedFiles: FileState[]) => void | Promise<void>;
//   disabled?: boolean;
//   dropzoneOptions?: Omit<DropzoneOptions, 'disabled'>;
// };

// const ERROR_MESSAGES = {
//   fileTooLarge(maxSize: number) {
//     return `The file is too large. Max size is ${formatFileSize(maxSize)}.`;
//   },
//   fileInvalidType() {
//     return 'Invalid file type.';
//   },
//   tooManyFiles(maxFiles: number) {
//     return `You can only add ${maxFiles} file(s).`;
//   },
//   fileNotSupported() {
//     return 'The file is not supported.';
//   },
// };

// const MultiImageDropzone = React.forwardRef<HTMLInputElement, InputProps>(
//   (
//     { dropzoneOptions, value, className, disabled, onChange, onFilesAdded },
//     ref,
//   ) => {
//     const [customError, setCustomError] = React.useState<string>();

//     const imageUrls = React.useMemo(() => {
//       if (value) {
//         return value.map((fileState) => {
//           if (typeof fileState.file === 'string') {
//             // in case an url is passed in, use it to display the image
//             return fileState.file;
//           } else {
//             // in case a file is passed in, create a base64 url to display the image
//             return URL.createObjectURL(fileState.file);
//           }
//         });
//       }
//       return [];
//     }, [value]);

//     // dropzone configuration
//     const {
//       getRootProps,
//       getInputProps,
//       fileRejections,
//       isFocused,
//       isDragAccept,
//       isDragReject,
//     } = useDropzone({
//       accept: { 'image/*': [] },
//       disabled,
//       onDrop: (acceptedFiles) => {
//         const files = acceptedFiles;
//         setCustomError(undefined);
//         if (
//           dropzoneOptions?.maxFiles &&
//           (value?.length ?? 0) + files.length > dropzoneOptions.maxFiles
//         ) {
//           setCustomError(ERROR_MESSAGES.tooManyFiles(dropzoneOptions.maxFiles));
//           return;
//         }
//         if (files) {
//           const addedFiles = files.map<FileState>((file) => ({
//             file,
//             key: Math.random().toString(36).slice(2),
//             progress: 'PENDING',
//           }));
//           void onFilesAdded?.(addedFiles);
//           void onChange?.([...(value ?? []), ...addedFiles]);
//         }
//       },
//       ...dropzoneOptions,
//     });

//     // styling
//     const dropZoneClassName = React.useMemo(
//       () =>
//         twMerge(
//           variants.base,
//           isFocused && variants.active,
//           disabled && variants.disabled,
//           (isDragReject ?? fileRejections[0]) && variants.reject,
//           isDragAccept && variants.accept,
//           className,
//         ).trim(),
//       [
//         isFocused,
//         fileRejections,
//         isDragAccept,
//         isDragReject,
//         disabled,
//         className,
//       ],
//     );

//     // error validation messages
//     const errorMessage = React.useMemo(() => {
//       if (fileRejections[0]) {
//         const { errors } = fileRejections[0];
//         if (errors[0]?.code === 'file-too-large') {
//           return ERROR_MESSAGES.fileTooLarge(dropzoneOptions?.maxSize ?? 0);
//         } else if (errors[0]?.code === 'file-invalid-type') {
//           return ERROR_MESSAGES.fileInvalidType();
//         } else if (errors[0]?.code === 'too-many-files') {
//           return ERROR_MESSAGES.tooManyFiles(dropzoneOptions?.maxFiles ?? 0);
//         } else {
//           return ERROR_MESSAGES.fileNotSupported();
//         }
//       }
//       return undefined;
//     }, [fileRejections, dropzoneOptions]);

//     return (
//       <div className="flex gap-4">
//         {/* Dropzone */}
//         {(!value || value.length < (dropzoneOptions?.maxFiles ?? 0)) && (
//           <div
//             {...getRootProps({
//               className: dropZoneClassName,
//             })}
//           >
//             {/* Main File Input */}
//             <input ref={ref} {...getInputProps()} />
//             <div className="flex flex-col items-center justify-center text-xs text-gray-400">
//               <UploadCloudIcon className="mb-2 h-7 w-7" />
//               <div className="text-gray-400">drag & drop to upload</div>
//               <div className="mt-3">
//                 <Button type="button" disabled={disabled}>
//                   select
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}
        
//         {/* Images */}
//         <div className="grid grid-cols-2 grid-rows-2 gap-2">
//           {value?.map(({ file, progress }, index) => (
//             <div key={index} className={twMerge(variants.image)}>
//               <img
//                 className="h-full w-full rounded-md object-cover"
//                 src={imageUrls[index]}
//                 alt={typeof file === 'string' ? file : file.name}
//               />
//               {/* Progress Bar */}
//               {typeof progress === 'number' && (
//                 <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center rounded-md bg-black bg-opacity-70">
//                   <CircleProgress progress={progress} />
//                 </div>
//               )}
//               {/* Remove Image Icon */}
//               {imageUrls[index] && !disabled && progress === 'PENDING' && (
//                 <div
//                   className="group absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 transform"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     void onChange?.(value.filter((_, i) => i !== index) ?? []);
//                   }}
//                 >
//                   <div className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-md border border-solid border-gray-500 bg-white transition-all duration-300 hover:h-6 hover:w-6 dark:border-gray-400 dark:bg-black">
//                     <X
//                       className="text-gray-500 dark:text-gray-400"
//                       width={16}
//                       height={16}
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//           {/* Fill empty spaces if less than 4 images */}
//           {value && value.length < 4 && 
//             Array.from({ length: 4 - value.length }).map((_, idx) => (
//               <div key={`empty-${idx}`} className={twMerge(variants.image, 'bg-white dark:bg-white')} />
//             ))
//           }
//         </div>
//       </div>
//     );
//   },
// );
// MultiImageDropzone.displayName = 'MultiImageDropzone';

// const Button = React.forwardRef<
//   HTMLButtonElement,
//   React.ButtonHTMLAttributes<HTMLButtonElement>
// >(({ className, ...props }, ref) => {
//   return (
//     <button
//       className={twMerge(
//         // base
//         'focus-visible:ring-ring inline-flex cursor-pointer items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50',
//         // color
//         'border border-gray-400 text-gray-400 shadow hover:bg-gray-100 hover:text-gray-500 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700',
//         // size
//         'h-6 rounded-md px-2 text-xs',
//         className,
//       )}
//       ref={ref}
//       {...props}
//     />
//   );
// });
// Button.displayName = 'Button';

// export { MultiImageDropzone };

// function CircleProgress({ progress }: { progress: number }) {
//   const strokeWidth = 4; // Adjust the stroke width to make the circle smaller
//   const radius = 22; // Reduce the radius to fit within the image bounds
//   const circumference = 2 * Math.PI * radius;
//   return (
//     <svg
//       className="absolute top-0 left-0 right-0 bottom-0 m-auto block"
//       width="50" // Adjust the width and height to fit the reduced radius
//       height="50"
//     >
//       <circle
//         stroke="white"
//         fill="transparent"
//         strokeWidth={strokeWidth}
//         r={radius}
//         cx="50%"
//         cy="50%"
//         style={{ opacity: 0.25 }}
//       />
//       <circle
//         stroke="white"
//         fill="transparent"
//         strokeWidth={strokeWidth}
//         r={radius}
//         cx="50%"
//         cy="50%"
//         strokeDasharray={circumference}
//         strokeDashoffset={
//           circumference - (progress / 100) * circumference
//         }
//         style={{ transition: 'stroke-dashoffset 0.5s ease' }}
//       />
//     </svg>
//   );
// }







// 'use client';

// import { formatFileSize } from '@edgestore/react/utils';
// import { UploadCloudIcon, X } from 'lucide-react';
// import * as React from 'react';
// import { useDropzone, type DropzoneOptions } from 'react-dropzone';
// import { twMerge } from 'tailwind-merge';

// const variants = {
//   base: 'relative rounded-md aspect-square flex justify-center items-center flex-col cursor-pointer min-h-[150px] min-w-[200px] border border-dashed border-gray-400 dark:border-gray-300 transition-colors duration-200 ease-in-out',
//   image:
//     'relative bg-slate-200 dark:bg-slate-900 rounded-md border-0 p-0 w-24 h-24 sm:w-20 sm:h-20', // Ajustes para dispositivos móviles
//   active: 'border-2',
//   disabled:
//     'bg-gray-200 border-gray-300 cursor-default pointer-events-none bg-opacity-30 dark:bg-gray-700',
//   accept: 'border border-blue-500 bg-blue-500 bg-opacity-10',
//   reject: 'border border-red-700 bg-red-700 bg-opacity-10',
// };

// export type FileState = {
//   file: File | string;
//   key: string; // used to identify the file in the progress callback
//   progress: 'PENDING' | 'COMPLETE' | 'ERROR' | number;
// };

// type InputProps = {
//   className?: string;
//   value?: FileState[];
//   onChange?: (files: FileState[]) => void | Promise<void>;
//   onFilesAdded?: (addedFiles: FileState[]) => void | Promise<void>;
//   disabled?: boolean;
//   dropzoneOptions?: Omit<DropzoneOptions, 'disabled'>;
// };

// const ERROR_MESSAGES = {
//   fileTooLarge(maxSize: number) {
//     return `The file is too large. Max size is ${formatFileSize(maxSize)}.`;
//   },
//   fileInvalidType() {
//     return 'Invalid file type.';
//   },
//   tooManyFiles(maxFiles: number) {
//     return `You can only add ${maxFiles} file(s).`;
//   },
//   fileNotSupported() {
//     return 'The file is not supported.';
//   },
// };

// const MultiImageDropzone = React.forwardRef<HTMLInputElement, InputProps>(
//   (
//     { dropzoneOptions, value, className, disabled, onChange, onFilesAdded },
//     ref,
//   ) => {
//     const [customError, setCustomError] = React.useState<string>();

//     const imageUrls = React.useMemo(() => {
//       if (value) {
//         return value.map((fileState) => {
//           if (typeof fileState.file === 'string') {
//             // in case an url is passed in, use it to display the image
//             return fileState.file;
//           } else {
//             // in case a file is passed in, create a base64 url to display the image
//             return URL.createObjectURL(fileState.file);
//           }
//         });
//       }
//       return [];
//     }, [value]);

//     // dropzone configuration
//     const {
//       getRootProps,
//       getInputProps,
//       fileRejections,
//       isFocused,
//       isDragAccept,
//       isDragReject,
//     } = useDropzone({
//       accept: { 'image/*': [] },
//       disabled,
//       onDrop: (acceptedFiles) => {
//         const files = acceptedFiles;
//         setCustomError(undefined);
//         if (
//           dropzoneOptions?.maxFiles &&
//           (value?.length ?? 0) + files.length > dropzoneOptions.maxFiles
//         ) {
//           setCustomError(ERROR_MESSAGES.tooManyFiles(dropzoneOptions.maxFiles));
//           return;
//         }
//         if (files) {
//           const addedFiles = files.map<FileState>((file) => ({
//             file,
//             key: Math.random().toString(36).slice(2),
//             progress: 'PENDING',
//           }));
//           void onFilesAdded?.(addedFiles);
//           void onChange?.([...(value ?? []), ...addedFiles]);
//         }
//       },
//       ...dropzoneOptions,
//     });

//     // styling
//     const dropZoneClassName = React.useMemo(
//       () =>
//         twMerge(
//           variants.base,
//           isFocused && variants.active,
//           disabled && variants.disabled,
//           (isDragReject ?? fileRejections[0]) && variants.reject,
//           isDragAccept && variants.accept,
//           className,
//         ).trim(),
//       [
//         isFocused,
//         fileRejections,
//         isDragAccept,
//         isDragReject,
//         disabled,
//         className,
//       ],
//     );

//     // error validation messages
//     const errorMessage = React.useMemo(() => {
//       if (fileRejections[0]) {
//         const { errors } = fileRejections[0];
//         if (errors[0]?.code === 'file-too-large') {
//           return ERROR_MESSAGES.fileTooLarge(dropzoneOptions?.maxSize ?? 0);
//         } else if (errors[0]?.code === 'file-invalid-type') {
//           return ERROR_MESSAGES.fileInvalidType();
//         } else if (errors[0]?.code === 'too-many-files') {
//           return ERROR_MESSAGES.tooManyFiles(dropzoneOptions?.maxFiles ?? 0);
//         } else {
//           return ERROR_MESSAGES.fileNotSupported();
//         }
//       }
//       return undefined;
//     }, [fileRejections, dropzoneOptions]);

//     return (
//       <div className="flex flex-col items-center gap-4">
//         {/* Dropzone */}
//         {(!value || value.length < (dropzoneOptions?.maxFiles ?? 0)) && (
//           <div
//             {...getRootProps({
//               className: dropZoneClassName,
//             })}
//           >
//             {/* Main File Input */}
//             <input ref={ref} {...getInputProps()} />
//             <div className="flex flex-col items-center justify-center text-xs text-gray-400">
//               <UploadCloudIcon className="mb-2 h-7 w-7" />
//               <div className="text-gray-400">drag & drop to upload</div>
//               <div className="mt-3">
//                 <Button type="button" disabled={disabled}>
//                   select
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}
        
//         {/* Images */}
//         <div className="flex flex-wrap gap-2 justify-center">
//           {value?.map(({ file, progress }, index) => (
//             <div key={index} className={twMerge(variants.image)}>
//               <img
//                 className="h-full w-full rounded-md object-cover"
//                 src={imageUrls[index]}
//                 alt={typeof file === 'string' ? file : file.name}
//               />
//               {/* Progress Bar */}
//               {typeof progress === 'number' && (
//                 <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center rounded-md bg-black bg-opacity-70">
//                   <CircleProgress progress={progress} />
//                 </div>
//               )}
//               {/* Remove Image Icon */}
//               {imageUrls[index] && !disabled && progress === 'PENDING' && (
//                 <div
//                   className="group absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 transform"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     void onChange?.(value.filter((_, i) => i !== index) ?? []);
//                   }}
//                 >
//                   <div className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-md border border-solid border-gray-500 bg-white transition-all duration-300 hover:h-6 hover:w-6 dark:border-gray-400 dark:bg-black">
//                     <X
//                       className="text-gray-500 dark:text-gray-400"
//                       width={16}
//                       height={16}
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//           {/* Fill empty spaces if less than 4 images */}
//           {value && value.length < 4 && 
//             Array.from({ length: 4 - value.length }).map((_, idx) => (
//               <div key={`empty-${idx}`} className={twMerge(variants.image, 'bg-white dark:bg-white')} />
//             ))
//           }
//         </div>
//       </div>
//     );
//   },
// );
// MultiImageDropzone.displayName = 'MultiImageDropzone';

// const Button = React.forwardRef<
//   HTMLButtonElement,
//   React.ButtonHTMLAttributes<HTMLButtonElement>
// >(({ className, ...props }, ref) => {
//   return (
//     <button
//       className={twMerge(
//         // base
//         'focus-visible:ring-ring inline-flex cursor-pointer items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50',
//         // color
//         'border border-gray-400 text-gray-400 shadow hover:bg-gray-100 hover:text-gray-500 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700',
//         // size
//         'h-6 rounded-md px-2 text-xs',
//         className,
//       )}
//       ref={ref}
//       {...props}
//     />
//   );
// });
// Button.displayName = 'Button';

// export { MultiImageDropzone };

// function CircleProgress({ progress }: { progress: number }) {
//   const strokeWidth = 4; // Ajustar el ancho del trazo
//   const radius = 22; // Reducir el radio para que encaje dentro de los límites de la imagen
//   const circumference = 2 * Math.PI * radius;
//   return (
//     <svg
//       className="absolute top-0 left-0 right-0 bottom-0 m-auto block"
//       width="50" // Ajustar el ancho y alto para que se ajuste al radio reducido
//       height="50"
//     >
//       <circle
//         stroke="white"
//         fill="transparent"
//         strokeWidth={strokeWidth}
//         r={radius}
//         cx="50%"
//         cy="50%"
//         style={{ opacity: 0.25 }}
//       />
//       <circle
//         stroke="white"
//         fill="transparent"
//         strokeWidth={strokeWidth}
//         r={radius}
//         cx="50%"
//         cy="50%"
//         strokeDasharray={circumference}
//         strokeDashoffset={
//           circumference - (progress / 100) * circumference
//         }
//         style={{ transition: 'stroke-dashoffset 0.5s ease' }}
//       />
//     </svg>
//   );
// }







// 'use client';

// import { formatFileSize } from '@edgestore/react/utils';
// import { UploadCloudIcon, X } from 'lucide-react';
// import * as React from 'react';
// import { useDropzone, type DropzoneOptions } from 'react-dropzone';
// import { twMerge } from 'tailwind-merge';

// const variants = {
//   base: 'relative rounded-md aspect-square flex justify-center items-center flex-col cursor-pointer min-h-[150px] min-w-[200px] border border-dashed border-gray-400 dark:border-gray-300 transition-colors duration-200 ease-in-out',
//   image:
//     'relative bg-slate-200 dark:bg-slate-900 rounded-md border-0 p-0 w-24 h-24 sm:w-20 sm:h-20', // Ajustes para dispositivos móviles
//   active: 'border-2',
//   disabled:
//     'bg-gray-200 border-gray-300 cursor-default pointer-events-none bg-opacity-30 dark:bg-gray-700',
//   accept: 'border border-blue-500 bg-blue-500 bg-opacity-10',
//   reject: 'border border-red-700 bg-red-700 bg-opacity-10',
// };

// export type FileState = {
//   file: File | string;
//   key: string; // used to identify the file in the progress callback
//   progress: 'PENDING' | 'COMPLETE' | 'ERROR' | number;
// };

// type InputProps = {
//   className?: string;
//   value?: FileState[];
//   onChange?: (files: FileState[]) => void | Promise<void>;
//   onFilesAdded?: (addedFiles: FileState[]) => void | Promise<void>;
//   disabled?: boolean;
//   dropzoneOptions?: Omit<DropzoneOptions, 'disabled'>;
// };

// const ERROR_MESSAGES = {
//   fileTooLarge(maxSize: number) {
//     return `The file is too large. Max size is ${formatFileSize(maxSize)}.`;
//   },
//   fileInvalidType() {
//     return 'Invalid file type.';
//   },
//   tooManyFiles(maxFiles: number) {
//     return `You can only add ${maxFiles} file(s).`;
//   },
//   fileNotSupported() {
//     return 'The file is not supported.';
//   },
// };

// const MultiImageDropzone = React.forwardRef<HTMLInputElement, InputProps>(
//   (
//     { dropzoneOptions, value, className, disabled, onChange, onFilesAdded },
//     ref,
//   ) => {
//     const [customError, setCustomError] = React.useState<string>();

//     const imageUrls = React.useMemo(() => {
//       if (value) {
//         return value.map((fileState) => {
//           if (typeof fileState.file === 'string') {
//             // in case an url is passed in, use it to display the image
//             return fileState.file;
//           } else {
//             // in case a file is passed in, create a base64 url to display the image
//             return URL.createObjectURL(fileState.file);
//           }
//         });
//       }
//       return [];
//     }, [value]);

//     // dropzone configuration
//     const {
//       getRootProps,
//       getInputProps,
//       fileRejections,
//       isFocused,
//       isDragAccept,
//       isDragReject,
//     } = useDropzone({
//       accept: { 'image/*': [] },
//       disabled,
//       onDrop: (acceptedFiles) => {
//         const files = acceptedFiles;
//         setCustomError(undefined);
//         if (
//           dropzoneOptions?.maxFiles &&
//           (value?.length ?? 0) + files.length > dropzoneOptions.maxFiles
//         ) {
//           setCustomError(ERROR_MESSAGES.tooManyFiles(dropzoneOptions.maxFiles));
//           return;
//         }
//         if (files) {
//           const addedFiles = files.map<FileState>((file) => ({
//             file,
//             key: Math.random().toString(36).slice(2),
//             progress: 'PENDING',
//           }));
//           void onFilesAdded?.(addedFiles);
//           void onChange?.([...(value ?? []), ...addedFiles]);
//         }
//       },
//       ...dropzoneOptions,
//     });

//     // styling
//     const dropZoneClassName = React.useMemo(
//       () =>
//         twMerge(
//           variants.base,
//           isFocused && variants.active,
//           disabled && variants.disabled,
//           (isDragReject ?? fileRejections[0]) && variants.reject,
//           isDragAccept && variants.accept,
//           className,
//         ).trim(),
//       [
//         isFocused,
//         fileRejections,
//         isDragAccept,
//         isDragReject,
//         disabled,
//         className,
//       ],
//     );

//     // error validation messages
//     const errorMessage = React.useMemo(() => {
//       if (fileRejections[0]) {
//         const { errors } = fileRejections[0];
//         if (errors[0]?.code === 'file-too-large') {
//           return ERROR_MESSAGES.fileTooLarge(dropzoneOptions?.maxSize ?? 0);
//         } else if (errors[0]?.code === 'file-invalid-type') {
//           return ERROR_MESSAGES.fileInvalidType();
//         } else if (errors[0]?.code === 'too-many-files') {
//           return ERROR_MESSAGES.tooManyFiles(dropzoneOptions?.maxFiles ?? 0);
//         } else {
//           return ERROR_MESSAGES.fileNotSupported();
//         }
//       }
//       return undefined;
//     }, [fileRejections, dropzoneOptions]);

//     return (
//       <div className="flex flex-col lg:flex-row gap-4">
//         {/* Dropzone */}
//         {(!value || value.length < (dropzoneOptions?.maxFiles ?? 0)) && (
//           <div
//             {...getRootProps({
//               className: dropZoneClassName,
//             })}
//             className="lg:w-1/3 flex flex-col items-center mb-4 lg:mb-0" // Ajustar el ancho del dropzone en pantallas grandes
//           >
//             {/* Main File Input */}
//             <input ref={ref} {...getInputProps()} />
//             <div className="flex flex-col items-center justify-center text-xs text-gray-400">
//               <UploadCloudIcon className="mb-2 h-7 w-7" />
//               <div className="text-gray-400">drag & drop to upload</div>
//               <div className="mt-3">
//                 <Button type="button" disabled={disabled}>
//                   select
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}
        
//         {/* Images */}
//         <div className="flex flex-wrap lg:gap-2 lg:justify-start gap-2 lg:w-2/3 w-full overflow-x-auto">
//           {value?.map(({ file, progress }, index) => (
//             <div key={index} className={twMerge(variants.image, 'flex-shrink-0')}>
//               <img
//                 className="h-full w-full rounded-md object-cover"
//                 src={imageUrls[index]}
//                 alt={typeof file === 'string' ? file : file.name}
//               />
//               {/* Progress Bar */}
//               {typeof progress === 'number' && (
//                 <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center rounded-md bg-black bg-opacity-70">
//                   <CircleProgress progress={progress} />
//                 </div>
//               )}
//               {/* Remove Image Icon */}
//               {imageUrls[index] && !disabled && progress === 'PENDING' && (
//                 <div
//                   className="group absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 transform"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     void onChange?.(value.filter((_, i) => i !== index) ?? []);
//                   }}
//                 >
//                   <div className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-md border border-solid border-gray-500 bg-white transition-all duration-300 hover:h-6 hover:w-6 dark:border-gray-400 dark:bg-black">
//                     <X
//                       className="text-gray-500 dark:text-gray-400"
//                       width={16}
//                       height={16}
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//           {/* Fill empty spaces if less than 4 images */}
//           {value && value.length < 4 && 
//             Array.from({ length: 4 - value.length }).map((_, idx) => (
//               <div key={`empty-${idx}`} className={twMerge(variants.image, 'bg-white dark:bg-white')} />
//             ))
//           }
//         </div>
//       </div>
//     );
//   },
// );
// MultiImageDropzone.displayName = 'MultiImageDropzone';

// const Button = React.forwardRef<
//   HTMLButtonElement,
//   React.ButtonHTMLAttributes<HTMLButtonElement>
// >(({ className, ...props }, ref) => {
//   return (
//     <button
//       className={twMerge(
//         // base
//         'focus-visible:ring-ring inline-flex cursor-pointer items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50',
//         // color
//         'border border-gray-400 text-gray-400 shadow hover:bg-gray-100 hover:text-gray-500 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700',
//         // size
//         'h-6 rounded-md px-2 text-xs',
//         className,
//       )}
//       ref={ref}
//       {...props}
//     />
//   );
// });
// Button.displayName = 'Button';

// export { MultiImageDropzone };

// function CircleProgress({ progress }: { progress: number }) {
//   const strokeWidth = 4; // Ajustar el ancho del trazo para hacer el círculo más pequeño
//   const radius = 22; // Reducir el radio para que encaje dentro de los límites de la imagen
//   const circumference = 2 * Math.PI * radius;
//   return (
//     <svg
//       className="absolute top-0 left-0 right-0 bottom-0 m-auto block"
//       width="50" // Ajustar el ancho y alto para que se ajuste al radio reducido
//       height="50"
//     >
//       <circle
//         stroke="white"
//         fill="transparent"
//         strokeWidth={strokeWidth}
//         r={radius}
//         cx="50%"
//         cy="50%"
//         style={{ opacity: 0.25 }}
//       />
//       <circle
//         stroke="white"
//         fill="transparent"
//         strokeWidth={strokeWidth}
//         r={radius}
//         cx="50%"
//         cy="50%"
//         strokeDasharray={circumference}
//         strokeDashoffset={
//           circumference - (progress / 100) * circumference
//         }
//         style={{ transition: 'stroke-dashoffset 0.5s ease' }}
//       />
//     </svg>
//   );
// }









'use client';

import { formatFileSize } from '@edgestore/react/utils';
import { UploadCloudIcon, X } from 'lucide-react';
import * as React from 'react';
import { useDropzone, type DropzoneOptions } from 'react-dropzone';
import { twMerge } from 'tailwind-merge';

const variants = {
  base: 'relative rounded-md aspect-square flex justify-center items-center flex-col cursor-pointer min-h-[150px] min-w-[200px] border border-dashed border-gray-400 dark:border-gray-300 transition-colors duration-200 ease-in-out',
  image:
    'relative bg-slate-200 dark:bg-slate-900 rounded-md border-0 p-0 w-24 h-24 sm:w-20 sm:h-20', // Ajustes para dispositivos móviles
  active: 'border-2',
  disabled:
    'bg-gray-200 border-gray-300 cursor-default pointer-events-none bg-opacity-30 dark:bg-gray-700',
  accept: 'border border-blue-500 bg-blue-500 bg-opacity-10',
  reject: 'border border-red-700 bg-red-700 bg-opacity-10',
};

export type FileState = {
  file: File | string;
  key: string; // used to identify the file in the progress callback
  progress: 'PENDING' | 'COMPLETE' | 'ERROR' | number;
};

type InputProps = {
  className?: string;
  value?: FileState[];
  onChange?: (files: FileState[]) => void | Promise<void>;
  onFilesAdded?: (addedFiles: FileState[]) => void | Promise<void>;
  disabled?: boolean;
  dropzoneOptions?: Omit<DropzoneOptions, 'disabled'>;
  onRemove?: (index: number) => void;
};

const ERROR_MESSAGES = {
  fileTooLarge(maxSize: number) {
    return `The file is too large. Max size is ${formatFileSize(maxSize)}.`;
  },
  fileInvalidType() {
    return 'Invalid file type.';
  },
  tooManyFiles(maxFiles: number) {
    return `You can only add ${maxFiles} file(s).`;
  },
  fileNotSupported() {
    return 'The file is not supported.';
  },
};

const MultiImageDropzone = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { dropzoneOptions, value, className, disabled, onChange, onFilesAdded, onRemove },
    ref,
  ) => {
    const [customError, setCustomError] = React.useState<string>();

    const imageUrls = React.useMemo(() => {
      if (value) {
        return value.map((fileState) => {
          if (typeof fileState.file === 'string') {
            // in case an url is passed in, use it to display the image
            return fileState.file;
          } else {
            // in case a file is passed in, create a base64 url to display the image
            return URL.createObjectURL(fileState.file);
          }
        });
      }
      return [];
    }, [value]);

    // dropzone configuration
    const {
      getRootProps,
      getInputProps,
      fileRejections,
      isFocused,
      isDragAccept,
      isDragReject,
    } = useDropzone({
      accept: { 'image/*': [] },
      disabled,
      onDrop: (acceptedFiles) => {
        const files = acceptedFiles;
        setCustomError(undefined);
        if (
          dropzoneOptions?.maxFiles &&
          (value?.length ?? 0) + files.length > dropzoneOptions.maxFiles
        ) {
          setCustomError(ERROR_MESSAGES.tooManyFiles(dropzoneOptions.maxFiles));
          return;
        }
        if (files) {
          const addedFiles = files.map<FileState>((file) => ({
            file,
            key: Math.random().toString(36).slice(2),
            progress: 'PENDING',
          }));
          void onFilesAdded?.(addedFiles);
          void onChange?.([...(value ?? []), ...addedFiles]);
        }
      },
      ...dropzoneOptions,
    });

    // styling
    const dropZoneClassName = React.useMemo(
      () =>
        twMerge(
          variants.base,
          isFocused && variants.active,
          disabled && variants.disabled,
          (isDragReject ?? fileRejections[0]) && variants.reject,
          isDragAccept && variants.accept,
          className,
        ).trim(),
      [
        isFocused,
        fileRejections,
        isDragAccept,
        isDragReject,
        disabled,
        className,
      ],
    );

    // error validation messages
    const errorMessage = React.useMemo(() => {
      if (fileRejections[0]) {
        const { errors } = fileRejections[0];
        if (errors[0]?.code === 'file-too-large') {
          return ERROR_MESSAGES.fileTooLarge(dropzoneOptions?.maxSize ?? 0);
        } else if (errors[0]?.code === 'file-invalid-type') {
          return ERROR_MESSAGES.fileInvalidType();
        } else if (errors[0]?.code === 'too-many-files') {
          return ERROR_MESSAGES.tooManyFiles(dropzoneOptions?.maxFiles ?? 0);
        } else {
          return ERROR_MESSAGES.fileNotSupported();
        }
      }
      return undefined;
    }, [fileRejections, dropzoneOptions]);

    return (
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Dropzone */}
        {(!value || value.length < (dropzoneOptions?.maxFiles ?? 0)) && (
          <div
            {...getRootProps({
              className: dropZoneClassName,
            })}
            className="lg:w-1/3 flex flex-col items-center mb-4 lg:mb-0" // Ajustar el ancho del dropzone en pantallas grandes
          >
            {/* Main File Input */}
            <input ref={ref} {...getInputProps()} />
            <div className="flex flex-col items-center justify-center text-xs text-gray-400">
              <UploadCloudIcon className="mb-2 h-7 w-7" />
              <div className="text-gray-400">drag & drop to upload</div>
              <div className="mt-3">
                <Button type="button" disabled={disabled}>
                  select
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Images */}
        <div className="flex flex-wrap lg:gap-2 lg:justify-start gap-2 lg:w-2/3 w-full overflow-x-auto">
          {value?.map(({ file, progress }, index) => (
            <div key={index} className={twMerge(variants.image, 'flex-shrink-0')}>
              <img
                className="h-full w-full rounded-md object-cover"
                src={imageUrls[index]}
                alt={typeof file === 'string' ? file : file.name}
              />
              {/* Progress Bar */}
              {typeof progress === 'number' && (
                <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center rounded-md bg-black bg-opacity-70">
                  <CircleProgress progress={progress} />
                </div>
              )}
              {/* Remove Image Icon */}
              {imageUrls[index] && !disabled && (
                <div
                  className="group absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 transform"
                  onClick={(e) => {
                    e.stopPropagation();
                    void onChange?.(value.filter((_, i) => i !== index) ?? []);
                    onRemove?.(index);
                  }}
                >
                  <div className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-md border border-solid border-gray-500 bg-white transition-all duration-300 hover:h-6 hover:w-6 dark:border-gray-400 dark:bg-black">
                    <X
                      className="text-gray-500 dark:text-gray-400"
                      width={16}
                      height={16}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
          {/* Fill empty spaces if less than 4 images */}
          {value && value.length < 4 && 
            Array.from({ length: 4 - value.length }).map((_, idx) => (
              <div key={`empty-${idx}`} className={twMerge(variants.image, 'bg-white dark:bg-white')} />
            ))
          }
        </div>
      </div>
    );
  },
);
MultiImageDropzone.displayName = 'MultiImageDropzone';

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  return (
    <button
      className={twMerge(
        // base
        'focus-visible:ring-ring inline-flex cursor-pointer items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50',
        // color
        'border border-gray-400 text-gray-400 shadow hover:bg-gray-100 hover:text-gray-500 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700',
        // size
        'h-6 rounded-md px-2 text-xs',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = 'Button';

export { MultiImageDropzone };

function CircleProgress({ progress }: { progress: number }) {
  const strokeWidth = 4; // Ajustar el ancho del trazo para hacer el círculo más pequeño
  const radius = 22; // Reducir el radio para que encaje dentro de los límites de la imagen
  const circumference = 2 * Math.PI * radius;
  return (
    <svg
      className="absolute top-0 left-0 right-0 bottom-0 m-auto block"
      width="50" // Ajustar el ancho y alto para que se ajuste al radio reducido
      height="50"
    >
      <circle
        stroke="white"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx="50%"
        cy="50%"
        style={{ opacity: 0.25 }}
      />
      <circle
        stroke="white"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx="50%"
        cy="50%"
        strokeDasharray={circumference}
        strokeDashoffset={
          circumference - (progress / 100) * circumference
        }
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
    </svg>
  );
}
