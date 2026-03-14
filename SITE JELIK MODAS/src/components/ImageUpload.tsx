
import React from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadImage } from '../lib/storage';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  onMultipleChange?: (values: string[]) => void;
  label: string;
  className?: string;
  aspectRatio?: "video" | "portrait";
  multiple?: boolean;
  directory?: boolean;
}

export function ImageUpload({ 
  value, 
  onChange,
  onMultipleChange, 
  label, 
  className = "", 
  aspectRatio = "portrait",
  multiple = false,
  directory = false
}: ImageUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (multiple || directory) {
      if (!onMultipleChange) return;
      
      const imageFiles = (Array.from(files) as File[]).filter(f => f.type.startsWith('image/'));
      if (imageFiles.length === 0) {
        alert('Nenhuma imagem válida encontrada.');
        return;
      }

      setUploading(true);
      const newUrls: string[] = [];
      try {
        for (let i = 0; i < imageFiles.length; i++) {
          setProgress(`Enviando ${i + 1}/${imageFiles.length}...`);
          const url = await uploadImage(imageFiles[i]);
          newUrls.push(url);
        }
        onMultipleChange(newUrls);
      } catch (err) {
        console.error('Upload error:', err);
        alert('Erro ao enviar imagens. Verifique sua conexão e tente novamente.');
      } finally {
        setUploading(false);
        setProgress('');
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
      return;
    }

    // Single image upload
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido.');
      return;
    }

    setUploading(true);
    setProgress('Enviando imagem...');
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Erro ao enviar a imagem. Verifique sua conexão e tente novamente.');
    } finally {
      setUploading(false);
      setProgress('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">{label}</label>
      
      <div 
        onClick={() => !uploading && fileInputRef.current?.click()}
        style={{ aspectRatio: aspectRatio === "video" ? "16/9" : "9/16" }}
        className={`relative rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-6 gap-3 overflow-hidden ${
          uploading
            ? 'cursor-wait border-brand-pink/50 bg-brand-pink/5'
            : value 
              ? 'border-brand-pink/50 bg-brand-pink/5 hover:border-brand-pink cursor-pointer' 
              : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10 cursor-pointer'
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*"
          multiple={multiple || directory}
          {...(directory ? { webkitdirectory: "", directory: "" } as any : {})}
        />

        {uploading ? (
          <>
            <Loader2 size={32} className="animate-spin text-brand-pink" />
            <p className="font-black text-sm text-white uppercase tracking-tight text-center">{progress}</p>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Aguarde...</p>
          </>
        ) : value ? (
          <>
            <img 
              src={value} 
              alt="Preview" 
              className="absolute inset-0 w-full h-full object-cover" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
              <Upload size={32} className="mb-2" />
              <span className="font-black text-sm uppercase">Trocar Imagem</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:scale-110 transition-all shadow-xl z-30"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-500 mb-2">
              <ImageIcon size={32} />
            </div>
            <div className="text-center">
              <p className="font-black text-sm text-white uppercase tracking-tight">Upload de Imagem</p>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">
                {multiple || directory ? 'Clique para selecionar Vários/Pasta' : 'Clique ou arraste'}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

