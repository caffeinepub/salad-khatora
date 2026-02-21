import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BillingForm from '../components/BillingForm';
import InvoiceList from '../components/InvoiceList';

export default function BillingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Billing</h1>
        <p className="text-muted-foreground mt-2">Create invoices and view billing history</p>
      </div>

      <Tabs defaultValue="new-invoice" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="new-invoice">New Invoice</TabsTrigger>
          <TabsTrigger value="history">Invoice History</TabsTrigger>
        </TabsList>

        <TabsContent value="new-invoice" className="mt-6">
          <BillingForm />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <InvoiceList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
