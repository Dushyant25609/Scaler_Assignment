"use client";

import { Plus, ChevronLeft, ChevronRight, ChevronDown, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check } from "lucide-react";
import { useCalendarStore } from "@/store/calendarStore";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import EventDialog from "@/components/calendar/EventDialog";

const colors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-yellow-500",
  "bg-red-500",
];

const CheckBox = ({ label = "Check this box" }: { label?: string }) => {
    const [isChecked, setIsChecked] = useState(true);
    const [randomColor] = useState(colors[Math.floor(Math.random() * colors.length)]);
    
    return (
        <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setIsChecked(!isChecked)}
        >
            <div className={`w-4 h-4 ${isChecked ? randomColor : "border border-gray-400"} rounded-sm flex items-center justify-center`}>
                {isChecked && <Check className="h-3 w-3 text-black" strokeWidth={3} />}
            </div>
            <span className="text-sm text-gray-300">{label}</span>
        </div>
    );
};

const SidebarComponent = () => {
  const {
    selectedDate,
    viewDate,
    isSidebarCollapsed,
    handlePrevMonth,
    handleNextMonth,
    handleDateClick,
  } = useCalendarStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTab, setDialogTab] = useState<"Event" | "Task" | "Appointment schedule">("Event");
  const [isCreatePopoverOpen, setIsCreatePopoverOpen] = useState(false);

  const handleCreateOption = (tab: "Event" | "Task" | "Appointment schedule") => {
    setDialogTab(tab);
    setIsDialogOpen(true);
    setIsCreatePopoverOpen(false);
  };

  const today = new Date();

  // Calendar data
  const days = ["S", "M", "T", "W", "T", "F", "S"];

  // Generate calendar dates dynamically
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

  const formatMonthYear = () => {
    return viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <>
      <Popover open={isCreatePopoverOpen} onOpenChange={setIsCreatePopoverOpen}>
        <PopoverTrigger asChild>
          <Button className={cn(`w-fit fixed bg-[#2D2D2D] left-6 transition-all duration-600 hover:bg-[#3D3D3D] z-50 top-20 ${!isSidebarCollapsed ? "py-7 px-20" : "w-14 py-7"} text-white rounded-xl mb-6 flex items-center justify-center gap-3 text-base`,
          )}>
              <Plus className="h-20 w-20" />
              {!isSidebarCollapsed ? "Create" : ""}
              {!isSidebarCollapsed ? <ChevronDown className="h-4 w-4 ml-auto" /> : ""}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-64 p-0 bg-[#2D2D2D] border-[#3D3D3D] text-white"
          align="start"
          side="right"
        >
          <div className="py-2">
            <button 
              onClick={() => handleCreateOption("Event")}
              className="w-full px-4 py-3 text-left text-sm hover:bg-[#3D3D3D] transition-colors"
            >
              Event
            </button>
            <button 
              onClick={() => handleCreateOption("Task")}
              className="w-full px-4 py-3 text-left text-sm hover:bg-[#3D3D3D] transition-colors"
            >
              Task
            </button>
            <button 
              onClick={() => handleCreateOption("Appointment schedule")}
              className="w-full px-4 py-3 text-left text-sm hover:bg-[#3D3D3D] transition-colors"
            >
              Appointment schedule
            </button>
          </div>
        </PopoverContent>
      </Popover>
      
      <div className={`h-screen bg-[#1B1B1B] text-white flex flex-col justify-center transition-all duration-300 ease-in-out overflow-hidden ${isSidebarCollapsed ? 'w-0 p-0' : 'w-72 p-4'}`}>
        {!isSidebarCollapsed && (
          <>
                      {/* Mini Calendar */}
                      <div className="mb-3 px-2">
                          <div className="flex items-center justify-between mb-4">
                              <h2 className="text-sm px-3">{formatMonthYear()}</h2>
                              <div className="flex gap-1">
                                  <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={handlePrevMonth}
                                      className="h-8 w-8 text-white hover:bg-[#2D2D2D]"
                                  >
                                      <ChevronLeft className="h-2 w-2" />
                                  </Button>
                                  <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={handleNextMonth}
                                      className="h-8 w-8 text-white hover:bg-[#2D2D2D]"
                                  >
                                      <ChevronRight className="h-2 w-2" />
                                  </Button>
                              </div>
                          </div>

                          {/* Calendar Grid */}
                          <div className="space-y-2">
                              {/* Day headers */}
                              <div className="grid grid-cols-7 gap-1 mb-2">
                                  {days.map((day, i) => (
                                      <div
                                          key={i}
                                          className="text-center text-xxs font-medium text-gray-400"
                                      >
                                          {day}
                                      </div>
                                  ))}
                              </div>

                              {/* Date grid */}
                              <div className="grid grid-cols-7 gap-1">
                                  {calendarDates.map((dateObj, idx) => {
                                      const isToday = isSameDay(dateObj.fullDate, today);
                                      const isSelected = isSameDay(dateObj.fullDate, selectedDate);

                                      return (
                                          <button
                                              key={idx}
                                              onClick={() => handleDateClick(dateObj.fullDate)}
                                              className={`
                     h-7 w-7 text-xxs flex cursor-pointer items-center justify-center rounded-full
                    transition-colors
                    ${isToday
                                                      ? "bg-[#A9CAFB] text-black hover:bg-[#9AB8E8]"
                                                      : isSelected
                                                          ? "bg-[#1A73E8] text-white hover:bg-[#1557B0]"
                                                          : !dateObj.isCurrentMonth
                                                              ? "text-gray-600 hover:bg-[#2D2D2D]"
                                                              : "text-gray-300 hover:bg-[#2D2D2D]"}
                  `}
                                          >
                                              {dateObj.date}
                                          </button>
                                      );
                                  })}
                              </div>
                          </div>
                      </div>

                      {/* Search for people */}
                      <div className="flex w-10/12 items-center self-center gap-3 px-6 py-3 mb-4 bg-[#2D2D2D] rounded-md cursor-pointer hover:bg-[#3D3D3D] transition-colors">
                          <Users className="h-4 w-4 text-gray-300" />
                          <span className="text-xs text-gray-300">Search for people</span>
                      </div>

                      {/* Booking pages */}
                      <div className="mb-4">
                          <div className="flex items-center justify-between px-2 pl-4 py-2 rounded cursor-pointer">
                              <span className="text-sm">Booking pages</span>
                              <Plus className="h-8 w-8 p-2 rounded-full hover:bg-[#2D2D2D]" />
                          </div>
                      </div>

                      {/* My calendars - Accordion */}
                      <Accordion type="single" collapsible defaultValue="my-calendars" className="mb-2">
                          <AccordionItem value="my-calendars" className="border-none">
                              <AccordionTrigger className="px-4 py-3 hover:bg-[#2D2D2D] rounded-full hover:no-underline">
                                  <span className="text-sm">My calendars</span>
                              </AccordionTrigger>
                              <AccordionContent className="pb-2 pt-1 px-6 flex flex-col gap-2">
                                  {/* Calendar items would go here */}
                                  <CheckBox />
                                  <CheckBox />
                              </AccordionContent>
                          </AccordionItem>
                      </Accordion>

                      {/* Other calendars - Accordion */}
                      <Accordion type="single" collapsible defaultValue="other-calendars">
                          <AccordionItem value="other-calendars" className="border-none">
                              <AccordionTrigger className="px-4 py-2 hover:bg-[#2D2D2D] rounded-full hover:no-underline">
                                  <div className="flex items-center justify-between w-full">
                                      <span className="text-sm">Other calendars</span>
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <button 
                                            className="h-8 w-8 p-2 rounded-full hover:bg-[#3D3D3D] flex items-center justify-center"
                                            onClick={(e) => e.stopPropagation()}
                                            title="Add calendar"
                                          >
                                            <Plus className="h-4 w-4" />
                                          </button>
                                        </PopoverTrigger>
                                        <PopoverContent 
                                          className="w-64 p-0 bg-[#2D2D2D] border-[#3D3D3D] text-white"
                                          align="start"
                                          side="right"
                                        >
                                          <div className="py-2">
                                            <button className="w-full px-4 py-3 text-left text-sm hover:bg-[#3D3D3D] transition-colors">
                                              Subscribe to calendar
                                            </button>
                                            <button className="w-full px-4 py-3 text-left text-sm hover:bg-[#3D3D3D] transition-colors">
                                              Create new calendar
                                            </button>
                                            <button className="w-full px-4 py-3 text-left text-sm hover:bg-[#3D3D3D] transition-colors">
                                              Browse calendars of interest
                                            </button>
                                            <button className="w-full px-4 py-3 text-left text-sm hover:bg-[#3D3D3D] transition-colors">
                                              From URL
                                            </button>
                                            <button className="w-full px-4 py-3 text-left text-sm hover:bg-[#3D3D3D] transition-colors">
                                              Import
                                            </button>
                                          </div>
                                        </PopoverContent>
                                      </Popover>
                                  </div>
                              </AccordionTrigger>
                              <AccordionContent className="pb-2 pt-1 px-6">
                                  {/* Other calendar items would go here */}
                              </AccordionContent>
                          </AccordionItem>
                      </Accordion>
                  </>
        )}
      </div>

      <EventDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        initialTab={dialogTab}
      />
    </>
  );
};

export default SidebarComponent;