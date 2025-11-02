import { useCalendarStore } from "@/store/calendarStore";
import { useMemo, useState } from "react";
import EventDialog from "./EventDialog";

const YearView = () => {
  const { selectedDate, viewDate } = useCalendarStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [clickedDateTime, setClickedDateTime] = useState<{ date: Date; time?: string }>();

  const today = new Date();
  const year = viewDate.getFullYear();

  // Generate calendar dates for a specific month
  const getMonthDates = (monthIndex: number) => {
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const prevMonthLastDay = new Date(year, monthIndex, 0);
    
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const daysInPrevMonth = prevMonthLastDay.getDate();
    
    const dates: { date: number; isCurrentMonth: boolean; fullDate: Date }[] = [];
    
    // Previous month days
    for (let i = startDay - 1; i >= 0; i--) {
      dates.push({
        date: daysInPrevMonth - i,
        isCurrentMonth: false,
        fullDate: new Date(year, monthIndex - 1, daysInPrevMonth - i)
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push({
        date: i,
        isCurrentMonth: true,
        fullDate: new Date(year, monthIndex, i)
      });
    }
    
    // Next month days
    const remainingDays = 42 - dates.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      dates.push({
        date: i,
        isCurrentMonth: false,
        fullDate: new Date(year, monthIndex + 1, i)
      });
    }
    
    return dates;
  };

  // Generate all 12 months
  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      name: new Date(year, i, 1).toLocaleDateString('en-US', { month: 'long' }),
      index: i,
      dates: getMonthDates(i)
    }));
  }, [year]);

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

  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="flex-1 bg-[#131314] overflow-auto transition-all duration-300 p-6">
      {/* Year Grid - 4 columns x 3 rows */}
      <div className="grid grid-cols-4 gap-6 max-w-[1400px] mx-auto">
        {months.map((month) => (
          <div key={month.index} className=" rounded-lg p-4">
            {/* Month Name */}
            <h3 className="text-sm font-medium text-gray-300 mb-3 text-center">
              {month.name}
            </h3>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {days.map((day, idx) => (
                <div
                  key={idx}
                  className="text-center text-[10px] font-medium text-gray-500"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Date Grid */}
            <div className="grid grid-cols-7 gap-1">
              {month.dates.map((dateObj, idx) => {
                const isTodayDate = isToday(dateObj.fullDate);
                const isSelectedDate = isSelected(dateObj.fullDate);

                // Only show dates that belong to the current month
                if (!dateObj.isCurrentMonth) {
                  return <div key={idx} className="h-7 w-7" />;
                }

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setClickedDateTime({ date: dateObj.fullDate });
                      setIsDialogOpen(true);
                    }}
                    className={`
                      h-7 w-7 text-[11px] flex items-center justify-center rounded-full
                      transition-colors cursor-pointer
                      ${
                        isTodayDate
                          ? "bg-[#1A73E8] text-white hover:bg-[#1557B0]"
                          : isSelectedDate
                          ? "bg-[#3D5A80] text-white hover:bg-[#4A6A90]"
                          : "text-gray-300 hover:bg-[#2D2D2D]"
                      }
                    `}
                  >
                    {dateObj.date}
                  </button>
                );
              })}
            </div>
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

export default YearView;
