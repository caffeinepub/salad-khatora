import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AlertPanel from '../components/AlertPanel';
import DashboardMetrics from '../components/DashboardMetrics';
import SalesChart from '../components/SalesChart';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden shadow-lg">
        <img
          src="/assets/generated/salad-hero.dim_1200x400.png"
          alt="Fresh Salad Bowl"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
          <div className="px-6 md:px-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome to Salad Khatora
            </h1>
            <p className="text-white/90 text-sm md:text-base">
              Your business dashboard at a glance
            </p>
          </div>
        </div>
      </div>

      {/* Alert Panel */}
      <AlertPanel />

      {/* Dashboard Metrics */}
      <DashboardMetrics />

      {/* Sales Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sales & Profit Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesChart />
        </CardContent>
      </Card>
    </div>
  );
}
