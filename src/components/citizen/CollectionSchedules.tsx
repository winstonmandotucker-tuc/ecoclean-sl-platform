import React, { useState } from 'react';
import { Search, Calendar, List, MapPin, Clock, Filter, AlertCircle, Info } from 'lucide-react';
import { DEFAULT_SCHEDULES, DISTRICTS, CollectionSchedule } from '../../lib/citizenData';

export default function CollectionSchedules() {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedDay, setSelectedDay] = useState('All');
  const [selectedDayInCalendar, setSelectedDayInCalendar] = useState<string>('Monday');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Handle Filtering
  const filteredSchedules = DEFAULT_SCHEDULES.filter((sch) => {
    const matchesSearch =
      sch.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sch.municipality.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDistrict = selectedDistrict === 'All' || sch.district === selectedDistrict;
    const matchesDay =
      selectedDay === 'All' ||
      sch.collectionDay.toLowerCase().includes(selectedDay.toLowerCase());

    return matchesSearch && matchesDistrict && matchesDay;
  });

  // Groups schedules by day for Calendar View
  const getSchedulesForDay = (day: string) => {
    return DEFAULT_SCHEDULES.filter((sch) =>
      sch.collectionDay.toLowerCase().includes(day.toLowerCase())
    );
  };

  return (
    <div className="space-y-6" id="collection-schedules-panel">
      {/* Header Block with toggles */}
      <div className="bg-white rounded-3xl border border-gray-200/80 p-5 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">Collection Schedules</h2>
          <p className="text-xs text-gray-400 mt-1">
            Check local waste disposal schedules and collection slots in your municipal zone.
          </p>
        </div>

        {/* View Switcher toggle */}
        <div className="flex bg-gray-100 p-1.5 rounded-xl self-start sm:self-auto shrink-0">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              viewMode === 'list' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <List className="w-4 h-4" />
            <span>List View</span>
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              viewMode === 'calendar' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Calendar View</span>
          </button>
        </div>
      </div>

      {/* FILTER & CONTROL PANEL */}
      <div className="bg-white rounded-3xl border border-gray-200/80 p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search bar */}
          <div className="relative md:col-span-6">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search schedules by municipality, zone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 focus:border-brand-primary focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-gray-800 transition-all focus:outline-none"
            />
          </div>

          {/* District Selector */}
          <div className="md:col-span-3">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 focus:border-brand-primary focus:bg-white rounded-xl p-2.5 text-xs text-gray-700 focus:none cursor-pointer"
            >
              <option value="All">All Districts</option>
              {DISTRICTS.map((dst) => (
                <option key={dst} value={dst}>
                  {dst}
                </option>
              ))}
            </select>
          </div>

          {/* Day of Week Selector */}
          <div className="md:col-span-3">
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 focus:border-brand-primary focus:bg-white rounded-xl p-2.5 text-xs text-gray-700 focus:none cursor-pointer font-medium"
            >
              <option value="All">All Weekdays</option>
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* RENDER MODE: LIST VIEW */}
      {viewMode === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSchedules.length > 0 ? (
            filteredSchedules.map((sch) => (
              <div
                key={sch.id}
                className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm space-y-4 hover:shadow hover:border-brand-primary/20 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono font-bold tracking-wider text-brand-primary bg-brand-primary/5 border border-brand-primary/10 px-2 py-0.5 rounded uppercase">
                      {sch.district}
                    </span>
                    <h3 className="text-sm font-extrabold text-gray-900 mt-1 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-brand-secondary shrink-0" />
                      <span>{sch.zone}</span>
                    </h3>
                    <p className="text-xs text-gray-400 font-medium">{sch.municipality}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3.5 border-t border-gray-100 bg-gray-50/50 p-3 rounded-xl">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-gray-400 uppercase">Collection Days</span>
                    <span className="text-xs font-bold text-gray-700 block">{sch.collectionDay}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-gray-400 uppercase">Collection Window</span>
                    <span className="text-xs font-bold text-gray-700 block flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-brand-secondary shrink-0" />
                      <span className="font-mono">{sch.collectionTime}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl border border-gray-200 p-8 text-center space-y-3 col-span-2">
              <div className="w-12 h-12 rounded-full bg-gray-50 border flex items-center justify-center mx-auto text-gray-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-800">No schedules found</h3>
                <p className="text-xs text-gray-400 max-w-xs mx-auto mt-1">
                  Adjust your search inputs or district selectors to see schedules in surrounding communities.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* RENDER MODE: CALENDAR VIEW */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm space-y-6">
          <div className="flex gap-2 items-center text-xs text-brand-primary font-bold bg-brand-primary/5 p-3 rounded-xl border border-brand-primary/10">
            <Info className="w-4.5 h-4.5 shrink-0" />
            <span>Select any day of the week to show scheduled collection dispatches.</span>
          </div>

          {/* Days selector strip */}
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {daysOfWeek.map((day) => {
              const activeCount = getSchedulesForDay(day).length;
              const isSelected = selectedDayInCalendar === day;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDayInCalendar(day)}
                  className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col justify-between h-20 ${
                    isSelected
                      ? 'bg-brand-primary text-white border-brand-primary shadow-md shadow-brand-primary/10'
                      : 'bg-gray-50 text-gray-600 border-gray-200/80 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-[11px] font-bold block">{day.slice(0, 3)}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full inline-block font-mono font-bold mt-2 ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-brand-primary/10 text-brand-primary'
                  }`}>
                    {activeCount} active
                  </span>
                </button>
              );
            })}
          </div>

          {/* List schedules for the selected calendar day */}
          <div className="pt-4 border-t border-gray-100 space-y-4">
            <h3 className="text-sm font-bold text-gray-900">Schedules for {selectedDayInCalendar}</h3>
            {getSchedulesForDay(selectedDayInCalendar).length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {getSchedulesForDay(selectedDayInCalendar).map((sch) => (
                  <div
                    key={sch.id}
                    className="border border-gray-150 rounded-2xl p-4 flex flex-col justify-between hover:border-brand-primary/30 transition-colors"
                  >
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-mono bg-brand-primary/5 text-brand-primary border border-brand-primary/10 px-2 py-0.5 rounded font-bold uppercase">
                        {sch.district}
                      </span>
                      <h4 className="text-xs font-extrabold text-gray-800">{sch.zone}</h4>
                      <p className="text-[11px] text-gray-400 font-medium">{sch.municipality}</p>
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-brand-secondary" />
                        <span className="font-mono">{sch.collectionTime}</span>
                      </span>
                      <span className="text-brand-success font-bold font-mono">CONFIRMED SLOT</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400 text-xs italic bg-gray-50 rounded-2xl">
                No collections scheduled on {selectedDayInCalendar}.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
