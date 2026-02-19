import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, ShoppingCart, Package, Wallet, TrendingDown } from 'lucide-react';
import { useAnalyticsMetrics } from '../hooks/useQueries';

export default function DashboardMetrics() {
  const { data: metrics, isLoading } = useAnalyticsMetrics();

  const formatCurrency = (value: bigint | number | undefined) => {
    if (value === undefined) return '₹0';
    return `₹${Number(value).toLocaleString('en-IN')}`;
  };

  const metricsData = [
    {
      title: 'Daily Sales',
      value: formatCurrency(metrics?.dailySales),
      icon: DollarSign,
      color: 'text-fresh-600',
      bgColor: 'bg-fresh-100 dark:bg-fresh-900/20',
    },
    {
      title: 'Weekly Sales',
      value: formatCurrency(metrics?.weeklySales),
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Monthly Sales',
      value: formatCurrency(metrics?.monthlySales),
      icon: ShoppingCart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      title: 'Cash Flow',
      value: formatCurrency(metrics?.cashFlow),
      icon: Wallet,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    },
    {
      title: 'Daily Expenses',
      value: formatCurrency(metrics?.dailyExpenses),
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {metricsData.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
