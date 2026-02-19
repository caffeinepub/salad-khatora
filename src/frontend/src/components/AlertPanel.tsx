import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Clock, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// TODO: Replace with actual data from backend once available
const mockAlerts = {
  lowStock: [
    { name: 'Lettuce', currentQuantity: 800, threshold: 1000, unit: 'grams' },
    { name: 'Tomatoes', currentQuantity: 450, threshold: 500, unit: 'grams' },
  ],
  expiringSubscriptions: [
    { customerName: 'Rajesh Kumar', planType: 'Monthly', daysRemaining: 2, phoneNumber: '9876543210' },
    { customerName: 'Priya Sharma', planType: 'Weekly', daysRemaining: 1, phoneNumber: '9876543211' },
  ],
};

export default function AlertPanel() {
  const totalAlerts = mockAlerts.lowStock.length + mockAlerts.expiringSubscriptions.length;

  if (totalAlerts === 0) {
    return null;
  }

  return (
    <Card className="border-warning/50 bg-warning/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Active Alerts
          </CardTitle>
          <Badge variant="destructive">{totalAlerts}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Low Stock Alerts */}
        {mockAlerts.lowStock.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Package className="h-4 w-4" />
              Low Stock Ingredients
            </h3>
            {mockAlerts.lowStock.map((item, index) => (
              <Alert key={index} variant="destructive">
                <AlertDescription>
                  <span className="font-medium">{item.name}</span> is running low:{' '}
                  <span className="font-semibold">
                    {item.currentQuantity} {item.unit}
                  </span>{' '}
                  (threshold: {item.threshold} {item.unit})
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Expiring Subscriptions */}
        {mockAlerts.expiringSubscriptions.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Subscriptions Ending Soon
            </h3>
            {mockAlerts.expiringSubscriptions.map((sub, index) => (
              <Alert key={index}>
                <AlertDescription>
                  <span className="font-medium">{sub.customerName}</span> ({sub.phoneNumber}) -{' '}
                  <span className="font-semibold">{sub.planType} Plan</span> expires in{' '}
                  <span className="font-semibold text-warning">{sub.daysRemaining} day(s)</span>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Email Notification Placeholder */}
        {/* 
          TODO: Future email notification integration
          When backend supports email notifications, implement here:
          - Configure email service (SendGrid, AWS SES, etc.)
          - Add email preferences in user settings
          - Send automated alerts for low stock and expiring subscriptions
          - Add email templates for professional notifications
        */}
      </CardContent>
    </Card>
  );
}
