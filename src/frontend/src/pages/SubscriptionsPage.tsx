import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Printer } from 'lucide-react';
import SubscriptionForm from '../components/SubscriptionForm';
import SubscriptionList from '../components/SubscriptionList';
import KOTPrintView from '../components/KOTPrintView';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function SubscriptionsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);

  const handlePrintKOT = () => {
    setIsPrintDialogOpen(true);
    // Delay print to ensure content is rendered
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Subscription Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage customer subscriptions and plans
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="border-fresh-600 text-fresh-700 hover:bg-fresh-50 dark:hover:bg-fresh-900/20"
            onClick={handlePrintKOT}
          >
            <Printer className="mr-2 h-4 w-4" />
            Print KOT
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-fresh-600 hover:bg-fresh-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Subscription
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Subscription</DialogTitle>
              </DialogHeader>
              <SubscriptionForm onSuccess={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <SubscriptionList />

      {/* Hidden print dialog */}
      <Dialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Kitchen Order Ticket Preview</DialogTitle>
          </DialogHeader>
          <KOTPrintView />
        </DialogContent>
      </Dialog>
    </div>
  );
}
