import React, { useState } from 'react';
import { Users, Calendar, MapPin, Sparkles, Share2, Info, Check, UserPlus, HelpCircle } from 'lucide-react';
import { CommunityEvent } from '../../lib/citizenData';

interface CommunityHubProps {
  events: CommunityEvent[];
  onJoinEvent: (eventId: string) => void;
  userPoints: number;
}

export default function CommunityHub({ events, onJoinEvent, userPoints }: CommunityHubProps) {
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [shareToastText, setShareToastText] = useState<string | null>(null);

  const handleShare = (eventTitle: string) => {
    const text = `Join me for the "${eventTitle}" cleanup campaign in Sierra Leone! Track waste and keep Salone clean with ECOCLEAN.`;
    navigator.clipboard.writeText(text);
    setShareToastText(`Share link for "${eventTitle}" copied to clipboard!`);
    setTimeout(() => setShareToastText(null), 3000);
  };

  const getCategoryColor = (cat: CommunityEvent['category']) => {
    switch (cat) {
      case 'Cleanup Campaign':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
      case 'Environmental Awareness Program':
        return 'bg-teal-50 text-teal-800 border-teal-200/80';
      case 'Volunteer Activities':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200/80';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6" id="citizen-community-hub">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-gray-200/80 p-5 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">Community Engagement</h2>
          <p className="text-xs text-gray-400 mt-1">
            Join environmental cleanup drives, register for awareness programs, and earn civic points.
          </p>
        </div>

        {/* Dynamic points overview */}
        <div className="bg-brand-primary text-brand-accent p-3.5 rounded-2xl flex items-center gap-3.5 shadow-md shrink-0 self-start sm:self-auto">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-brand-accent shadow-inner">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-emerald-200 block font-bold leading-none">YOUR CIVIC SCORE</span>
            <span className="text-base font-black font-mono block mt-0.5">{userPoints} Points</span>
          </div>
        </div>
      </div>

      {/* Share alert toast */}
      {shareToastText && (
        <div className="fixed bottom-6 right-6 z-50 bg-brand-primary text-white text-xs px-4.5 py-3 rounded-xl border border-brand-accent/20 shadow-xl flex items-center gap-2 animate-bounce">
          <Share2 className="w-4 h-4 text-brand-accent" />
          <span>{shareToastText}</span>
        </div>
      )}

      {/* Events Listing Stack */}
      <div className="space-y-4">
        {events.map((ev) => {
          const isExpanded = expandedEventId === ev.id;
          const slotsLeft = ev.maxVolunteers - ev.volunteersJoined;

          return (
            <div
              key={ev.id}
              className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                ev.userJoined
                  ? 'border-emerald-500 ring-1 ring-emerald-500/20 bg-emerald-50/5'
                  : 'border-gray-200/80 shadow-sm hover:shadow'
              }`}
            >
              {/* Main Card row */}
              <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center gap-4 justify-between">
                <div className="space-y-2.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] font-bold font-mono border px-2.5 py-0.5 rounded-full uppercase ${getCategoryColor(ev.category)}`}>
                      {ev.category}
                    </span>
                    <span className="text-[10px] font-mono text-brand-primary bg-brand-primary/5 border border-brand-primary/10 px-2 py-0.5 rounded font-bold uppercase">
                      +100 Points
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-gray-900 leading-snug">
                      {ev.title}
                    </h3>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">Organized by {ev.organizer}</p>
                  </div>

                  {/* Location & Time markers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-500 font-medium pt-1">
                    <p className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{ev.date} &bull; {ev.time}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-brand-secondary shrink-0" />
                      <span className="truncate">{ev.location}</span>
                    </p>
                  </div>
                </div>

                {/* Slots and Buttons column */}
                <div className="md:border-l border-gray-100 md:pl-6 md:w-56 shrink-0 flex flex-col justify-between h-full gap-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-medium">Volunteers:</span>
                    <span className="font-bold text-gray-700">{ev.volunteersJoined} / {ev.maxVolunteers}</span>
                  </div>

                  {/* Slot availability progress bar */}
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-secondary rounded-full"
                      style={{ width: `${(ev.volunteersJoined / ev.maxVolunteers) * 100}%` }}
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setExpandedEventId(isExpanded ? null : ev.id)}
                      className="flex-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 font-bold text-xs py-2.5 rounded-xl cursor-pointer text-center"
                    >
                      {isExpanded ? 'Hide Info' : 'Learn More'}
                    </button>

                    <button
                      onClick={() => onJoinEvent(ev.id)}
                      disabled={ev.userJoined}
                      className={`flex-1 font-bold text-xs py-2.5 rounded-xl cursor-pointer flex items-center justify-center gap-1 transition-all ${
                        ev.userJoined
                          ? 'bg-emerald-500 text-white cursor-default'
                          : 'bg-brand-primary hover:bg-brand-secondary text-white shadow-md shadow-brand-primary/10 hover:scale-[1.01]'
                      }`}
                    >
                      {ev.userJoined ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Joined</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Join Slot</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Collapsible Details Panel */}
              {isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50/50 p-6 space-y-4 text-xs sm:text-sm text-gray-700">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Description</span>
                    <p className="leading-relaxed text-gray-600 font-medium">{ev.description}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white border border-gray-150 p-4 rounded-xl">
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-400 font-bold block uppercase">How to Prepare</span>
                      <p className="text-xs text-gray-600 leading-relaxed font-medium">
                        Dress comfortably for manual work. Wear sturdy shoes. Bring a reusable water flask. Trash pickers, heavy-duty safety gloves, and reflective vests will be provided by the local organizers.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-400 font-bold block uppercase">Earn Civic Badges</span>
                      <p className="text-xs text-gray-600 leading-relaxed font-medium">
                        By joining and validating attendance with the site foreman, you earn the **Clean Community Champion** and **Community Volunteer** badges instantly on your profile!
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[10px] text-gray-400 font-mono">ID: {ev.id} &bull; Slots Left: {slotsLeft}</span>
                    <button
                      onClick={() => handleShare(ev.title)}
                      className="text-brand-primary hover:text-brand-success text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share Campaign details</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
