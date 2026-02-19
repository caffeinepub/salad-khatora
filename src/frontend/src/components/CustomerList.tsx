import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import type { Customer } from '../backend';

interface CustomerListProps {
  customers: Customer[];
  selectedCustomers: bigint[];
  onSelectCustomer: (customerId: bigint, checked: boolean) => void;
  isLoading?: boolean;
}

export default function CustomerList({ customers, selectedCustomers, onSelectCustomer, isLoading }: CustomerListProps) {
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Select</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Contact Details</TableHead>
            <TableHead>Preferences</TableHead>
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
              <TableCell className="font-mono text-sm">{customer.id.toString()}</TableCell>
              <TableCell className="font-medium">{customer.name}</TableCell>
              <TableCell>{customer.contactDetails}</TableCell>
              <TableCell>
                {customer.preferences ? (
                  <Badge variant="outline">{customer.preferences}</Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">None</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
