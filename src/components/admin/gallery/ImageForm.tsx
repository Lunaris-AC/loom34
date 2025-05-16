import { useState } from "react";
import { DialogHeader } from "@/components/admin/DialogHeader";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogClose } from "@radix-ui/react-dialog";
import { Tables } from "@/integrations/supabase/types";

interface ImageFormProps {
  albums: Tables<'gallery_albums'>[];
  defaultValues?: {
    title: string;
    description: string;
    image_url: string;
    album_id: string;
    category: string;
  };
  onSubmit: (data: {
    title: string;
    description: string;
    image_url: string;
    album_id: string;
    category: string;
  }) => Promise<void>;
  isCreating?: boolean;
}

export function ImageForm({ albums, defaultValues, onSubmit, isCreating = true }: ImageFormProps) {
  const [formData, setFormData] = useState({
    title: defaultValues?.title ?? "",
    description: defaultValues?.description ?? "",
    image_url: defaultValues?.image_url ?? "https://placehold.co/600x400?text=Gallery+Image",
    album_id: defaultValues?.album_id ?? "",
    category: defaultValues?.category ?? "general"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    await onSubmit(formData);
  };

  return (
    <>
      <DialogHeader
        title={isCreating ? "Add New Image" : "Edit Image"}
      />
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="image_title" className="text-right">Title</Label>
          <Input
            id="image_title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="col-span-3"
            placeholder="Image title"
          />
        </div>
        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="image_description" className="text-right pt-2">Description</Label>
          <Textarea
            id="image_description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="col-span-3"
            placeholder="Image description (optional)"
            rows={3}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="image_url" className="text-right">Image URL</Label>
          <Input
            id="image_url"
            name="image_url"
            value={formData.image_url}
            onChange={handleInputChange}
            className="col-span-3"
            placeholder="URL to image"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="album_id" className="text-right">Album</Label>
          <select
            id="album_id"
            name="album_id"
            value={formData.album_id}
            onChange={handleInputChange}
            className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          >
            <option value="">No Album</option>
            {albums.map(album => (
              <option key={album.id} value={album.id}>{album.title}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="category" className="text-right">Category</Label>
          <Input
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="col-span-3"
            placeholder="Image category"
          />
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button variant="brown" className="text-white" onClick={handleSubmit}>
            {isCreating ? "Add Image" : "Update Image"}
          </Button>
        </DialogClose>
      </DialogFooter>
    </>
  );
}
