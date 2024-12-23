import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Home, Wrench } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
}

const StatsCard = ({
  title = "Metric",
  value = "0",
  change = 0,
  icon = <Home className="h-4 w-4" />,
}: StatsCardProps) => {
  const isPositive = change >= 0;

  return (
    <Card className="bg-white">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="p-2 bg-gray-100 rounded-lg">{icon}</div>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="flex items-center justify-between mt-2">
            <h3 className="text-2xl font-bold">{value}</h3>
            <div
              className={`flex items-center ${isPositive ? "text-green-600" : "text-red-600"}`}
            >
              <span className="text-sm font-medium">
                {isPositive ? "+" : ""}
                {change}%
              </span>
              {isPositive ? (
                <ArrowUpRight className="h-4 w-4 ml-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 ml-1" />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface StatsOverviewProps {
  stats?: {
    occupancy: {
      value: number;
      change: number;
    };
    revenue: {
      value: number;
      change: number;
    };
    maintenance: {
      value: number;
      change: number;
    };
    properties: {
      value: number;
      change: number;
    };
  };
}

const StatsOverview = ({
  stats = {
    occupancy: { value: 85, change: 2.5 },
    revenue: { value: 125000, change: 12.3 },
    maintenance: { value: 24, change: -5.2 },
    properties: { value: 45, change: 4.8 },
  },
}: StatsOverviewProps) => {
  return (
    <div className="w-full bg-gray-50 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Properties"
          value={stats.properties.value}
          change={stats.properties.change}
          icon={<Home className="h-4 w-4" />}
        />
        <StatsCard
          title="Occupancy Rate"
          value={`${stats.occupancy.value}%`}
          change={stats.occupancy.change}
          icon={<ArrowUpRight className="h-4 w-4" />}
        />
        <StatsCard
          title="Monthly Revenue"
          value={`$${stats.revenue.value.toLocaleString()}`}
          change={stats.revenue.change}
          icon={<ArrowUpRight className="h-4 w-4" />}
        />
        <StatsCard
          title="Maintenance Requests"
          value={stats.maintenance.value}
          change={stats.maintenance.change}
          icon={<Wrench className="h-4 w-4" />}
        />
      </div>
    </div>
  );
};

export default StatsOverview;
