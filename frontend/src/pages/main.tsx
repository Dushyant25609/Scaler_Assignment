import Navbar from "@/components/navbar/navbar";
import SidebarComponent from "@/components/sidebar/sidebar";
import TaskSidebar from "@/components/sidebar/TaskSidebar";
import DayView from "@/components/calendar/DayView";
import WeekView from "@/components/calendar/WeekView";
import MonthView from "@/components/calendar/MonthView";
import YearView from "@/components/calendar/YearView";
import { useCalendarStore } from "@/store/calendarStore";
import TaskView from "@/components/calendar/TaskView";
import ScheduleView from "@/components/calendar/ScheduleView";
import FourDayView from "@/components/calendar/FourDayView";
import { useEffect } from "react";

const MainPage = () => {
  const { currentView, activeViewToggle, initializeData } = useCalendarStore();

  // Fetch all data on mount
  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const renderView = () => {
    if (activeViewToggle === "tasks") {
      return <TaskView />;
    }

    switch (currentView) {
      case "Day":
        return <DayView />;
      case "Week":
        return <WeekView />;
      case "Month":
        return <MonthView />;
      case "Year":
        return <YearView />;
      case "Schedule":
        return <ScheduleView />;
      case "4 days":
        return <FourDayView />;
      default:
        return <DayView />;
    }
  };

  return (
  <div className="flex flex-col h-screen bg-[#1B1B1B]">
    <Navbar />
    <div className="flex flex-1 overflow-hidden mt-3">
      {activeViewToggle === "tasks" ? <TaskSidebar /> : <SidebarComponent />}
      {renderView()}
    </div>
  </div>
  );
};

export default MainPage;