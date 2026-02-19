import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { StockTransaction } from '../backend';
import { StockTransactionType } from '../backend';

interface StockTransactionTableProps {
  transactions: StockTransaction[];
}

export default function StockTransactionTable({ transactions }: StockTransactionTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No transactions recorded yet.
      </div>
    );
  }

  // Sort transactions by date in descending order (most recent first)
  const sortedTransactions = [...transactions].sort((a, b) => {
    return Number(b.date) - Number(a.date);
  });

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000); // Convert nanoseconds to milliseconds
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionTypeBadge = (type: StockTransactionType) => {
    switch (type) {
      case StockTransactionType.stockIn:
        return <Badge variant="outline" className="bg-fresh-50 dark:bg-fresh-900/20 text-fresh-700 dark:text-fresh-400 border-fresh-200 dark:border-fresh-800">Stock In</Badge>;
      case StockTransactionType.stockOut:
        return <Badge variant="outline" className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800">Stock Out</Badge>;
      case StockTransactionType.writeOff:
        return <Badge variant="destructive">Write Off</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="overflow-x-auto">
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
          {sortedTransactions.map((transaction) => (
            <TableRow key={Number(transaction.transactionId)}>
              <TableCell className="whitespace-nowrap">{formatDate(transaction.date)}</TableCell>
              <TableCell className="font-medium">{transaction.ingredientName}</TableCell>
              <TableCell>
                {Number(transaction.quantity)} {transaction.unitType}
              </TableCell>
              <TableCell>{getTransactionTypeBadge(transaction.transactionType)}</TableCell>
              <TableCell>{transaction.reason || '-'}</TableCell>
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
