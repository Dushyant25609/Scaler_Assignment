import { useCalendarStore } from "@/store/calendarStore";
import { useMemo } from "react";

interface ScheduleItem {
  _id?: string;
  title: string;
  date: Date;
  time?: string;
  type: 'event' | 'task' | 'appointment';
  isCompleted?: boolean;
  isAllDay?: boolean;
}

interface GroupedItems {
  date: Date;
  dayOfWeek: string;
  dayNumber: number;
  month: string;
  items: ScheduleItem[];
}

const ScheduleView = () => {
  const { viewDate, events, tasks, appointments } = useCalendarStore();

  // Generate schedule list from events, tasks, and appointments
  const scheduleItems = useMemo(() => {
    const allItems: ScheduleItem[] = [];

    // Add events
    events.forEach(event => {
      allItems.push({
        _id: event._id,
        title: event.title,
        date: new Date(event.date),
        time: event.startTime,
        type: 'event',
        isAllDay: event.isAllDay,
      });
    });

    // Add tasks
    tasks.forEach(task => {
      if (task.date) {
        allItems.push({
          _id: task._id,
          title: task.title,
          date: new Date(task.date),
          time: task.time,
          type: 'task',
          isCompleted: task.isCompleted,
        });
      }
    });

    // Add appointments
    appointments.forEach(appointment => {
      allItems.push({
        _id: appointment._id,
        title: appointment.title,
        date: new Date(appointment.date),
        time: appointment.startTime,
        type: 'appointment',
      });
    });

    // Sort by date and time
    allItems.sort((a, b) => {
      const dateCompare = a.date.getTime() - b.date.getTime();
      if (dateCompare !== 0) return dateCompare;
      
      // If same date, sort by time
      const timeA = a.time || '';
      const timeB = b.time || '';
      return timeA.localeCompare(timeB);
    });

    // Group by date
    const grouped: GroupedItems[] = [];
    allItems.forEach(item => {
      const dateStr = item.date.toDateString();
      let group = grouped.find(g => g.date.toDateString() === dateStr);
      
      if (!group) {
        group = {
          date: item.date,
          dayOfWeek: item.date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
          dayNumber: item.date.getDate(),
          month: item.date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
          items: [],
        };
        grouped.push(group);
      }
      
      group.items.push(item);
    });

    return grouped;
  }, [viewDate, events, tasks, appointments]);

  const getItemColor = (type: string) => {
    switch (type) {
      case 'event':
        return 'bg-blue-600';
      case 'task':
        return 'bg-green-600';
      case 'appointment':
        return 'bg-purple-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getItemLabel = (type: string) => {
    switch (type) {
      case 'event':
        return 'Event';
      case 'task':
        return 'Task';
      case 'appointment':
        return 'Appointment';
      default:
        return '';
    }
  };

  return (
    <div className="flex-1 bg-[#131314] overflow-auto p-4 rounded-4xl transition-all duration-300">
      <div className="">
        {/* Schedule List */}
        {scheduleItems.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            No events, tasks, or appointments scheduled
          </div>
        ) : (
          <div className="divide-y divide-[#2D2D2D]">
            {scheduleItems.map((dateGroup, idx) => (
              <div key={idx} className="flex hover:bg-[#1B1B1B] transition-colors">
                {/* Date Column */}
                <div className="w-32 shrink-0 p-4 flex flex-col items-start">
                  <div className="text-md font-light text-white leading-none flex gap-2 items-end">
                    {dateGroup.dayNumber} <span className="text-xs text-gray-300">{dateGroup.month}, {dateGroup.dayOfWeek}</span>
                  </div>
                </div>

                {/* Items Column */}
                <div className="flex-1 py-4 pr-4 space-y-2">
                  {dateGroup.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-3 cursor-pointer hover:bg-[#2D2D2D] p-2 rounded transition-colors"
                    >
                      <div className={`w-2 h-2 rounded-full ${getItemColor(item.type)} shrink-0`} />
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-300">
                          {getItemLabel(item.type)}
                        </span>
                        <span className="text-sm text-gray-400">
                          {item.isAllDay ? 'All day' : item.time || 'No time'}
                        </span>
                        <span className={`text-sm ${item.isCompleted ? 'line-through text-gray-500' : 'text-white'}`}>
                          {item.title}
                        </span>
                        {item.isCompleted && (
                          <span className="text-xs text-gray-400">✓</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleView;
