import { weeklyTimetable } from '@/lib/mock-data';
import { motion } from 'framer-motion';
import { useState } from 'react';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = ['8:30', '9:30', '10:30', '11:00', '12:00', '1:00', '2:00', '3:00', '4:00'];

export function TimetableGrid() {
  const [selectedDay, setSelectedDay] = useState('Monday');

  return (
    <div className="space-y-4">
      {/* Day selector - mobile friendly */}
      <div className="flex gap-1.5 overflow-x-auto pb-2">
        {days.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              selectedDay === day
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {day.slice(0, 3)}
          </button>
        ))}
      </div>

      {/* Slots */}
      <div className="space-y-2">
        {(weeklyTimetable[selectedDay] || []).map((slot, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`glass-card rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:scale-[1.01] transition-transform ${
              slot.type === 'lab' ? 'border-l-4 border-l-secondary' : 'border-l-4 border-l-primary'
            }`}
          >
            <div className="text-center min-w-[60px]">
              <p className="text-sm font-bold text-foreground">{slot.time}</p>
              <p className="text-[10px] text-muted-foreground">{slot.endTime}</p>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-foreground truncate">{slot.subject}</p>
              <p className="text-xs text-muted-foreground">{slot.subjectCode} · {slot.staff}</p>
            </div>
            <div className="text-right shrink-0">
              <span className={`text-[10px] font-semibold uppercase px-2 py-1 rounded-full ${
                slot.type === 'lab' ? 'badge-info' : 'badge-success'
              }`}>
                {slot.type}
              </span>
              <p className="text-xs text-muted-foreground mt-1">Room {slot.room}</p>
            </div>
          </motion.div>
        ))}

        {/* Break indicators */}
        {selectedDay && (
          <>
            <div className="flex items-center gap-3 py-1">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[10px] text-muted-foreground font-medium">☕ Tea Break 10:30 – 10:45</span>
              <div className="h-px flex-1 bg-border" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
