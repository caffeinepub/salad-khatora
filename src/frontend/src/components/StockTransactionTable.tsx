import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { StockTransaction } from '../backend';

interface StockTransactionTableProps {
  transactions: Array<[bigint, StockTransaction]>;
}

export default function StockTransactionTable({ transactions }: StockTransactionTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground bg-card rounded-lg border border-border">
        No transactions recorded yet.
      </div>
    );
  }

  const sortedTransactions = [...transactions].sort(
    (a, b) => Number(b[1].date) - Number(a[1].date)
  );

  const getTransactionTypeBadge = (type: any) => {
    if ('stockIn' in type) {
      return <Badge className="bg-green-600">Stock In</Badge>;
    } else if ('stockOut' in type) {
      return <Badge className="bg-blue-600">Stock Out</Badge>;
    } else if ('writeOff' in type) {
      return <Badge className="bg-red-600">Write Off</Badge>;
    }
    return <Badge>Unknown</Badge>;
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Ingredient</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Cost Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTransactions.map(([id, transaction]) => (
            <TableRow key={id.toString()}>
              <TableCell>
                {new Date(Number(transaction.date) / 1000000).toLocaleDateString()}
              </TableCell>
              <TableCell className="font-medium">{transaction.ingredientName}</TableCell>
              <TableCell>
                {transaction.quantity.toString()} {transaction.unitType}
              </TableCell>
              <TableCell>{getTransactionTypeBadge(transaction.transactionType)}</TableCell>
              <TableCell className="max-w-xs truncate">{transaction.reason || '-'}</TableCell>
              <TableCell>{transaction.supplier || '-'}</TableCell>
              <TableCell>
                {transaction.costPrice ? `₹${Number(transaction.costPrice)}` : '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
