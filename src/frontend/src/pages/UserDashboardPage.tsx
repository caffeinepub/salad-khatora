import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, UtensilsCrossed, Package } from 'lucide-react';
import UserProfileSection from '../components/UserProfileSection';
import UserMenuSection from '../components/UserMenuSection';
import UserOrdersSection from '../components/UserOrdersSection';

export default function UserDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
        <p className="text-muted-foreground">Manage your profile, browse menu, and track orders</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="menu" className="gap-2">
            <UtensilsCrossed className="h-4 w-4" />
            <span className="hidden sm:inline">Menu</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Orders</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <UserProfileSection />
        </TabsContent>

        <TabsContent value="menu">
          <UserMenuSection />
        </TabsContent>

        <TabsContent value="orders">
          <UserOrdersSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
