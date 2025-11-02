"use client";

import { 
  Menu, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  HelpCircle, 
  Settings, 
  Grid3x3,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import calendarIcon from "@/assets/calender.svg";
import { useMemo, useState } from "react";
import { useCalendarStore } from "@/store/calendarStore";

const Navbar = () => {
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  const [showWeekends, setShowWeekends] = useState(false);
  const [showDeclinedEvents, setShowDeclinedEvents] = useState(true);
  const [showCompletedTasks, setShowCompletedTasks] = useState(true);

  const {
    selectedDate,
    viewDate,
    isCalendarOpen,
    currentView,
    activeViewToggle,
    toggleSidebar,
    setCurrentView,
    setActiveViewToggle,
    handlePrevMonth,
    handleNextMonth,
    handlePrevDay,
    handleNextDay,
    handleTodayClick,
    handleDateClick,
    toggleCalendar,
  } = useCalendarStore();
  
  const today = new Date();
  
  // Format date for display
  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };
  
  // Generate calendar dates
  const calendarDates = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevMonthLastDay = new Date(year, month, 0);
    
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const daysInPrevMonth = prevMonthLastDay.getDate();
    
    const dates: { date: number; isCurrentMonth: boolean; fullDate: Date }[] = [];
    
    // Previous month days
    for (let i = startDay - 1; i >= 0; i--) {
      dates.push({
        date: daysInPrevMonth - i,
        isCurrentMonth: false,
        fullDate: new Date(year, month - 1, daysInPrevMonth - i)
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push({
        date: i,
        isCurrentMonth: true,
        fullDate: new Date(year, month, i)
      });
    }
    
    // Next month days
    const remainingDays = 42 - dates.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      dates.push({
        date: i,
        isCurrentMonth: false,
        fullDate: new Date(year, month + 1, i)
      });
    }
    
    return dates;
  }, [viewDate]);
  
  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };
  
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  
  return (
    <nav className="w-full h-16 bg-background flex items-center justify-between px-2">
      {/* Left Section */}
      <div className="flex items-center gap-2">
        {/* Menu Icon */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="text-gray-300 hover:bg-[#2D2D2D] hover:text-white rounded-full h-10 w-10"
        >
          <Menu className="h-9 w-9 font-bold" />
        </Button>

        {/* Calendar Logo and Title */}
        <div className="flex items-center gap-3">
            <img src={calendarIcon} alt="Calendar Logo" className="h-10 w-10" />
          <span className="text-[#E8EAED] text-[22px] font-light tracking-tight">Calendar</span>
        </div>

        {/* Today Button */}
        <Button 
          variant="outline" 
          onClick={handleTodayClick}
          className="ml-24 text-[#E8EAED] bg-transparent border border-[#5F6368] hover:bg-[#2D2D2D] hover:border-[#5F6368] rounded-full px-5 h-9 text-sm font-light"
        >
          Today
        </Button>

        {/* Navigation Arrows */}
        <div className="flex items-center gap-0">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handlePrevDay}
            className="text-gray-300 hover:bg-[#2D2D2D] hover:text-white rounded-full h-10 w-10"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleNextDay}
            className="text-gray-300 hover:bg-[#2D2D2D] hover:text-white rounded-full h-10 w-10"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Date Display with Calendar Dropdown */}
        <div className="relative">
          <Button
            variant="ghost"
            onClick={toggleCalendar}
            className="text-[#E8EAED] text-[22px] font-light ml-4 rounded px-3 py-2 flex items-center gap-2"
          >
            {formatDisplayDate(selectedDate)}
            <ChevronDown className="h-4 w-4" />
          </Button>
          
          {/* Calendar Dropdown */}
          {isCalendarOpen && (
            <div className="absolute top-full left-0 mt-2 bg-[#2D2D2D] rounded-lg shadow-2xl p-3 w-64 z-50">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white text-sm font-medium">
                  {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="flex gap-0.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePrevMonth}
                    className="h-6 w-6 text-white hover:bg-[#3D3D3D] rounded-full"
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNextMonth}
                    className="h-6 w-6 text-white hover:bg-[#3D3D3D] rounded-full"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-0.5 mb-1">
                {days.map((day, i) => (
                  <div
                    key={i}
                    className="text-center text-[10px] font-medium text-gray-400"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Date Grid */}
              <div className="grid grid-cols-7 gap-0.5">
                {calendarDates.map((dateObj, idx) => {
                  const isToday = isSameDay(dateObj.fullDate, today);
                  const isSelected = isSameDay(dateObj.fullDate, selectedDate);

                  return (
                    <button
                      key={idx}
                      onClick={() => handleDateClick(dateObj.fullDate)}
                      className={`
                        h-7 w-7 text-xs flex items-center justify-center rounded-full
                        transition-colors
                        ${
                          isToday
                            ? "bg-[#444444] text-white hover:bg-[#555555]"
                            : isSelected
                            ? "bg-[#1A73E8] text-white hover:bg-[#1557B0]"
                            : "hover:bg-[#3D3D3D]"
                        }
                        ${
                          !dateObj.isCurrentMonth
                            ? "text-gray-600"
                            : "text-white"
                        }
                      `}
                    >
                      {dateObj.date}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Search Icon - Hidden when tasks toggle is active */}
        {activeViewToggle === "calendar" && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-300 hover:bg-[#2D2D2D] hover:text-white rounded-full h-10 w-10"
          >
            <Search className="h-10 w-10" />
          </Button>
        )}

        {/* Help Icon */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-300 hover:bg-[#2D2D2D] hover:text-white rounded-full h-10 w-10"
        >
          <HelpCircle className="h-10 w-10" />
        </Button>

        {/* Settings Icon - Hidden when tasks toggle is active */}
        {activeViewToggle === "calendar" && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-300 hover:bg-[#2D2D2D] hover:text-white rounded-full h-10 w-10"
          >
            <Settings className="h-10 w-10" />
          </Button>
        )}

        {/* Day Dropdown - Hidden when tasks toggle is active */}
        {activeViewToggle === "calendar" && (
          <div className="relative ml-2">
          <Button 
            variant="outline" 
            onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)}
            className="text-[#E8EAED] bg-transparent border border-[#5F6368] hover:bg-[#2D2D2D] hover:border-[#5F6368] rounded-full px-4 h-9 text-sm font-light flex items-center gap-2"
          >
            {currentView}
            <ChevronDown className="h-3 w-3" />
          </Button>

          {/* View Dropdown Menu */}
          {isViewDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 bg-[#2D2D2D] rounded-lg shadow-2xl w-72 z-50 overflow-hidden">
              {/* View Options */}
              <div className="py-2">
                {[
                  { name: "Day", key: "D" },
                  { name: "Week", key: "W" },
                  { name: "Month", key: "M" },
                  { name: "Year", key: "Y" },
                  { name: "Schedule", key: "A" },
                  { name: "4 days", key: "X" },
                ].map((view) => (
                  <button
                    key={view.name}
                    onClick={() => {
                      setCurrentView(view.name as "Day" | "Week" | "Month" | "Year" | "Schedule" | "4 days");
                      setIsViewDropdownOpen(false);
                    }}
                    className="w-full px-4 py-3 hover:bg-[#3D3D3D] flex items-center justify-between text-left"
                  >
                    <span className="text-white text-sm">{view.name}</span>
                    <span className="text-gray-400 text-xs">{view.key}</span>
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div className="h-px bg-[#3D3D3D]" />

              {/* Toggle Options */}
              <div className="py-2">
                <button
                  onClick={() => setShowWeekends(!showWeekends)}
                  className="w-full px-4 py-3 hover:bg-[#3D3D3D] flex items-center gap-3"
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    {showWeekends && <Check className="h-4 w-4 text-white" />}
                  </div>
                  <span className="text-gray-400 text-sm">Show weekends</span>
                </button>

                <button
                  onClick={() => setShowDeclinedEvents(!showDeclinedEvents)}
                  className="w-full px-4 py-3 hover:bg-[#3D3D3D] flex items-center gap-3"
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    {showDeclinedEvents && <Check className="h-4 w-4 text-white" />}
                  </div>
                  <span className="text-gray-400 text-sm">Show declined events</span>
                </button>

                <button
                  onClick={() => setShowCompletedTasks(!showCompletedTasks)}
                  className="w-full px-4 py-3 hover:bg-[#3D3D3D] flex items-center gap-3"
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    {showCompletedTasks && <Check className="h-4 w-4 text-white" />}
                  </div>
                  <span className="text-gray-400 text-sm">Show completed tasks</span>
                </button>
              </div>
            </div>
          )}
          </div>
        )}

        {/* Calendar View Toggle */}
        <div className="ml-1 flex items-center border border-[#5F6368] rounded-full overflow-hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setActiveViewToggle("calendar")}
            className={`rounded-none h-10 w-10 border-r border-[#5F6368] transition-colors ${
              activeViewToggle === "calendar"
                ? "bg-[#3D5A80] hover:bg-[#4A6A90] text-white"
                : "text-gray-300 hover:bg-[#2D2D2D] hover:text-white"
            }`}
          >
            <CalendarDays className={`h-5 w-5 ${activeViewToggle === "calendar" ? "text-white" : ""}`} />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setActiveViewToggle("tasks")}
            className={`rounded-none h-10 w-10 transition-colors ${
              activeViewToggle === "tasks"
                ? "bg-[#3D5A80] hover:bg-[#4A6A90] text-white"
                : "text-gray-300 hover:bg-[#2D2D2D] hover:text-white"
            }`}
          >
            <CheckCircle2 className={`h-5 w-5 ${activeViewToggle === "tasks" ? "text-white" : ""}`} />
          </Button>
        </div>

        {/* Grid Menu Icon */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-300 hover:bg-[#2D2D2D] hover:text-white rounded-full h-10 w-10"
        >
          <Grid3x3 className="h-5 w-5" />
        </Button>

        {/* User Avatar */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-2 w-8 h-8 rounded-full bg-[#188038] text-white hover:bg-[#1a7d3a] font-medium text-sm"
        >
          D
        </Button>
      </div>
    </nav>
  );
}

export default Navbar;