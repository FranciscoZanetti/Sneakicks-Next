import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export const productFileValidator = z.object({
  files: z.array(z.object({
    path: z.string().min(1),
  })).nonempty(),
});

// Custom validator for a single file
const fileValidation = z.custom((file: File) => {
  const validTypes = new Set(['image/png', 'image/jpeg']);
  return validTypes.has(file.type);
}, {
  message: "Los archivos deben ser de tipo PNG o JPG."
});

// Validator for a FileList
export const frontProductFileValidator = z.custom((fileList: FileList | null | undefined) => {
  // Handle cases where fileList is null or undefined
  if (!fileList) {
    return false;
  }

  // Convert FileList to an array
  const files = Array.from(fileList);

  // Handle cases where files array is empty
  if (files.length === 0) {
    return false;
  }

  // Validate files
  const results = files.map(file => fileValidation.safeParse(file));
  const allValid = results.every(result => result.success);

  return allValid;
}, {
  message: "Uno o más archivos son inválidos."
});

export const userFileValidator = z.object({
    file: z.object({
      path: z.string().nonempty(),
    }).optional(),
});
