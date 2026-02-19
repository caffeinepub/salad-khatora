import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet, Package, DollarSign, Users, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export default function ReportsPage() {
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleExport = async (reportType: string) => {
    setIsExporting(reportType);

    try {
      // TODO: Fetch actual data from backend
      let data: any[] = [];
      let filename = '';

      switch (reportType) {
        case 'inventory':
          data = [
            { ingredient: 'Lettuce', quantity: 500, unit: 'grams', cost: 50, supplier: 'Fresh Farms', threshold: 100 },
            { ingredient: 'Tomatoes', quantity: 300, unit: 'grams', cost: 40, supplier: 'Local Market', threshold: 80 },
          ];
          filename = 'inventory_report';
          break;
        case 'sales':
          data = [
            { date: '2026-02-19', customer: 'John Doe', items: 'Classic Bowl x2', total: 300, payment: 'Cash' },
            { date: '2026-02-18', customer: 'Jane Smith', items: 'Premium Bowl x1', total: 200, payment: 'UPI' },
          ];
          filename = 'sales_report';
          break;
        case 'subscriptions':
          data = [
            { customer: 'Rajesh Kumar', plan: 'Monthly', bowlSize: '250gm', price: 3000, status: 'Active', startDate: '2026-02-01', endDate: '2026-02-25' },
            { customer: 'Priya Sharma', plan: 'Weekly', bowlSize: '350gm', price: 800, status: 'Active', startDate: '2026-02-15', endDate: '2026-02-21' },
          ];
          filename = 'subscriptions_report';
          break;
        case 'expenses':
          data = [
            { date: '2026-02-19', category: 'Ingredients', description: 'Fresh vegetables', amount: 500, paymentMode: 'Cash' },
            { date: '2026-02-18', category: 'Utilities', description: 'Electricity bill', amount: 1200, paymentMode: 'Online' },
          ];
          filename = 'expenses_report';
          break;
      }

      exportToCSV(data, filename);
      toast.success(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report exported successfully`);
    } catch (error) {
      toast.error('Failed to export report');
    } finally {
      setIsExporting(null);
    }
  };

  const reports = [
    {
      id: 'inventory',
      title: 'Inventory Report',
      description: 'Complete list of ingredients with stock levels, costs, and suppliers',
      icon: Package,
      color: 'text-fresh-600',
      bgColor: 'bg-fresh-100 dark:bg-fresh-900/20',
    },
    {
      id: 'sales',
      title: 'Sales Report',
      description: 'Detailed sales transactions with customer information and payment modes',
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      id: 'subscriptions',
      title: 'Subscriptions Report',
      description: 'Active and expired subscriptions with customer details and plan information',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      id: 'expenses',
      title: 'Expenses Report',
      description: 'Business expenses categorized by type with payment details',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Download comprehensive business reports for analysis
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${report.bgColor}`}>
                      <Icon className={`h-6 w-6 ${report.color}`} />
                    </div>
                    <div>
                      <CardTitle>{report.title}</CardTitle>
                      <CardDescription className="mt-1">{report.description}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => handleExport(report.id)}
                  disabled={isExporting === report.id}
                  className="w-full bg-fresh-600 hover:bg-fresh-700"
                >
                  {isExporting === report.id ? (
                    <>Exporting...</>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download CSV Report
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Excel Format Coming Soon
          </CardTitle>
          <CardDescription>
            Excel (.xlsx) export functionality will be available in the next update. Currently, reports are available in CSV format which can be opened in Excel.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
