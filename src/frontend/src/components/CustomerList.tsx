import { useState } from 'react';
import { useAllCustomers, useDeleteCustomer } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Loader2 } from 'lucide-react';
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

export default function CustomerList() {
  const { data: customers, isLoading } = useAllCustomers();
  const deleteCustomerMutation = useDeleteCustomer();
  const [customerToDelete, setCustomerToDelete] = useState<bigint | null>(null);

  const handleDelete = async () => {
    if (customerToDelete !== null) {
      await deleteCustomerMutation.mutateAsync(customerToDelete);
      setCustomerToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-fresh-600" />
      </div>
    );
  }

  if (!customers || customers.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No customers found. Add your first customer above.
      </div>
    );
  }

  return (
    <>
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Preferences</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>BMI</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map(([id, customer]) => (
              <TableRow key={id.toString()}>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.email || '-'}</TableCell>
                <TableCell className="max-w-xs truncate">{customer.address || '-'}</TableCell>
                <TableCell className="max-w-xs truncate">{customer.preferences || '-'}</TableCell>
                <TableCell>{customer.gender}</TableCell>
                <TableCell>{customer.age.toString()}</TableCell>
                <TableCell>{customer.calculatedBMI.toFixed(1)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCustomerToDelete(id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={customerToDelete !== null} onOpenChange={() => setCustomerToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Customer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this customer? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
