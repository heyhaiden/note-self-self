import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { compressAndUploadImage, generatePreview } from '@/lib/utils/image-upload';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { AlertCircle, Upload, X } from 'lucide-react';

interface PreviewData {
  url: string;
  dimensions: {
    width: number;
    height: number;
    originalWidth: number;
    originalHeight: number;
  };
}

export function ImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await handleFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await handleFile(file);
    }
  };

  const handleFile = async (file: File) => {
    try {
      // Generate preview first
      const previewResult = await generatePreview(file);
      setPreview({
        url: previewResult.previewUrl,
        dimensions: previewResult.dimensions,
      });
    } catch (error) {
      toast.error('Failed to generate preview');
      console.error('Preview error:', error);
    }
  };

  const handleUpload = async () => {
    if (!preview) return;

    try {
      setIsUploading(true);
      setProgress(0);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const { path, error } = await compressAndUploadImage(
        await fetch(preview.url).then(r => r.blob()).then(blob => new File([blob], 'preview.jpg', { type: 'image/jpeg' }))
      );

      clearInterval(progressInterval);

      if (error) {
        throw error;
      }

      setProgress(100);
      toast.success('Image uploaded successfully!');
      
      // Redirect to success page after a short delay
      setTimeout(() => {
        router.push('/success');
      }, 1000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload image');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const clearPreview = () => {
    setPreview(null);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">Upload Screenshot</h2>
        <p className="text-sm text-gray-600">
          For Instagram & Threads
        </p>
      </div>

      {!preview ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer block"
          >
            <div className="space-y-4">
              <div className="flex justify-center">
                <Upload className="h-12 w-12 text-gray-400" />
              </div>
              <div className="text-gray-600">
                {isUploading ? 'Uploading...' : 'Drag and drop or click to upload'}
              </div>
              <Button
                variant="outline"
                disabled={isUploading}
              >
                Select Image
              </Button>
            </div>
          </label>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <img
              src={preview.url}
              alt="Preview"
              className="w-full rounded-lg shadow-lg"
            />
            <button
              onClick={clearPreview}
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Original size: {preview.dimensions.originalWidth} × {preview.dimensions.originalHeight}px</p>
            <p>Final size: {preview.dimensions.width} × {preview.dimensions.height}px</p>
          </div>
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </Button>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <h3 className="text-sm font-medium text-gray-900">Requirements:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 text-gray-400" />
            Vertical format (portrait orientation)
          </li>
          <li className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 text-gray-400" />
            Minimum height: 1080px
          </li>
          <li className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 text-gray-400" />
            Maximum file size: 1MB
          </li>
          <li className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 text-gray-400" />
            Supported formats: JPG, PNG
          </li>
        </ul>
      </div>

      {isUploading && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-gray-500 text-center">
            Uploading... {progress}%
          </p>
        </div>
      )}
    </div>
  );
} 