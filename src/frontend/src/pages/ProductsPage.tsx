import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, AlertCircle } from 'lucide-react';
import BulkUploadDialog from '../components/BulkUploadDialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ProductsPage() {
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Menu Items</h1>
          <p className="text-muted-foreground mt-1">
            Bulk upload menu items using CSV
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="border-fresh-600 text-fresh-600 hover:bg-fresh-50"
            onClick={() => setIsBulkUploadOpen(true)}
          >
            <Upload className="mr-2 h-4 w-4" />
            Bulk Add
          </Button>
        </div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Limited Functionality</AlertTitle>
        <AlertDescription>
          Currently, only bulk upload functionality is available. Use the "Bulk Add" button to upload multiple menu items via CSV.
        </AlertDescription>
      </Alert>
      
      <BulkUploadDialog 
        open={isBulkUploadOpen} 
        onOpenChange={setIsBulkUploadOpen} 
      />
    </div>
  );
}
