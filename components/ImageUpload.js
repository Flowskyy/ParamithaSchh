import { useState, useRef } from 'react';
import { supabase } from '../services/supabase';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import SmartImage from './SmartImage';
import { showToast } from '../utils/toast';

export default function ImageUpload({ value, onChange, folder = 'uploads', label = 'Upload Image' }) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleUpload = async (event) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];

      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('File size too large. Maximum size is 2MB.');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      
      onChange(data.publicUrl);
      showToast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      showToast.error('Error uploading image!');
    } finally {
      setUploading(false);
      // Reset input so same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className="space-y-2">
      <label className="text-slate-700 text-sm font-bold block">{label}</label>
      
      <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 transition-all hover:border-primary-400 bg-slate-50">
        {value ? (
          <div className="relative group aspect-video w-full max-w-md mx-auto rounded-lg overflow-hidden bg-slate-200">
            <SmartImage 
              src={value} 
              fill 
              style={{ objectFit: 'cover' }} 
              alt="Uploaded preview" 
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-sm transition-colors"
                title="Change Image"
              >
                <Upload size={20} />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full backdrop-blur-sm transition-colors"
                title="Remove Image"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center py-8 cursor-pointer hover:bg-slate-100 rounded-lg transition-colors"
          >
            {uploading ? (
              <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-2" />
            ) : (
              <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mb-2 text-slate-400">
                <ImageIcon size={24} />
              </div>
            )}
            <p className="text-sm font-medium text-slate-600">
              {uploading ? 'Uploading...' : 'Click to upload image'}
            </p>
            <p className="text-xs text-slate-400 mt-1">SVG, PNG, JPG or GIF (max. 2MB)</p>
          </div>
        )}
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          accept="image/*"
          className="hidden"
          disabled={uploading}
        />
      </div>
    </div>
  );
}
