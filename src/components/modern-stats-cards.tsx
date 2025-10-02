'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Film, 
  CheckCircle, 
  Play, 
  Calendar, 
  Star,
  TrendingUp,
  Target,
  Clock
} from 'lucide-react';
import { Card } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  gradient?: string;
  delay?: number;
}

interface AnimeStats {
  total: number;
  completed: number;
  watching: number;
  planToWatch: number;
  averageRating: number;
  totalEpisodes: number;
  hoursWatched: number;
}

const ModernStatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  gradient = 'from-blue-500 to-purple-600',
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay,
        type: 'spring',
        stiffness: 100
      }}
      whileHover={{ 
        y: -4,
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className="card-hover"
    >
      <Card className="glass p-6 relative overflow-hidden group cursor-pointer">
        {/* Background gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
        
        {/* Animated background pattern */}
        <div className="absolute top-0 right-0 w-20 h-20 transform translate-x-6 -translate-y-6">
          <div className={`w-full h-full bg-gradient-to-br ${gradient} rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            
            {change && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + 0.2 }}
                className={`flex items-center text-xs px-2 py-1 rounded-full ${
                  change.type === 'increase' 
                    ? 'text-green-400 bg-green-400/10' 
                    : 'text-red-400 bg-red-400/10'
                }`}
              >
                <TrendingUp className={`w-3 h-3 mr-1 ${change.type === 'decrease' ? 'rotate-180' : ''}`} />
                {change.value > 0 ? '+' : ''}{change.value}%
              </motion.div>
            )}
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.3 }}
          >
            <h3 className="text-3xl font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-primary)] transition-colors duration-300">
              {value}
            </h3>
            <p className="text-sm text-[var(--text-secondary)] font-medium">
              {title}
            </p>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

interface ModernStatsCardsProps {
  stats?: AnimeStats;
}

export function ModernStatsCards({ stats }: ModernStatsCardsProps) {
  // Default stats if none provided
  const defaultStats: AnimeStats = {
    total: 0,
    completed: 0,
    watching: 0,
    planToWatch: 0,
    averageRating: 0,
    totalEpisodes: 0,
    hoursWatched: 0
  };

  const animeStats = stats || defaultStats;

  const statsConfig = [
    {
      title: 'Total Anime',
      value: animeStats.total,
      icon: Film,
      gradient: 'from-purple-500 to-pink-600',
      change: { value: 12, type: 'increase' as const }
    },
    {
      title: 'Completed',
      value: animeStats.completed,
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-600',
      change: { value: 8, type: 'increase' as const }
    },
    {
      title: 'Currently Watching',
      value: animeStats.watching,
      icon: Play,
      gradient: 'from-blue-500 to-cyan-600',
      change: { value: -2, type: 'decrease' as const }
    },
    {
      title: 'Plan to Watch',
      value: animeStats.planToWatch,
      icon: Calendar,
      gradient: 'from-orange-500 to-red-600',
      change: { value: 15, type: 'increase' as const }
    },
    {
      title: 'Average Rating',
      value: animeStats.averageRating > 0 ? `${animeStats.averageRating.toFixed(1)}/10` : '0/10',
      icon: Star,
      gradient: 'from-yellow-500 to-orange-600',
    },
    {
      title: 'Hours Watched',
      value: `${Math.round(animeStats.hoursWatched)}h`,
      icon: Clock,
      gradient: 'from-indigo-500 to-purple-600',
      change: { value: 25, type: 'increase' as const }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {statsConfig.map((stat, index) => (
        <ModernStatsCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          gradient={stat.gradient}
          change={stat.change}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
}

// Welcome section component
export function WelcomeSection() {
  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) return 'Good Morning';
    if (currentHour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-[var(--font-heading)] text-[var(--text-primary)] mb-2">
            {getGreeting()}, Anime Enthusiast! 👋
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            Ready to dive into your anime world? Let's see what you've been up to.
          </p>
        </div>
        
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: 'spring', 
            stiffness: 200, 
            damping: 10,
            delay: 0.3 
          }}
          className="hidden lg:block"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-2xl flex items-center justify-center shadow-lg">
            <Target className="w-10 h-10 text-white" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
