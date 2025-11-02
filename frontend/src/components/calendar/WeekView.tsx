import { useCalendarStore } from "@/store/calendarStore";
import EventDialog from "./EventDialog";
import { useState, useMemo } from "react";

const WeekView = () => {
  const { selectedDate, events, tasks, appointments } = useCalendarStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [clickedDateTime, setClickedDateTime] = useState<{ date: Date; time?: string }>();

  // Get the start of the week (Sunday)
  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  // Generate the week dates
  const getWeekDates = () => {
    const weekStart = getWeekStart(selectedDate);
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();
  const today = new Date();

  // Helper to parse time string to hour
  const parseTimeToHour = (timeStr: string | undefined) => {
    if (!timeStr) return null;
    const match = timeStr.match(/(\d+):(\d+)(am|pm)/i);
    if (!match) return null;
    let hour = parseInt(match[1]);
    const isPM = match[3].toLowerCase() === 'pm';
    if (isPM && hour !== 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;
    return hour;
  };

  // Get items for a specific date and hour
  const getItemsForDateAndHour = useMemo(() => {
    const itemsMap = new Map<string, any[]>();

    weekDates.forEach(date => {
      const dateStr = date.toISOString().split('T')[0];
      
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.date).toISOString().split('T')[0];
        return eventDate === dateStr && !event.isAllDay;
      });

      const dayTasks = tasks.filter(task => {
        if (!task.date) return false;
        const taskDate = new Date(task.date).toISOString().split('T')[0];
        return taskDate === dateStr;
      });

      const dayAppointments = appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date).toISOString().split('T')[0];
        return appointmentDate === dateStr;
      });

      // Organize by hour
      for (let hour = 0; hour < 24; hour++) {
        const key = `${dateStr}-${hour}`;
        const items = [];

        items.push(...dayEvents.filter(e => parseTimeToHour(e.startTime) === hour));
        items.push(...dayTasks.filter(t => parseTimeToHour(t.time) === hour));
        items.push(...dayAppointments.filter(a => parseTimeToHour(a.startTime) === hour));

        if (items.length > 0) {
          itemsMap.set(key, items);
        }
      }
    });

    return itemsMap;
  }, [weekDates, events, tasks, appointments]);

  // Generate hours for the day view
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Format hour display
  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };

  // Get timezone
  const getTimezone = () => {
    const offset = -new Date().getTimezoneOffset() / 60;
    const sign = offset >= 0 ? '+' : '-';
    const absOffset = Math.abs(offset);
    const hours = Math.floor(absOffset);
    const minutes = (absOffset - hours) * 60;
    return `GMT${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  // Format day header
  const formatDayHeader = (date: Date) => {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    return days[date.getDay()];
  };

  // Convert hour to time string
  const hourToTimeString = (hour: number) => {
    const period = hour < 12 ? 'am' : 'pm';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00${period}`;
  };

  // Handle time slot click
  const handleTimeSlotClick = (date: Date, hour: number) => {
    setClickedDateTime({
      date: date,
      time: hourToTimeString(hour)
    });
    setIsDialogOpen(true);
  };

  // Check if date is today
  const isToday = (date: Date) => {
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const timezone = getTimezone();

  return (
    <div className="flex-1 bg-[#131314] p-4 rounded-4xl overflow-auto transition-all duration-300">
      {/* Week Header */}
      <div className="sticky top-0 z-10 bg-[#131314] border-b border-[#3D3D3D]">
        <div className="flex">
          {/* Timezone column */}
          <div className="w-[70px] shrink-0 flex items-end justify-end pr-3 pb-2">
            <span className="text-[11px] text-gray-500">{timezone}</span>
          </div>
          
          {/* Day headers */}
          {weekDates.map((date, idx) => (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center py-2 border-l border-[#3D3D3D]"
            >
              <div className="text-[10px] text-gray-400 font-medium tracking-wide mb-1">
                {formatDayHeader(date)}
              </div>
              <div
                className={`text-[28px] leading-none font-normal flex items-center justify-center rounded-full ${
                  isToday(date)
                    ? "bg-[#A9CAFB] text-gray-600 w-12 h-12"
                    : "text-gray-300"
                }`}
              >
                {date.getDate()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Time Grid */}
      <div className="relative">
        {hours.map((hour) => (
          <div key={hour} className="flex border-b border-[#2D2D2D]">
            {/* Time Label */}
            <div className="w-[70px] shrink-0 pt-1 pr-3 text-right">
              <span className="text-[11px] text-gray-500 font-normal">
                {formatHour(hour)}
              </span>
            </div>

            {/* Day columns */}
            {weekDates.map((date, idx) => {
              const dateStr = date.toISOString().split('T')[0];
              const key = `${dateStr}-${hour}`;
              const items = getItemsForDateAndHour.get(key) || [];

              return (
                <div
                  key={idx}
                  className="flex-1 border-l border-[#3D3D3D] relative cursor-pointer min-h-12 hover:bg-[#252525] transition-colors p-0.5"
                  onClick={() => handleTimeSlotClick(date, hour)}
                >
                  {/* Render Events, Tasks, and Appointments */}
                  {items.map((item, itemIdx) => {
                    const isTask = 'isCompleted' in item;
                    const isAppointment = 'calendarId' in item && 'startTime' in item && 'endTime' in item && !('isAllDay' in item);
                    
                    let bgColor = 'bg-blue-600';
                    let label = 'Event';
                    
                    if (isTask) {
                      bgColor = (item as any).isCompleted ? 'bg-gray-600' : 'bg-green-600';
                      label = 'Task';
                    } else if (isAppointment) {
                      bgColor = 'bg-purple-600';
                      label = 'Appointment';
                    }
                    
                    return (
                      <div
                        key={`${label}-${item._id || itemIdx}`}
                        className={`${bgColor} text-white text-[10px] px-1 py-0.5 rounded mb-0.5 truncate`}
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Open edit dialog
                        }}
                        title={item.title}
                      >
                        <div className="font-medium truncate">{item.title}</div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <EventDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        selectedDateTime={clickedDateTime}
      />
    </div>
  );
};

export default WeekView;
