
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TierStatsProps {
  watchedCount: number;
}

const tiers = [
  { name: 'E', min: 0, max: 10, color: 'text-gray-400' },
  { name: 'D', min: 11, max: 20, color: 'text-blue-400' },
  { name: 'C', min: 21, max: 30, color: 'text-green-400' },
  { name: 'B', min: 31, max: 40, color: 'text-yellow-400' },
  { name: 'A', min: 41, max: 50, color: 'text-orange-400' },
  { name: 'S', min: 51, max: 75, color: 'text-red-400' },
  { name: 'SS', min: 76, max: Infinity, color: 'text-purple-400 font-bold' },
];

const getTier = (count: number) => {
  const tier = tiers.find(t => count >= t.min && count <= t.max);
  // if count is higher than any tier, return the highest tier
  if (!tier) return tiers[tiers.length - 1];
  return tier;
};

export function TierStats({ watchedCount }: TierStatsProps) {
  const tier = getTier(watchedCount);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Your Tier</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          <span className={tier.color}>{tier.name}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          {watchedCount} anime completed
        </p>
      </CardContent>
    </Card>
  );
}
