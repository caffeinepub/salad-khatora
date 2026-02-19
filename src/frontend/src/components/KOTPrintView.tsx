import { useAllSubscriptions } from '../hooks/useQueries';
import { SaladBowlType } from '../backend';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

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

export default function KOTPrintView() {
  const { data: subscriptions, isLoading } = useAllSubscriptions();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-fresh-600" />
      </div>
    );
  }

  // Filter active subscriptions (not expired)
  const activeSubscriptions = subscriptions?.filter((sub) => {
    const endDate = new Date(Number(sub.endDate) / 1000000);
    return endDate >= new Date();
  }) || [];

  if (activeSubscriptions.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No active subscription plans found.
      </div>
    );
  }

  return (
    <div className="kot-print-container">
      <div className="kot-header">
        <h1 className="kot-title">Kitchen Order Ticket (KOT)</h1>
        <p className="kot-subtitle">Active Subscription Plans</p>
        <p className="kot-date">Date: {format(new Date(), 'dd MMM yyyy, hh:mm a')}</p>
      </div>

      <div className="kot-content">
        <table className="kot-table">
          <thead>
            <tr>
              <th className="kot-th">Subscription Name</th>
              <th className="kot-th">Customer Name</th>
              <th className="kot-th">Bowl Size</th>
              <th className="kot-th">Plan Type</th>
              <th className="kot-th">Remaining</th>
            </tr>
          </thead>
          <tbody>
            {activeSubscriptions.map((subscription) => (
              <tr key={subscription.id.toString()} className="kot-row">
                <td className="kot-td kot-subscription-name">{subscription.name}</td>
                <td className="kot-td kot-customer-name">{subscription.customerName}</td>
                <td className="kot-td kot-bowl-size">{formatBowlSize(subscription.bowlSize)}</td>
                <td className="kot-td kot-plan-type">{subscription.planType}</td>
                <td className="kot-td kot-remaining">{subscription.remainingDeliveries.toString()} days</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="kot-summary">
          <p className="kot-total">Total Active Plans: <strong>{activeSubscriptions.length}</strong></p>
        </div>
      </div>

      <div className="kot-footer">
        <p>Salad Khatora - Fresh & Healthy</p>
        <p className="kot-footer-note">Prepare with care ❤️</p>
      </div>
    </div>
  );
}
