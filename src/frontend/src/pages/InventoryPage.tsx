import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StockInTab from '../components/StockInTab';
import StockOutTab from '../components/StockOutTab';
import WriteOffTab from '../components/WriteOffTab';
import StockStatusTab from '../components/StockStatusTab';

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage your ingredients and track stock levels
        </p>
      </div>

      <Tabs defaultValue="stock-status" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="stock-status">Stock Status</TabsTrigger>
          <TabsTrigger value="stock-in">Stock In</TabsTrigger>
          <TabsTrigger value="stock-out">Stock Out</TabsTrigger>
          <TabsTrigger value="write-off">Write Off</TabsTrigger>
        </TabsList>

        <TabsContent value="stock-status" className="mt-6">
          <StockStatusTab />
        </TabsContent>

        <TabsContent value="stock-in" className="mt-6">
          <StockInTab />
        </TabsContent>

        <TabsContent value="stock-out" className="mt-6">
          <StockOutTab />
        </TabsContent>

        <TabsContent value="write-off" className="mt-6">
          <WriteOffTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
