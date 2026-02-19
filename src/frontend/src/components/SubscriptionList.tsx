import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { useAllSubscriptions, useDeleteSubscription } from '../hooks/useQueries';
import { SaladBowlType } from '../backend';
import { useState } from 'react';
import EditSubscriptionDialog from './EditSubscriptionDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

function formatBowlSize(bowlType: SaladBowlType): string {
  switch (bowlType) {
    case SaladBowlType.gm250:
      return '250gm';
    case SaladBowlType.gm350:
      return '350gm';
    case SaladBowlType.gm500:
      return '500gm';
    case SaladBowlType.custom:
      return 'Custom';
    default:
      return 'Unknown';
  }
}

export default function SubscriptionList() {
  const { data: subscriptions, isLoading } = useAllSubscriptions();
  const deleteSubscription = useDeleteSubscription();
  const [editingSubscription, setEditingSubscription] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subscriptionToDelete, setSubscriptionToDelete] = useState<bigint | null>(null);

  const today = new Date();

  const handleDeleteClick = (id: bigint) => {
    setSubscriptionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (subscriptionToDelete === null) return;

    try {
      await deleteSubscription.mutateAsync(subscriptionToDelete);
      toast.success('Subscription deleted successfully');
      setDeleteDialogOpen(false);
      setSubscriptionToDelete(null);
    } catch (error) {
      toast.error('Failed to delete subscription');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-fresh-600" />
      </div>
    );
  }

  if (!subscriptions || subscriptions.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No subscriptions found. Add your first subscription above.
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {subscriptions.map((subscription) => {
          const endDate = new Date(Number(subscription.endDate) / 1000000);
          const daysRemaining = differenceInDays(endDate, today);
          const isExpiringSoon = daysRemaining <= 2 && daysRemaining >= 0;
          const isExpired = daysRemaining < 0;
          const isActive = !isExpired;

          return (
            <Card key={subscription.id.toString()} className={isExpiringSoon ? 'border-warning' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{subscription.name}</CardTitle>
                    <p className="text-base font-medium mt-1">{subscription.customerName}</p>
                    <p className="text-sm text-muted-foreground">{subscription.phoneNumber}</p>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    {isActive ? (
                      <Badge className="bg-fresh-100 dark:bg-fresh-900/20 text-fresh-700 dark:text-fresh-400 border-fresh-200 dark:border-fresh-800">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Expired</Badge>
                    )}
                    {isExpiringSoon && (
                      <Badge variant="outline" className="text-warning border-warning">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {daysRemaining}d left
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Plan</p>
                    <p className="font-medium">{subscription.planType}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Bowl Size</p>
                    <p className="font-medium">{formatBowlSize(subscription.bowlSize)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Price</p>
                    <p className="font-medium">₹{subscription.price.toString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Payment</p>
                    <Badge
                      variant={subscription.isPaid ? 'outline' : 'destructive'}
                      className="text-xs"
                    >
                      {subscription.isPaid ? 'Paid' : 'Pending'}
                    </Badge>
                  </div>
                </div>

                <div className="text-sm">
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium">
                    {format(new Date(Number(subscription.startDate) / 1000000), 'dd MMM')} -{' '}
                    {format(endDate, 'dd MMM yyyy')}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {subscription.remainingDeliveries.toString()} deliveries remaining
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setEditingSubscription(subscription)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteClick(subscription.id)}
                    disabled={deleteSubscription.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {editingSubscription && (
        <EditSubscriptionDialog
          subscription={editingSubscription}
          open={!!editingSubscription}
          onOpenChange={(open) => !open && setEditingSubscription(null)}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this subscription. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
