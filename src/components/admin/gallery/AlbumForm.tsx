
import { useState } from "react";
import { DialogHeader } from "@/components/admin/DialogHeader";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogClose } from "@radix-ui/react-dialog";

interface AlbumFormProps {
  defaultValues?: {
    title: string;
    description: string;
    cover_image: string;
    date: string;
  };
  onSubmit: (data: {
    title: string;
    description: string;
    cover_image: string;
    date: string;
  }) => Promise<void>;
  isCreating?: boolean;
}

export function AlbumForm({ defaultValues, onSubmit, isCreating = true }: AlbumFormProps) {
  const [formData, setFormData] = useState({
    title: defaultValues?.title ?? "",
    description: defaultValues?.description ?? "",
    cover_image: defaultValues?.cover_image ?? "https://placehold.co/600x400?text=Album+Cover",
    date: defaultValues?.date ?? new Date().toISOString().split('T')[0]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    await onSubmit(formData);
  };

  return (
    <>
      <DialogHeader
        title={isCreating ? "Create New Album" : "Edit Album"}
      />
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="title" className="text-right">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="col-span-3"
            placeholder="Album title"
          />
        </div>
        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="description" className="text-right pt-2">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="col-span-3"
            placeholder="Album description (optional)"
            rows={3}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="cover_image" className="text-right">Cover Image URL</Label>
          <Input
            id="cover_image"
            name="cover_image"
            value={formData.cover_image}
            onChange={handleInputChange}
            className="col-span-3"
            placeholder="URL to album cover image"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="date" className="text-right">Date</Label>
          <Input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button onClick={handleSubmit}>
            {isCreating ? "Create Album" : "Update Album"}
          </Button>
        </DialogClose>
      </DialogFooter>
    </>
  );
}
