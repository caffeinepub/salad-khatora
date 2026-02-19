import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

// TODO: Replace with actual data from backend once available
const mockInvoices = [
  {
    id: 'INV-001',
    customerName: 'Rajesh Kumar',
    phoneNumber: '9876543210',
    items: [
      { name: '250gm Bowl', quantity: 2 },
      { name: '350gm Bowl', quantity: 1 },
    ],
    subtotal: 500,
    discount: 20,
    total: 480,
    paymentMode: 'UPI',
    date: new Date(),
  },
  {
    id: 'INV-002',
    customerName: 'Priya Sharma',
    phoneNumber: '9876543211',
    items: [{ name: 'Custom Bowl', quantity: 3 }],
    subtotal: 540,
    discount: 0,
    total: 540,
    paymentMode: 'Cash',
    date: new Date(Date.now() - 86400000),
  },
];

export default function InvoiceList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Invoices</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.customerName}</TableCell>
                  <TableCell>{invoice.phoneNumber}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {invoice.items.map((item, i) => (
                        <div key={i}>
                          {item.name} x{item.quantity}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">₹{invoice.total}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{invoice.paymentMode}</Badge>
                  </TableCell>
                  <TableCell>{format(invoice.date, 'dd MMM yyyy')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
