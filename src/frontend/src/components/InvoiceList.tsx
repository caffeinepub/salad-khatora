import { useAllInvoices } from '../hooks/useQueries';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function InvoiceList() {
  const { data: invoices, isLoading } = useAllInvoices();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-fresh-600" />
      </div>
    );
  }

  if (!invoices || invoices.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No invoices found. Create your first invoice.
      </div>
    );
  }

  const sortedInvoices = [...invoices].sort((a, b) => 
    Number(b.timestamp - a.timestamp)
  );

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Payment Mode</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedInvoices.map((invoice, index) => (
            <TableRow key={index}>
              <TableCell>
                {new Date(Number(invoice.timestamp) / 1000000).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </TableCell>
              <TableCell className="font-medium">{invoice.customerName}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  {invoice.itemsOrdered.map(([name, qty], i) => (
                    <div key={i} className="text-sm">
                      {name} × {qty.toString()}
                    </div>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    invoice.paymentMode === 'Cash'
                      ? 'default'
                      : invoice.paymentMode === 'UPI'
                      ? 'secondary'
                      : 'outline'
                  }
                >
                  {invoice.paymentMode}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-semibold">
                ₹{Number(invoice.totalPrice)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
