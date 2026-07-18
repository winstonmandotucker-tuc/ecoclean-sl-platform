import React from 'react';
import { Award, Sparkles, Shield, Users, ChevronRight, Lock, ShieldCheck, Trophy, Landmark } from 'lucide-react';
import { Badge, LeaderboardUser } from '../../lib/citizenData';

interface RewardsStoreProps {
  userPoints: number;
  badges: Badge[];
  leaderboard: LeaderboardUser[];
}

export default function RewardsStore({ userPoints, badges, leaderboard }: RewardsStoreProps) {
  const getBadgeIcon = (iconName: Badge['iconName'], earned: boolean) => {
    const style = earned ? 'text-brand-primary' : 'text-gray-300';
    switch (iconName) {
      case 'Award':
        return <Award className={`w-6 h-6 ${style}`} />;
      case 'Sparkles':
        return <Sparkles className={`w-6 h-6 ${style}`} />;
      case 'Shield':
        return <Shield className={`w-6 h-6 ${style}`} />;
      case 'Users':
        return <Users className={`w-6 h-6 ${style}`} />;
      default:
        return <Award className={`w-6 h-6 ${style}`} />;
    }
  };

  return (
    <div className="space-y-6" id="citizen-rewards-panel">
      {/* Overview Block with generous grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Points Summary Card */}
        <div className="bg-gradient-to-br from-brand-primary to-emerald-950 text-white rounded-3xl p-6 shadow-md flex flex-col justify-between h-48 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-y-4 translate-x-4 opacity-10 pointer-events-none">
            <Trophy className="w-48 h-48" />
          </div>

          <div className="space-y-1 relative z-10">
            <span className="bg-brand-accent/20 border border-brand-accent/30 text-brand-accent text-[9px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Environmental Tokens
            </span>
            <h2 className="text-sm font-extrabold text-emerald-100/80 pt-2 block font-sans">Accumulated Balance</h2>
          </div>

          <div className="relative z-10">
            <span className="text-4xl font-black font-mono text-brand-accent">{userPoints}</span>
            <span className="text-xs font-bold text-emerald-200 block mt-1 uppercase tracking-wide">Points Earned</span>
          </div>
        </div>

        {/* Current Standing Card */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 flex flex-col justify-between h-48 shadow-sm">
          <div className="space-y-1.5">
            <span className="bg-amber-50 text-brand-warning border border-amber-200 text-[9px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              National Ranking
            </span>
            <h3 className="text-sm font-bold text-gray-500 pt-2 block">Sierra Leone Standing</h3>
          </div>

          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-gray-900 font-mono">#14</span>
              <span className="text-xs font-bold text-gray-400">out of 4.2k reporters</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed mt-1.5">
              Rank updates every midnight based on validated incident report counts and campaign activity.
            </p>
          </div>
        </div>

        {/* Redeem utility credits quick info */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 flex flex-col justify-between h-48 shadow-sm">
          <div className="space-y-1.5">
            <span className="bg-teal-50 text-teal-800 border border-teal-200 text-[9px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Utility Credits
            </span>
            <h3 className="text-sm font-bold text-gray-500 pt-2 block">Redeemable Rewards</h3>
          </div>

          <div>
            <span className="text-xs font-bold text-gray-700 block">Municipal Utility Credit Code</span>
            <p className="text-[11px] text-gray-400 leading-relaxed mt-1">
              Exchange your points for EDSA electric vouchers or Guma Valley water credits once you reach 500 points.
            </p>
            <div className="mt-2.5">
              <button
                disabled={userPoints < 500}
                className={`text-[10px] font-extrabold px-3.5 py-1.5 rounded-lg border transition-all ${
                  userPoints >= 500
                    ? 'bg-brand-primary text-white border-brand-primary hover:bg-brand-secondary cursor-pointer'
                    : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                }`}
              >
                {userPoints >= 500 ? 'Redeem Utility Code' : `${500 - userPoints} points to unlock`}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Achievements / Badges Grid (Left 7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-gray-900">Your Civic Badges</h3>
            <p className="text-xs text-gray-400 mt-1">
              Verify your achievements as a local environmental pioneer.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`border rounded-2xl p-4 flex gap-4 items-start transition-all ${
                  badge.earned
                    ? 'border-brand-primary bg-emerald-50/5'
                    : 'border-gray-150 bg-gray-50/30'
                }`}
              >
                {/* Badge Icon holder */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border shadow-inner ${
                  badge.earned
                    ? 'bg-brand-accent/40 border-brand-primary/25 text-brand-primary'
                    : 'bg-white border-gray-200 text-gray-300'
                }`}>
                  {getBadgeIcon(badge.iconName, badge.earned)}
                </div>

                {/* Badge details */}
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className={`text-xs font-bold truncate ${badge.earned ? 'text-gray-900' : 'text-gray-400'}`}>
                      {badge.name}
                    </h4>
                    {badge.earned ? (
                      <ShieldCheck className="w-3.5 h-3.5 text-brand-success shrink-0" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">{badge.description}</p>
                  {badge.earned && badge.dateEarned && (
                    <span className="text-[9px] text-brand-primary font-mono font-bold block pt-1 uppercase">
                      Earned {badge.dateEarned}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard Leader board (Right 5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-brand-warning" />
            <div>
              <h3 className="text-sm font-extrabold text-gray-900">Civic Leaderboard</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">Top environmental champions of this season.</p>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {leaderboard.map((usr) => (
              <div
                key={usr.rank}
                className={`py-3 flex items-center justify-between gap-3 text-xs ${
                  usr.isCurrentUser ? 'bg-emerald-50/20 px-3.5 rounded-xl border border-brand-accent/30 -mx-3.5 my-1.5' : ''
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Rank Badge */}
                  <span className={`w-6 h-6 rounded-lg font-mono font-bold flex items-center justify-center text-[11px] shrink-0 ${
                    usr.rank === 1
                      ? 'bg-amber-100 text-amber-700'
                      : usr.rank === 2
                      ? 'bg-gray-100 text-gray-600'
                      : usr.rank === 3
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-gray-50 text-gray-400'
                  }`}>
                    {usr.rank}
                  </span>

                  <div className="min-w-0">
                    <p className={`font-bold truncate ${usr.isCurrentUser ? 'text-brand-primary' : 'text-gray-800'}`}>
                      {usr.name} {usr.isCurrentUser && '(You)'}
                    </p>
                    <p className="text-[10px] text-gray-400">{usr.location}</p>
                  </div>
                </div>

                <span className="font-mono font-bold text-gray-700 shrink-0 text-right">
                  {usr.points} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
