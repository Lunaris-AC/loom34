
import {
  DialogHeader as ShadcnDialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface DialogHeaderProps {
  title: string;
  description?: string;
}

export function DialogHeader({ title, description }: DialogHeaderProps) {
  return (
    <ShadcnDialogHeader className="space-y-1">
      <DialogTitle className="text-2xl font-semibold tracking-tight">{title}</DialogTitle>
      {description && (
        <DialogDescription className="text-muted-foreground">
          {description}
        </DialogDescription>
      )}
    </ShadcnDialogHeader>
  );
}
