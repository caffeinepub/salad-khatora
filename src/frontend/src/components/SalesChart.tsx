import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// TODO: Replace with actual data from backend once available
const mockDailyData = [
  { name: 'Mon', sales: 4200, profit: 1680 },
  { name: 'Tue', sales: 3800, profit: 1520 },
  { name: 'Wed', sales: 5100, profit: 2040 },
  { name: 'Thu', sales: 4600, profit: 1840 },
  { name: 'Fri', sales: 5800, profit: 2320 },
  { name: 'Sat', sales: 6200, profit: 2480 },
  { name: 'Sun', sales: 5300, profit: 2120 },
];

const mockWeeklyData = [
  { name: 'Week 1', sales: 28000, profit: 11200 },
  { name: 'Week 2', sales: 32000, profit: 12800 },
  { name: 'Week 3', sales: 29500, profit: 11800 },
  { name: 'Week 4', sales: 35000, profit: 14000 },
];

const mockMonthlyData = [
  { name: 'Jan', sales: 95000, profit: 38000 },
  { name: 'Feb', sales: 105000, profit: 42000 },
  { name: 'Mar', sales: 120000, profit: 48000 },
  { name: 'Apr', sales: 115000, profit: 46000 },
  { name: 'May', sales: 130000, profit: 52000 },
  { name: 'Jun', sales: 125000, profit: 50000 },
];

export default function SalesChart() {
  return (
    <Tabs defaultValue="daily" className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-3">
        <TabsTrigger value="daily">Daily</TabsTrigger>
        <TabsTrigger value="weekly">Weekly</TabsTrigger>
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
      </TabsList>

      <TabsContent value="daily" className="mt-6">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={mockDailyData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Sales (₹)" />
            <Line type="monotone" dataKey="profit" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Profit (₹)" />
          </LineChart>
        </ResponsiveContainer>
      </TabsContent>

      <TabsContent value="weekly" className="mt-6">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={mockWeeklyData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="sales" fill="hsl(var(--chart-1))" name="Sales (₹)" />
            <Bar dataKey="profit" fill="hsl(var(--chart-2))" name="Profit (₹)" />
          </BarChart>
        </ResponsiveContainer>
      </TabsContent>

      <TabsContent value="monthly" className="mt-6">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={mockMonthlyData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Sales (₹)" />
            <Line type="monotone" dataKey="profit" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Profit (₹)" />
          </LineChart>
        </ResponsiveContainer>
      </TabsContent>
    </Tabs>
  );
}
