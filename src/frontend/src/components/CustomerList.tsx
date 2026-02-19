import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import type { Customer } from '../backend';

interface CustomerListProps {
  customers: Customer[];
  selectedCustomers: bigint[];
  onSelectCustomer: (customerId: bigint, checked: boolean) => void;
  onSendIndividualMessage?: (customer: Customer) => void;
  isLoading?: boolean;
}

export default function CustomerList({ 
  customers, 
  selectedCustomers, 
  onSelectCustomer, 
  onSendIndividualMessage,
  isLoading 
}: CustomerListProps) {
  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading customers...
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No customers found. Add your first customer to get started.
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Select</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Preferences</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id.toString()}>
              <TableCell>
                <Checkbox
                  checked={selectedCustomers.includes(customer.id)}
                  onCheckedChange={(checked) => onSelectCustomer(customer.id, checked as boolean)}
                />
              </TableCell>
              <TableCell className="font-medium">{customer.name}</TableCell>
              <TableCell>{customer.phone || '-'}</TableCell>
              <TableCell className="max-w-[200px] truncate" title={customer.email}>
                {customer.email || '-'}
              </TableCell>
              <TableCell className="max-w-[200px] truncate" title={customer.address}>
                {customer.address || '-'}
              </TableCell>
              <TableCell>
                {customer.preferences ? (
                  <div className="max-w-[200px] truncate" title={customer.preferences}>
                    <Badge variant="outline">{customer.preferences}</Badge>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">-</span>
                )}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSendIndividualMessage?.(customer)}
                  title="Send message to this customer"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
