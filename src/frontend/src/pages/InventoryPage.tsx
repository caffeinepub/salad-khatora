import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StockStatusTab from '../components/StockStatusTab';
import StockInTab from '../components/StockInTab';
import StockOutTab from '../components/StockOutTab';
import WriteOffTab from '../components/WriteOffTab';

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage your ingredient inventory, stock transactions, and write-offs
        </p>
      </div>

      <Tabs defaultValue="status" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="status">Stock Status</TabsTrigger>
          <TabsTrigger value="stock-in">Stock In</TabsTrigger>
          <TabsTrigger value="stock-out">Stock Out</TabsTrigger>
          <TabsTrigger value="write-off">Write Off</TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="mt-6">
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
