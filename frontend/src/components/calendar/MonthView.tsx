import { useCalendarStore } from "@/store/calendarStore";
import { useMemo, useState } from "react";
import EventDialog from "./EventDialog";

const MonthView = () => {
  const { selectedDate, viewDate, events, tasks, appointments } = useCalendarStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [clickedDateTime, setClickedDateTime] = useState<{ date: Date; time?: string }>();

  const today = new Date();

  // Get counts for each date
  const getDateCounts = useMemo(() => {
    const countsMap = new Map<string, { events: number; tasks: number; appointments: number }>();

    events.forEach(event => {
      const dateStr = new Date(event.date).toISOString().split('T')[0];
      const counts = countsMap.get(dateStr) || { events: 0, tasks: 0, appointments: 0 };
      counts.events++;
      countsMap.set(dateStr, counts);
    });

    tasks.forEach(task => {
      if (!task.date) return;
      const dateStr = new Date(task.date).toISOString().split('T')[0];
      const counts = countsMap.get(dateStr) || { events: 0, tasks: 0, appointments: 0 };
      counts.tasks++;
      countsMap.set(dateStr, counts);
    });

    appointments.forEach(appointment => {
      const dateStr = new Date(appointment.date).toISOString().split('T')[0];
      const counts = countsMap.get(dateStr) || { events: 0, tasks: 0, appointments: 0 };
      counts.appointments++;
      countsMap.set(dateStr, counts);
    });

    return countsMap;
  }, [events, tasks, appointments]);

  // Generate calendar dates for the month view
  const calendarDates = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevMonthLastDay = new Date(year, month, 0);
    
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const daysInPrevMonth = prevMonthLastDay.getDate();
    
    const dates: { date: number; isCurrentMonth: boolean; fullDate: Date; monthLabel?: string }[] = [];
    
    // Previous month days
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, daysInPrevMonth - i);
      dates.push({
        date: daysInPrevMonth - i,
        isCurrentMonth: false,
        fullDate: date,
        monthLabel: i === startDay - 1 ? date.toLocaleDateString('en-US', { month: 'short' }) : undefined
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      dates.push({
        date: i,
        isCurrentMonth: true,
        fullDate: date
      });
    }
    
    // Next month days
    const remainingDays = 42 - dates.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      dates.push({
        date: i,
        isCurrentMonth: false,
        fullDate: date,
        monthLabel: i === 1 ? date.toLocaleDateString('en-US', { month: 'short' }) : undefined
      });
    }
    
    return dates;
  }, [viewDate]);

  // Check if date is today
  const isToday = (date: Date) => {
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  // Check if date is selected
  const isSelected = (date: Date) => {
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  // Group dates into weeks
  const weeks = [];
  for (let i = 0; i < calendarDates.length; i += 7) {
    weeks.push(calendarDates.slice(i, i + 7));
  }

  return (
    <div className="flex-1 bg-[#131314] overflow-auto transition-all duration-300 rounded-4xl">
      {/* Day Headers */}
      <div className="sticky top-0 z-10 bg-[#131314] border-b border-[#3D3D3D]">
        <div className="grid grid-cols-7">
          {days.map((day, idx) => (
            <div
              key={idx}
              className="text-center py-3 text-[11px] font-medium text-gray-400 tracking-wide border-r border-[#3D3D3D] last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarDates.map((dateObj, idx) => {
          const isTodayDate = isToday(dateObj.fullDate);
          const isSelectedDate = isSelected(dateObj.fullDate);
          const dateStr = dateObj.fullDate.toISOString().split('T')[0];
          const counts = getDateCounts.get(dateStr) || { events: 0, tasks: 0, appointments: 0 };
          const hasItems = counts.events > 0 || counts.tasks > 0 || counts.appointments > 0;

          return (
            <div
              key={idx}
              className={`min-h-[120px] border-r border-b border-[#3D3D3D] last:border-r-0 p-2 hover:bg-[#252525] transition-colors cursor-pointer ${
                !dateObj.isCurrentMonth ? 'bg-[#0D0D0D]' : ''
              }`}
              onClick={() => {
                setClickedDateTime({ date: dateObj.fullDate });
                setIsDialogOpen(true);
              }}
            >
              {/* Date Number */}
              <div className="flex items-center gap-2 mb-2 justify-center">
                {dateObj.monthLabel && (
                  <span className="text-[10px] text-gray-500 font-medium">
                    {dateObj.monthLabel}
                  </span>
                )}
                <div
                  className={`text-sm  font-normal flex items-center justify-center ${
                    isTodayDate
                      ? "bg-[#1A73E8] text-white w-7 h-7 rounded-full"
                      : isSelectedDate
                      ? "bg-[#3D5A80] text-white w-7 h-7 rounded-full"
                      : dateObj.isCurrentMonth
                      ? "text-gray-300"
                      : "text-gray-600"
                  }`}
                >
                  {dateObj.date}
                </div>
              </div>

              {/* Event indicators */}
              <div className="space-y-1">
                {hasItems && (
                  <div className="flex flex-wrap gap-1 justify-center">
                    {counts.events > 0 && (
                      <div className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded">
                        {counts.events} Event{counts.events > 1 ? 's' : ''}
                      </div>
                    )}
                    {counts.tasks > 0 && (
                      <div className="bg-green-600 text-white text-[10px] px-1.5 py-0.5 rounded">
                        {counts.tasks} Task{counts.tasks > 1 ? 's' : ''}
                      </div>
                    )}
                    {counts.appointments > 0 && (
                      <div className="bg-purple-600 text-white text-[10px] px-1.5 py-0.5 rounded">
                        {counts.appointments} Appt{counts.appointments > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <EventDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        selectedDateTime={clickedDateTime}
      />
    </div>
  );
};

export default MonthView;
