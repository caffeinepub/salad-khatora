import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Users, Send, UserPlus } from 'lucide-react';
import CustomerList from '../components/CustomerList';
import CustomerForm from '../components/CustomerForm';
import NotificationDialog from '../components/NotificationDialog';
import { useCustomers } from '../hooks/useQueries';

export default function CustomersPage() {
  const [selectedCustomers, setSelectedCustomers] = useState<bigint[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const { data: customers = [], isLoading } = useCustomers();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCustomers(customers.map(c => c.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (customerId: bigint, checked: boolean) => {
    if (checked) {
      setSelectedCustomers([...selectedCustomers, customerId]);
    } else {
      setSelectedCustomers(selectedCustomers.filter(id => id !== customerId));
    }
  };

  const handleSendNotification = () => {
    if (selectedCustomers.length === 0) {
      return;
    }
    setShowNotificationDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Customer Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage customer data and send notifications
          </p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-fresh-600 hover:bg-fresh-700">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomerForm onSuccess={() => setShowAddForm(false)} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Customer List
              </CardTitle>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="select-all"
                  checked={selectedCustomers.length === customers.length && customers.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <label htmlFor="select-all" className="text-sm text-muted-foreground cursor-pointer">
                  Select All
                </label>
              </div>
            </div>
            <Button
              onClick={handleSendNotification}
              disabled={selectedCustomers.length === 0}
              variant="outline"
            >
              <Send className="h-4 w-4 mr-2" />
              Send Notification ({selectedCustomers.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <CustomerList
            customers={customers}
            selectedCustomers={selectedCustomers}
            onSelectCustomer={handleSelectCustomer}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {showNotificationDialog && (
        <NotificationDialog
          open={showNotificationDialog}
          onOpenChange={setShowNotificationDialog}
          selectedCustomers={customers.filter(c => selectedCustomers.includes(c.id))}
          onSuccess={() => {
            setShowNotificationDialog(false);
            setSelectedCustomers([]);
          }}
        />
      )}
    </div>
  );
}
