"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Trophy } from 'lucide-react';

interface StatsData {
  total: number;
  completed: number;
  avgRating: number;
  topFavorites: Array<{ id: string; title: string; rating: number }>;
}

interface StatsCardsProps {
  refreshTrigger?: number;
}

export function StatsCards({ refreshTrigger }: StatsCardsProps) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const res = await fetch('/api/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="rounded-2xl shadow hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Anime</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground mt-1">
            In your collection
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.completed}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Avg Rating: <span className="font-semibold">{stats.avgRating.toFixed(1)}/10</span>
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Favorites</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {stats.topFavorites.length > 0 ? (
            <div className="space-y-2">
              {stats.topFavorites.map((anime) => (
                <div key={anime.id} className="flex items-center justify-between text-sm">
                  <span className="truncate flex-1 mr-2">{anime.title}</span>
                  <Badge variant="secondary" className="text-xs">
                    {anime.rating}/10
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No favorites yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
