import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Upload, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useBulkUploadProducts } from '../hooks/useQueries';
import { parseCSV, generateCSVTemplate, type ParsedProduct } from '../utils/csvParser';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BulkUploadDialog({ open, onOpenChange }: BulkUploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedProducts, setParsedProducts] = useState<ParsedProduct[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'complete'>('idle');
  const [uploadResults, setUploadResults] = useState<{ success: number; failed: number }>({ success: 0, failed: 0 });

  const bulkUploadMutation = useBulkUploadProducts();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const parsed = parseCSV(text);
        setParsedProducts(parsed);
      };
      reader.readAsText(file);
    }
  };

  const handleDownloadTemplate = () => {
    generateCSVTemplate();
  };

  const handleUpload = async () => {
    const validProducts = parsedProducts.filter(p => p.isValid);
    if (validProducts.length === 0) return;

    setUploadStatus('uploading');
    setUploadProgress(0);

    try {
      const products = validProducts.map(p => p.product!);
      const uploadedCount = await bulkUploadMutation.mutateAsync(products);
      
      setUploadProgress(100);
      setUploadStatus('complete');
      setUploadResults({
        success: Number(uploadedCount),
        failed: parsedProducts.length - Number(uploadedCount),
      });

      // Reset after 3 seconds
      setTimeout(() => {
        handleReset();
        onOpenChange(false);
      }, 3000);
    } catch (error) {
      setUploadStatus('idle');
      setUploadProgress(0);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setParsedProducts([]);
    setUploadProgress(0);
    setUploadStatus('idle');
    setUploadResults({ success: 0, failed: 0 });
  };

  const validCount = parsedProducts.filter(p => p.isValid).length;
  const invalidCount = parsedProducts.filter(p => !p.isValid).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Bulk Upload Menu Items</DialogTitle>
          <DialogDescription>
            Upload multiple menu items at once using a CSV file
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="csv" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="csv">CSV Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="csv" className="flex-1 flex flex-col overflow-hidden space-y-4">
            {uploadStatus === 'idle' && (
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="csv-file">Select CSV File</Label>
                      <p className="text-sm text-muted-foreground">
                        Upload a CSV file with your menu items
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadTemplate}
                      className="border-fresh-600 text-fresh-600 hover:bg-fresh-50"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Template
                    </Button>
                  </div>

                  <Input
                    id="csv-file"
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="cursor-pointer"
                  />

                  {selectedFile && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        File selected: <strong>{selectedFile.name}</strong>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {parsedProducts.length > 0 && (
                  <>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex gap-4">
                        <Badge variant="default" className="bg-fresh-600">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          {validCount} Valid
                        </Badge>
                        {invalidCount > 0 && (
                          <Badge variant="destructive">
                            <XCircle className="mr-1 h-3 w-3" />
                            {invalidCount} Invalid
                          </Badge>
                        )}
                      </div>
                    </div>

                    <ScrollArea className="flex-1 border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">Status</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Bowl Type</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Calories</TableHead>
                            <TableHead>Error</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {parsedProducts.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                {item.isValid ? (
                                  <CheckCircle2 className="h-4 w-4 text-fresh-600" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-destructive" />
                                )}
                              </TableCell>
                              <TableCell className="font-medium">{item.product?.name || '-'}</TableCell>
                              <TableCell>{item.product?.category || '-'}</TableCell>
                              <TableCell>{item.product?.bowlType || '-'}</TableCell>
                              <TableCell>{item.product?.price ? `₹${item.product.price}` : '-'}</TableCell>
                              <TableCell>{item.product?.calories || '-'}</TableCell>
                              <TableCell className="text-destructive text-sm">
                                {item.error || '-'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={handleReset}>
                        Reset
                      </Button>
                      <Button
                        onClick={handleUpload}
                        disabled={validCount === 0 || bulkUploadMutation.isPending}
                        className="bg-fresh-600 hover:bg-fresh-700"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload {validCount} Item{validCount !== 1 ? 's' : ''}
                      </Button>
                    </div>
                  </>
                )}
              </>
            )}

            {uploadStatus === 'uploading' && (
              <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                <Upload className="h-12 w-12 text-fresh-600 animate-pulse" />
                <div className="w-full max-w-md space-y-2">
                  <p className="text-center text-sm text-muted-foreground">
                    Uploading products...
                  </p>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              </div>
            )}

            {uploadStatus === 'complete' && (
              <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                <CheckCircle2 className="h-16 w-16 text-fresh-600" />
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">Upload Complete!</h3>
                  <p className="text-muted-foreground">
                    Successfully uploaded {uploadResults.success} menu item{uploadResults.success !== 1 ? 's' : ''}
                  </p>
                  {uploadResults.failed > 0 && (
                    <p className="text-destructive text-sm">
                      {uploadResults.failed} item{uploadResults.failed !== 1 ? 's' : ''} failed to upload
                    </p>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
