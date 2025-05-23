import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface GalleryUploadProgressProps {
  open: boolean;
  current: number;
  total: number;
  percent: number;
  onClose?: () => void;
  errors?: string[];
}

export const GalleryUploadProgress: React.FC<GalleryUploadProgressProps> = ({
  open,
  current,
  total,
  percent,
  onClose,
  errors = [],
}) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="max-w-md w-full">
      <div className="space-y-4">
        <div className="text-lg font-semibold">Importation des images</div>
        <Progress value={percent} />
        <div className="text-sm text-gray-600 text-center">
          {current} / {total} photos importées
        </div>
        {errors.length > 0 && (
          <div className="text-xs text-red-500 mt-2">
            {errors.map((err, i) => (
              <div key={i}>{err}</div>
            ))}
          </div>
        )}
      </div>
    </DialogContent>
  </Dialog>
);
