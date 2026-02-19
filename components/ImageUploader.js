import { useState, useRef, useEffect } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Upload, X, Check, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '../services/supabase';
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
  folder = 'uploads'
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

  async function uploadImage() {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    setLoading(true);

    try {
      const image = imgRef.current;
      const canvas = previewCanvasRef.current;
      const crop = completedCrop;

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const ctx = canvas.getContext('2d');
      const pixelRatio = window.devicePixelRatio;

      canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
      canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

      ctx.scale(pixelRatio, pixelRatio);
      ctx.imageSmoothingQuality = 'high';

      const cropX = crop.x * scaleX;
      const cropY = crop.y * scaleY;

      const centerX = image.naturalWidth / 2;
      const centerY = image.naturalHeight / 2;

      ctx.save();
      ctx.translate(-cropX, -cropY);
      ctx.translate(centerX, centerY);
      ctx.translate(-centerX, -centerY);
      ctx.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
      );
      ctx.restore();

      canvas.toBlob(async (blob) => {
        if (!blob) {
          throw new Error('Canvas is empty');
        }
        
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
        
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(fileName, blob, {
            contentType: 'image/jpeg',
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(fileName);

        onUploadComplete(publicUrl);
        setImgSrc('');
        setLoading(false);
        showToast.success('Image uploaded successfully!');
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
          {currentImage && (
            <div className="mb-4 relative w-full aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
               <img src={currentImage} alt="Current" className="w-full h-full object-cover" />
            </div>
          )}
          
          <div 
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
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
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                <Upload size={24} />
              </div>
              <div>
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-primary-600 font-bold hover:underline"
                >
                  Click to upload
                </button>
                <span className="text-slate-500"> or drag and drop</span>
              </div>
              <p className="text-xs text-slate-400">SVG, PNG, JPG or GIF (max. 5MB)</p>
            </div>
          </div>
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
              onClick={uploadImage}
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
