import imageCompression from 'browser-image-compression';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Instagram/Threads recommended dimensions
const RECOMMENDED_ASPECT_RATIO = 9 / 16; // Vertical format
const MIN_HEIGHT = 1080; // Minimum height for good quality
const MAX_HEIGHT = 1920; // Maximum height
const MAX_FILE_SIZE_MB = 1; // Maximum file size of 1MB

interface ImageValidationResult {
  isValid: boolean;
  message: string;
}

interface PreviewResult {
  previewUrl: string;
  dimensions: {
    width: number;
    height: number;
    originalWidth: number;
    originalHeight: number;
  };
}

async function validateImage(file: File): Promise<ImageValidationResult> {
  // Check file size
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return {
      isValid: false,
      message: `File size must be less than ${MAX_FILE_SIZE_MB}MB`,
    };
  }

  // Check file type
  if (!file.type.startsWith('image/')) {
    return {
      isValid: false,
      message: 'File must be an image',
    };
  }

  // Check image dimensions
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      const isVertical = aspectRatio <= 1;

      if (!isVertical) {
        resolve({
          isValid: false,
          message: 'Image must be in vertical format (portrait orientation)',
        });
      }

      if (img.height < MIN_HEIGHT) {
        resolve({
          isValid: false,
          message: `Image height must be at least ${MIN_HEIGHT}px`,
        });
      }

      resolve({
        isValid: true,
        message: 'Image is valid',
      });
    };
    img.onerror = () => {
      resolve({
        isValid: false,
        message: 'Failed to load image',
      });
    };
    img.src = URL.createObjectURL(file);
  });
}

async function optimizeImageForSocial(file: File): Promise<File> {
  const options = {
    maxSizeMB: MAX_FILE_SIZE_MB,
    maxWidthOrHeight: MAX_HEIGHT,
    useWebWorker: true,
    initialQuality: 0.7, // Reduced quality to ensure we stay under 1MB
  };

  const compressedFile = await imageCompression(file, options);
  
  // Create a canvas to ensure correct aspect ratio
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Calculate dimensions to maintain aspect ratio
      let width = img.width;
      let height = img.height;
      
      if (width / height > RECOMMENDED_ASPECT_RATIO) {
        // Image is too wide, crop width
        width = height * RECOMMENDED_ASPECT_RATIO;
      } else if (width / height < RECOMMENDED_ASPECT_RATIO) {
        // Image is too tall, crop height
        height = width / RECOMMENDED_ASPECT_RATIO;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw image centered
      const x = (width - img.width) / 2;
      const y = (height - img.height) / 2;
      ctx?.drawImage(img, x, y);

      // Convert to blob with reduced quality
      canvas.toBlob((blob) => {
        if (blob) {
          const optimizedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(optimizedFile);
        } else {
          resolve(file);
        }
      }, 'image/jpeg', 0.7); // Reduced quality to ensure we stay under 1MB
    };
    img.src = URL.createObjectURL(compressedFile);
  });
}

async function generatePreview(file: File): Promise<PreviewResult> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Calculate dimensions to maintain aspect ratio
      let width = img.width;
      let height = img.height;
      
      if (width / height > RECOMMENDED_ASPECT_RATIO) {
        // Image is too wide, crop width
        width = height * RECOMMENDED_ASPECT_RATIO;
      } else if (width / height < RECOMMENDED_ASPECT_RATIO) {
        // Image is too tall, crop height
        height = width / RECOMMENDED_ASPECT_RATIO;
      }

      // Set preview size (max 400px height for preview)
      const previewHeight = Math.min(height, 400);
      const previewWidth = previewHeight * (width / height);

      canvas.width = previewWidth;
      canvas.height = previewHeight;

      // Draw image centered
      const x = (previewWidth - img.width * (previewHeight / height)) / 2;
      const y = (previewHeight - img.height * (previewHeight / height)) / 2;
      ctx?.drawImage(
        img,
        x,
        y,
        img.width * (previewHeight / height),
        img.height * (previewHeight / height)
      );

      resolve({
        previewUrl: canvas.toDataURL('image/jpeg', 0.8),
        dimensions: {
          width: Math.round(width),
          height: Math.round(height),
          originalWidth: img.width,
          originalHeight: img.height,
        },
      });
    };
    img.src = URL.createObjectURL(file);
  });
}

export async function compressAndUploadImage(
  file: File,
  bucketName: string = 'images'
): Promise<{ path: string; error: Error | null }> {
  try {
    // Validate image
    const validation = await validateImage(file);
    if (!validation.isValid) {
      throw new Error(validation.message);
    }

    // Optimize image for social media
    const optimizedFile = await optimizeImageForSocial(file);
    
    // Generate a unique filename
    const fileExt = 'jpg'; // Force JPEG for consistency
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, optimizedFile);

    if (uploadError) {
      throw uploadError;
    }

    // Get the public URL
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return {
      path: data.publicUrl,
      error: null,
    };
  } catch (error) {
    return {
      path: '',
      error: error as Error,
    };
  }
}

export { generatePreview }; 