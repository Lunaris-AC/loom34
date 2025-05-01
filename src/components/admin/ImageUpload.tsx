import { useState } from 'react';
import { ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
  defaultImage?: string;
}

export function ImageUpload({ onImageUploaded, defaultImage }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(defaultImage || 'https://placehold.co/600x400?text=Image');
  const { user } = useAuth();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    await handleFileUpload(file);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await handleFileUpload(file);
  };

  const handleFileUpload = async (file: File) => {
    if (!user?.id) {
      toast.error("Utilisateur non connecté");
      return;
    }

    // Vérifier la taille du fichier (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Le fichier est trop volumineux (max 10MB)");
      return;
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast.error("Le fichier doit être une image");
      return;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${user.id}/uploads/${fileName}`;

    try {
      // Upload vers le stockage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Erreur upload:', uploadError);
        throw new Error(`Erreur lors de l'upload: ${uploadError.message}`);
      }

      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setPreviewUrl(publicUrl);
      onImageUploaded(publicUrl);
      toast.success("Image téléchargée avec succès");

    } catch (error: any) {
      console.error('Erreur dans le processus d\'upload:', error);
      toast.error(error.message || "Erreur lors de l'upload de l'image");
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`min-h-[200px] border-2 border-dashed rounded-lg p-4 ${
          isDragging ? 'bg-gray-50 border-gray-400' : 'border-gray-200'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-40 mx-auto mb-4 rounded-lg"
            />
            <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              Glissez-déposez votre image ici
            </p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="file-upload"
              onChange={handleFileInput}
            />
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              Ou sélectionnez une image
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 