import { CloudUploadIcon, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function RenderEmptyState({ isDragActive }: { isDragActive: boolean }) {
  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-muted mb-4">
        <CloudUploadIcon
          className={cn('size-6 text-muted-foreground', isDragActive && 'text-primary')}
        />
      </div>

      <p className="text-base font-semibold text-muted-foreground">
        {isDragActive ? (
          'Drop the files here...'
        ) : (
          <>
            Drag and drop files here, or{' '}
            <span className="text-primary font-bold cursor-pointer">click to select files</span>
          </>
        )}
      </p>
    </div>
  );
}

export function RenderErrorState() {
  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-destructive/30 mb-4">
        <ImageIcon className={cn('size-6 text-destructive')} />
      </div>

      <p className="text-base font-semibold">Upload Failed</p>
      <p className="text-xs mt-1 text-muted-foreground">Something went wrong</p>
      <p className="text-xl mt-3 text-muted-foreground">Click or drag file to retry</p>
    </div>
  );
}
