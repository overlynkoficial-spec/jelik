
import React from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (multiple || directory) {
      if (!onMultipleChange) return;
      
      const newImages: string[] = [];
      const imageFiles = (Array.from(files) as File[]).filter(f => f.type.startsWith('image/'));
      
      if (imageFiles.length === 0) {
        alert('Nenhuma imagem válida encontrada.');
        return;
      }

      for (const file of imageFiles) {
        // Limit size for stability
        if (file.size > 5 * 1024 * 1024) continue;

        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        newImages.push(base64);
      }
      
      onMultipleChange(newImages);
      // Reset input so same files can be picked again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const file = files[0];
    // Validate if it's an image
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido.');
      return;
    }

    // Limit size to ~5MB for Base64/localStorage stability
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem é muito grande. Por favor, escolha uma menor que 5MB para o teste local.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">{label}</label>
      
      <div 
        onClick={() => fileInputRef.current?.click()}
        style={{ aspectRatio: aspectRatio === "video" ? "16/9" : "9/16" }}
        className={`relative rounded-3xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-6 gap-3 overflow-hidden ${
          value 
            ? 'border-brand-pink/50 bg-brand-pink/5 hover:border-brand-pink' 
            : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
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

        {value ? (
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

