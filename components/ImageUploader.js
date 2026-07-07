import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Upload, X, Check, Loader2 } from 'lucide-react';
import { showToast } from '../utils/toast';


function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

export default function ImageUploader({ 
  currentImage, 
  onUploadComplete, 
  aspectRatio = 16 / 9,
  bucket = 'media',
  folder = 'uploads',
  variant = 'default', // 'default' | 'compact'
  showPreview = true
}) {

  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const fileInputRef = useRef(null);

  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader.result.toString() || ''));
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspectRatio));
  }

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader.result.toString() || ''));
      reader.readAsDataURL(e.dataTransfer.files[0]);
    }
  };

  async function handleUploadImage() {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      showToast.error('Please select and crop an image first');
      return;
    }

    setLoading(true);

    try {
      const image = imgRef.current;
      const canvas = previewCanvasRef.current;
      const crop = completedCrop;

      // Validate image dimensions
      if (!image.naturalWidth || !image.naturalHeight || image.naturalWidth === 0 || image.naturalHeight === 0) {
        throw new Error('Image has invalid dimensions');
      }

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const ctx = canvas.getContext('2d');
      const pixelRatio = window.devicePixelRatio || 1;

      const canvasWidth = Math.floor(crop.width * scaleX * pixelRatio);
      const canvasHeight = Math.floor(crop.height * scaleY * pixelRatio);

      if (canvasWidth <= 0 || canvasHeight <= 0) {
        throw new Error('Invalid canvas dimensions');
      }

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      ctx.scale(pixelRatio, pixelRatio);
      ctx.imageSmoothingQuality = 'high';

      const cropX = crop.x * scaleX;
      const cropY = crop.y * scaleY;
      const cropWidth = crop.width * scaleX;
      const cropHeight = crop.height * scaleY;

      // Clear canvas before drawing
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(
        image,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        canvasWidth / pixelRatio,
        canvasHeight / pixelRatio
      );

      canvas.toBlob(async (blob) => {
        if (!blob || blob.size === 0) {
          // Fallback: upload original image without cropping
          console.warn('Canvas blob is empty, using fallback');
          try {
            const formData = new FormData();
            const fileInput = fileInputRef.current?.files?.[0];
            if (fileInput) {
              formData.append('file', fileInput);
              const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
              });
              const json = await response.json();
              if (!response.ok || json?.success !== true) {
                throw new Error(json?.error || 'Upload failed');
              }
              onUploadComplete(json.url);
              setImgSrc('');
              setLoading(false);
              showToast.success('Image uploaded successfully!');
              return;
            }
          } catch (fallbackErr) {
            setLoading(false);
            showToast.error('Upload failed: ' + (fallbackErr?.message || 'Unknown error'));
            return;
          }
          throw new Error('Canvas is empty and no fallback available');
        }

        try {
          const formData = new FormData();
          formData.append('file', blob, `upload-${Date.now()}.jpg`);

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          const json = await response.json();
          if (!response.ok || json?.success !== true) {
            throw new Error(json?.error || 'Upload failed');
          }

          onUploadComplete(json.url);
          setImgSrc('');
          setLoading(false);
          showToast.success('Image uploaded successfully!');
        } catch (err) {
          setLoading(false);
          showToast.error(err?.message || 'Upload failed');
        }
      }, 'image/jpeg', 0.9);


    } catch (err) {
      console.error(err);
      showToast.error(err.message || 'Upload failed');
      setLoading(false);
    }
  }

  return (
    <div className="w-full">

      {!imgSrc ? (
        <div className="relative">
          {showPreview && currentImage ? (
            <div className="mb-4 relative w-full aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-100 group">
               <Image
                 src={currentImage}
                 alt="Current"
                 fill
                 unoptimized
                 sizes="(max-width: 768px) 100vw, 50vw"
                 className="object-cover"
               />
               <button 
                 type="button"
                 onClick={() => onUploadComplete('')}
                 className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-700"
                 title="Remove Image"
               >
                 <X size={16} />
               </button>
            </div>
          ) : (
          <div 
            className={`border-2 border-dashed rounded-xl ${variant === 'compact' ? 'p-3' : 'p-8'} text-center transition-all ${
              dragActive ? 'border-primary-500 bg-primary-50' : 'border-slate-300 hover:border-primary-400 hover:bg-slate-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onSelectFile}
              className="hidden"
            />
            <div className={`flex flex-col items-center ${variant === 'compact' ? 'gap-1' : 'gap-3'}`}>
              <div className={`${variant === 'compact' ? 'w-8 h-8' : 'w-12 h-12'} bg-primary-100 text-primary-600 rounded-full flex items-center justify-center`}>
                <Upload size={variant === 'compact' ? 16 : 24} />
              </div>
              <div>
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`text-primary-600 font-bold hover:underline ${variant === 'compact' ? 'text-xs' : ''}`}
                >
                  {variant === 'compact' ? 'Upload' : 'Click to upload'}
                </button>
                {variant !== 'compact' && <span className="text-slate-500"> or drag and drop</span>}
              </div>
              {variant !== 'compact' && <p className="text-xs text-slate-400">SVG, PNG, JPG or GIF (max. 5MB)</p>}
            </div>
          </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-slate-900 rounded-xl overflow-hidden p-4">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspectRatio}
              className="max-h-[500px] mx-auto"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                alt="Crop me"
                src={imgSrc}
                onLoad={onImageLoad}
                style={{ maxHeight: '500px' }}
              />
            </ReactCrop>
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setImgSrc('')}
              className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2"
              disabled={loading}
            >
              <X size={18} /> Cancel
            </button>
            <button
              type="button"
              onClick={handleUploadImage}
              disabled={loading}
              className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-primary-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />} 
              {loading ? 'Uploading...' : 'Apply & Upload'}
            </button>
          </div>
          
          {!!completedCrop && (
            <canvas
              ref={previewCanvasRef}
              style={{
                display: 'none',
                objectFit: 'contain',
                width: completedCrop.width,
                height: completedCrop.height,
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
