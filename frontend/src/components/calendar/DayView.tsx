import { useCalendarStore } from "@/store/calendarStore";
import EventDialog from "./EventDialog";
import { useState, useMemo } from "react";

const DayView = () => {
  const { selectedDate, isSidebarCollapsed, events, tasks, appointments } = useCalendarStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [clickedDateTime, setClickedDateTime] = useState<{ date: Date; time?: string }>();

  // Filter items for the selected date
  const dayItems = useMemo(() => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.date).toISOString().split('T')[0];
      return eventDate === dateStr;
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

    return { events: dayEvents, tasks: dayTasks, appointments: dayAppointments };
  }, [selectedDate, events, tasks, appointments]);

  // Helper to parse time string to hour (e.g., "2:00pm" -> 14)
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

  // Get items for a specific hour
  const getItemsForHour = (hour: number) => {
    const hourEvents = dayItems.events.filter(event => {
      if (event.isAllDay) return false; // Show all-day events separately
      const eventHour = parseTimeToHour(event.startTime);
      return eventHour === hour;
    });

    const hourTasks = dayItems.tasks.filter(task => {
      const taskHour = parseTimeToHour(task.time);
      return taskHour === hour;
    });

    const hourAppointments = dayItems.appointments.filter(appointment => {
      const appointmentHour = parseTimeToHour(appointment.startTime);
      return appointmentHour === hour;
    });

    return [...hourEvents, ...hourTasks, ...hourAppointments];
  };

  // Generate hours for the day view
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Format the date display
  const formatDate = (date: Date) => {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const dayName = days[date.getDay()];
    const dayNumber = date.getDate();
    return { dayName, dayNumber };
  };

  // Format hour display
  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };

  // Convert hour to time string
  const hourToTimeString = (hour: number) => {
    const period = hour < 12 ? 'am' : 'pm';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00${period}`;
  };

  // Handle time slot click
  const handleTimeSlotClick = (hour: number) => {
    setClickedDateTime({
      date: selectedDate,
      time: hourToTimeString(hour)
    });
    setIsDialogOpen(true);
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

  const { dayName, dayNumber } = formatDate(selectedDate);
  const timezone = getTimezone();

  return (
    <div className={`flex-1 bg-[#131314] p-4 rounded-4xl overflow-auto transition-all duration-300 ${isSidebarCollapsed ? 'w-1/2' : ''}`}>
      {/* Date Header */}
      <div className="sticky top-0 z-10 bg-[#131314] flex gap-4 p-1 border-b border-[#2D2D2D]">
        <div className="text-xs self-end text-gray-500">{timezone}</div>
        <div className="flex flex-col items-center">
          <div className="text-xs text-gray-400 mb-1">{dayName}</div>
          <div className="text-3xl font-light text-gray-300">{dayNumber}</div>
        </div>
      </div>

      {/* Time Grid */}
      <div className="relative">
        {hours.map((hour) => {
          const hourItems = getItemsForHour(hour);
          
          return (
            <div
              key={hour}
              className="flex border-b border-[#2D2D2D] hover:bg-[#2D2D2D]/30 transition-colors min-h-[50px]"
            >
              {/* Time Label */}
              <div className="w-20 shrink-0 pr-3 text-right pt-1">
                <span className="text-xxs text-gray-400">{formatHour(hour)}</span>
              </div>
              
              {/* Event Space */}
              <div 
                className="flex-1 border-l border-[#2D2D2D] relative cursor-pointer p-1"
                onClick={() => handleTimeSlotClick(hour)}
              >
                {/* Render Events, Tasks, and Appointments */}
                {hourItems.map((item, idx) => {
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
                      key={`${label}-${item._id || idx}`}
                      className={`${bgColor} text-white text-xs px-2 py-1 rounded mb-1 truncate`}
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Open edit dialog
                      }}
                    >
                      <div className="font-medium truncate">{item.title}</div>
                      {isTask && (item as any).isCompleted && (
                        <div className="text-xxs text-gray-300">✓ Completed</div>
                      )}
                    </div>
                  );
                })}
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

export default DayView;
