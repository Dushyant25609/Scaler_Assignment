import { X, Clock, Users, Video, MapPin, AlignLeft, Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useCalendarStore } from "@/store/calendarStore";

const EventDialog = ({ 
  isOpen, 
  onClose,
  selectedDateTime,
  initialTab = "Event",
  editingEvent = null,
  editingTask = null,
  editingAppointment = null,
}: { 
  isOpen: boolean; 
  onClose: () => void;
  selectedDateTime?: { date: Date; time?: string };
  initialTab?: "Event" | "Task" | "Appointment schedule";
  editingEvent?: any;
  editingTask?: any;
  editingAppointment?: any;
}) => {
  const { 
    createEvent, 
    updateEvent, 
    createTask, 
    updateTask, 
    createAppointment, 
    updateAppointment,
    calendars,
    taskLists,
    loading,
    fetchCalendars,
    fetchTaskLists
  } = useCalendarStore();
  const [activeTab, setActiveTab] = useState<"Event" | "Task" | "Appointment schedule">(initialTab);
  const [title, setTitle] = useState("");
  const [appointmentDate, setAppointmentDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState("11:30am");
  const [endTime, setEndTime] = useState("12:30pm");
  const [isEventTimeExpanded, setIsEventTimeExpanded] = useState(false);
  const [eventDate, setEventDate] = useState<Date>(new Date());
  const [eventStartTime, setEventStartTime] = useState("1:00pm");
  const [eventEndTime, setEventEndTime] = useState("2:00pm");
  const [isAllDay, setIsAllDay] = useState(false);
  const [repeatOption, setRepeatOption] = useState("Does not repeat");
  
  // Event tab fields
  const [guests, setGuests] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCalendarId, setSelectedCalendarId] = useState("");
  
  // Task tab fields
  const [taskDescription, setTaskDescription] = useState("");
  const [taskList, setTaskList] = useState("");
  const [taskDate, setTaskDate] = useState<Date>(new Date());
  const [taskTime, setTaskTime] = useState("11:30am");
  const [taskDeadline, setTaskDeadline] = useState("");

  // Fetch calendars and task lists when dialog opens
  useEffect(() => {
    if (isOpen) {
      if (calendars.length === 0) {
        fetchCalendars();
      }
      if (taskLists.length === 0) {
        fetchTaskLists();
      }
    }
  }, [isOpen, calendars.length, taskLists.length, fetchCalendars, fetchTaskLists]);

  // Set default calendar and task list when data is loaded
  useEffect(() => {
    if (calendars.length > 0 && !selectedCalendarId) {
      setSelectedCalendarId(calendars[0]._id || "");
    }
  }, [calendars, selectedCalendarId]);

  useEffect(() => {
    if (taskLists.length > 0 && !taskList) {
      setTaskList(taskLists[0]._id || "");
    }
  }, [taskLists, taskList]);

  // Load editing data
  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title);
      setEventDate(new Date(editingEvent.date));
      setEventStartTime(editingEvent.startTime || "1:00pm");
      setEventEndTime(editingEvent.endTime || "2:00pm");
      setIsAllDay(editingEvent.isAllDay || false);
      setGuests(editingEvent.guests || "");
      setLocation(editingEvent.location || "");
      setDescription(editingEvent.description || "");
      setRepeatOption(editingEvent.repeatOption || "Does not repeat");
      setSelectedCalendarId(editingEvent.calendarId || "");
      setActiveTab("Event");
    } else if (editingTask) {
      setTitle(editingTask.title);
      setTaskDescription(editingTask.description || "");
      setTaskList(editingTask.taskListId || "");
      if (editingTask.date) setTaskDate(new Date(editingTask.date));
      setTaskTime(editingTask.time || "11:30am");
      setTaskDeadline(editingTask.deadline || "");
      setActiveTab("Task");
    } else if (editingAppointment) {
      setTitle(editingAppointment.title);
      setAppointmentDate(new Date(editingAppointment.date));
      setStartTime(editingAppointment.startTime);
      setEndTime(editingAppointment.endTime);
      setSelectedCalendarId(editingAppointment.calendarId || "");
      setActiveTab("Appointment schedule");
    }
  }, [editingEvent, editingTask, editingAppointment]);

  // Update activeTab when initialTab changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Update state when selectedDateTime changes
  useEffect(() => {
    if (selectedDateTime) {
      setAppointmentDate(selectedDateTime.date);
      setEventDate(selectedDateTime.date);
      if (selectedDateTime.time) {
        setStartTime(selectedDateTime.time);
        setEventStartTime(selectedDateTime.time);
        // Set end time to 1 hour after start time
        const timeOptions = generateTimeOptions();
        const startIndex = timeOptions.indexOf(selectedDateTime.time);
        if (startIndex !== -1 && startIndex + 2 < timeOptions.length) {
          setEndTime(timeOptions[startIndex + 2]); // +2 = 1 hour later
          setEventEndTime(timeOptions[startIndex + 2]);
        }
      }
    }
  }, [selectedDateTime]);

  // Generate time options
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute of [0, 30]) {
        const period = hour < 12 ? "am" : "pm";
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const displayMinute = minute === 0 ? "00" : minute;
        times.push(`${displayHour}:${displayMinute}${period}`);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  const formatAppointmentDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const formatEventDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const formatEventTime = (startTime: string, endTime: string) => {
    return `${startTime} – ${endTime}`;
  };

  // Helper function to convert time string to minutes for comparison
  const timeToMinutes = (timeStr: string) => {
    const match = timeStr.match(/(\d+):(\d+)(am|pm)/);
    if (!match) return 0;
    
    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const period = match[3];
    
    if (period === 'pm' && hours !== 12) hours += 12;
    if (period === 'am' && hours === 12) hours = 0;
    
    return hours * 60 + minutes;
  };

  // Handle start time change with validation
  const handleStartTimeChange = (newStartTime: string) => {
    setStartTime(newStartTime);
    const startMinutes = timeToMinutes(newStartTime);
    const endMinutes = timeToMinutes(endTime);
    
    // If start time is greater than or equal to end time, set end time to next slot
    if (startMinutes >= endMinutes) {
      const currentIndex = timeOptions.indexOf(newStartTime);
      if (currentIndex < timeOptions.length - 1) {
        setEndTime(timeOptions[currentIndex + 1]);
      }
    }
  };

  // Handle end time change with validation
  const handleEndTimeChange = (newEndTime: string) => {
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(newEndTime);
    
    // Only set end time if it's greater than start time
    if (endMinutes > startMinutes) {
      setEndTime(newEndTime);
    }
  };

  // Handle event start time change with validation
  const handleEventStartTimeChange = (newStartTime: string) => {
    setEventStartTime(newStartTime);
    const startMinutes = timeToMinutes(newStartTime);
    const endMinutes = timeToMinutes(eventEndTime);
    
    // If start time is greater than or equal to end time, set end time to next slot
    if (startMinutes >= endMinutes) {
      const currentIndex = timeOptions.indexOf(newStartTime);
      if (currentIndex < timeOptions.length - 1) {
        setEventEndTime(timeOptions[currentIndex + 1]);
      }
    }
  };

  // Handle event end time change with validation
  const handleEventEndTimeChange = (newEndTime: string) => {
    const startMinutes = timeToMinutes(eventStartTime);
    const endMinutes = timeToMinutes(newEndTime);
    
    // Only set end time if it's greater than start time
    if (endMinutes > startMinutes) {
      setEventEndTime(newEndTime);
    }
  };

  // Format date to YYYY-MM-DD for API
  const formatDateForAPI = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Handle save
  const handleSave = async () => {
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    if (activeTab === "Event" && !selectedCalendarId) {
      alert("Please wait for calendars to load or create a calendar first");
      return;
    }

    if (activeTab === "Task" && !taskList) {
      alert("Please wait for task lists to load or create a task list first");
      return;
    }

    if (activeTab === "Appointment schedule" && !selectedCalendarId) {
      alert("Please wait for calendars to load or create a calendar first");
      return;
    }

    try {
      if (activeTab === "Event") {
        const eventData = {
          title,
          date: formatDateForAPI(eventDate),
          startTime: eventStartTime,
          endTime: eventEndTime,
          isAllDay,
          guests,
          location,
          description,
          calendarId: selectedCalendarId,
          repeatOption,
        };

        console.log('Sending event data:', eventData);

        if (editingEvent?._id) {
          await updateEvent(editingEvent._id, eventData);
        } else {
          await createEvent(eventData);
        }
      } else if (activeTab === "Task") {
        const taskData = {
          title,
          date: formatDateForAPI(taskDate),
          time: taskTime,
          deadline: taskDeadline,
          description: taskDescription,
          taskListId: taskList,
          isCompleted: false,
        };

        if (editingTask?._id) {
          await updateTask(editingTask._id, taskData);
        } else {
          await createTask(taskData);
        }
      } else if (activeTab === "Appointment schedule") {
        const appointmentData = {
          title,
          date: formatDateForAPI(appointmentDate),
          startTime,
          endTime,
          calendarId: selectedCalendarId,
        };

        if (editingAppointment?._id) {
          await updateAppointment(editingAppointment._id, appointmentData);
        } else {
          await createAppointment(appointmentData);
        }
      }

      // Reset form and close
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error saving:", error);
      alert("Failed to save. Please try again.");
    }
  };

  // Reset form
  const resetForm = () => {
    setTitle("");
    setGuests("");
    setLocation("");
    setDescription("");
    setTaskDescription("");
    setIsAllDay(false);
    setRepeatOption("Does not repeat");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#2D2D2D] rounded-lg w-full max-w-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <button title="Menu" className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button onClick={onClose} title="Close" className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Title Input */}
        <div className="px-6 pb-4">
          <input
            type="text"
            placeholder="Add title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent text-2xl font-normal text-white placeholder-gray-400 border-b-2 border-blue-500 focus:outline-none pb-2"
          />
        </div>

        {/* Tabs */}
        <div className="px-6 pb-4 flex gap-2">
          <Button
            onClick={() => setActiveTab("Event")}
            className={`px-6 py-2 rounded-lg text-sm ${
              activeTab === "Event"
                ? "bg-[#1A73E8] hover:bg-[#1557B0] text-white"
                : "bg-transparent hover:bg-[#3D3D3D] text-gray-300"
            }`}
          >
            Event
          </Button>
          <Button
            onClick={() => setActiveTab("Task")}
            className={`px-6 py-2 rounded-lg text-sm ${
              activeTab === "Task"
                ? "bg-[#1A73E8] hover:bg-[#1557B0] text-white"
                : "bg-transparent hover:bg-[#3D3D3D] text-gray-300"
            }`}
          >
            Task
          </Button>
          <Button
            onClick={() => setActiveTab("Appointment schedule")}
            className={`px-6 py-2 rounded-lg text-sm flex items-center gap-2 ${
              activeTab === "Appointment schedule"
                ? "bg-[#1A73E8] hover:bg-[#1557B0] text-white"
                : "bg-transparent hover:bg-[#3D3D3D] text-gray-300"
            }`}
          >
            Appointment schedule
            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">New</span>
          </Button>
        </div>

        {/* Content */}
        <div className="px-6 space-y-4">
          {activeTab === "Event" ? (
            <>
              {/* Date and Time - Expandable */}
              {!isEventTimeExpanded ? (
                <div 
                  className="flex items-center gap-4 py-3 hover:bg-[#3D3D3D] rounded-lg px-3 cursor-pointer"
                  onClick={() => setIsEventTimeExpanded(true)}
                >
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <div className="text-sm text-white">{formatEventDate(eventDate)}</div>
                    <div className="text-xs text-gray-400">{formatEventTime(eventStartTime, eventEndTime)}</div>
                    <div className="text-xs text-gray-400">Time zone • {repeatOption}</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Date Selection */}
                  <div className="flex items-center gap-4">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button title="Select date" className="flex-1 bg-[#3D3D3D] px-4 py-2 rounded-lg text-sm text-white cursor-pointer hover:bg-[#4D4D4D] transition-colors text-left">
                          {formatEventDate(eventDate)}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-[#2D2D2D] border-[#3D3D3D]" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={eventDate}
                          onSelect={(date) => date && setEventDate(date)}
                          className="rounded-md text-white [&_.rdp-weekday]:text-gray-400 [&_.rdp-day]:text-white [&_.rdp-day_button]:text-white [&_.rdp-day_button:hover]:bg-[#3D3D3D] [&_.rdp-day_button[data-selected-single=true]]:bg-[#1A73E8] [&_.rdp-day_button[data-selected-single=true]]:text-white [&_.rdp-caption_label]:text-white [&_.rdp-button_previous]:text-white [&_.rdp-button_next]:text-white [&_.rdp-day_button[data-today]]:bg-[#3D3D3D]"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Time Selection */}
                  <div className="flex items-center gap-3">
                    <select
                      value={eventStartTime}
                      onChange={(e) => handleEventStartTimeChange(e.target.value)}
                      title="Select start time"
                      className="flex-1 bg-[#3D3D3D] px-4 py-2 rounded-lg text-sm text-white cursor-pointer hover:bg-[#4D4D4D] transition-colors focus:outline-none"
                    >
                      {timeOptions.map((time) => (
                        <option key={time} value={time} className="bg-[#2D2D2D]">
                          {time}
                        </option>
                      ))}
                    </select>
                    <span className="text-gray-400">–</span>
                    <select
                      value={eventEndTime}
                      onChange={(e) => handleEventEndTimeChange(e.target.value)}
                      title="Select end time"
                      className="flex-1 bg-[#3D3D3D] px-4 py-2 rounded-lg text-sm text-white cursor-pointer hover:bg-[#4D4D4D] transition-colors focus:outline-none"
                    >
                      {timeOptions.map((time) => {
                        const isDisabled = timeToMinutes(time) <= timeToMinutes(eventStartTime);
                        return (
                          <option 
                            key={time} 
                            value={time} 
                            disabled={isDisabled}
                            className="bg-[#2D2D2D]"
                          >
                            {time}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* All day and Time zone */}
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isAllDay}
                        onChange={(e) => setIsAllDay(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-400 bg-[#3D3D3D]"
                      />
                      <span className="text-sm text-white">All day</span>
                    </label>
                    <button className="px-4 py-2 bg-[#3D3D3D] rounded-lg text-sm text-white hover:bg-[#4D4D4D] transition-colors">
                      Time zone
                    </button>
                  </div>

                  {/* Repeat Dropdown */}
                  <div>
                    <select
                      value={repeatOption}
                      onChange={(e) => setRepeatOption(e.target.value)}
                      title="Repeat option"
                      className="w-full bg-[#3D3D3D] px-4 py-2 rounded-lg text-sm text-white cursor-pointer hover:bg-[#4D4D4D] transition-colors focus:outline-none"
                    >
                      <option value="Does not repeat" className="bg-[#2D2D2D]">Does not repeat</option>
                      <option value="Daily" className="bg-[#2D2D2D]">Daily</option>
                      <option value="Weekly" className="bg-[#2D2D2D]">Weekly on {eventDate.toLocaleDateString('en-US', { weekday: 'long' })}</option>
                      <option value="Monthly" className="bg-[#2D2D2D]">Monthly on day {eventDate.getDate()}</option>
                      <option value="Annually" className="bg-[#2D2D2D]">Annually on {eventDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</option>
                      <option value="Every weekday" className="bg-[#2D2D2D]">Every weekday (Monday to Friday)</option>
                      <option value="Custom" className="bg-[#2D2D2D]">Custom...</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Add guests */}
              <div className="flex items-center gap-4 py-3 hover:bg-[#3D3D3D] rounded-lg px-3">
                <Users className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Add guests"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-white placeholder-gray-400 focus:outline-none"
                />
              </div>

              {/* Add Google Meet */}
              <div className="flex items-center gap-4 py-3 hover:bg-[#3D3D3D] rounded-lg px-3 cursor-pointer">
                <Video className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-400">Add Google Meet video conferencing</span>
              </div>

              {/* Add location */}
              <div className="flex items-center gap-4 py-3 hover:bg-[#3D3D3D] rounded-lg px-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Add location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-white placeholder-gray-400 focus:outline-none"
                />
              </div>

              {/* Add description */}
              <div className="flex items-start gap-4 py-3 hover:bg-[#3D3D3D] rounded-lg px-3">
                <AlignLeft className="w-5 h-5 text-gray-400 mt-1" />
                <textarea
                  placeholder="Add description or a Google Drive attachment"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-white placeholder-gray-400 focus:outline-none resize-none"
                  rows={1}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = target.scrollHeight + 'px';
                  }}
                />
              </div>

              {/* Calendar selector */}
              <div className="flex items-center gap-4 py-3 hover:bg-[#3D3D3D] rounded-lg px-3 cursor-pointer">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <select
                    value={selectedCalendarId}
                    onChange={(e) => setSelectedCalendarId(e.target.value)}
                    title="Select calendar"
                    className="w-full bg-transparent text-sm text-white focus:outline-none cursor-pointer"
                    disabled={calendars.length === 0}
                  >
                    {calendars.length === 0 ? (
                      <option value="" className="bg-[#2D2D2D]">Loading calendars...</option>
                    ) : (
                      calendars.map((cal) => (
                        <option key={cal._id} value={cal._id} className="bg-[#2D2D2D]">
                          {cal.name}
                        </option>
                      ))
                    )}
                  </select>
                  <div className="text-xs text-gray-400">Busy • Default visibility • Notify 30 minutes before</div>
                </div>
              </div>
            </>
          ) : activeTab === "Task" ? (
            <>
              {/* Task Date and Time */}
              <div className="flex items-center gap-4 py-3 hover:bg-[#3D3D3D] rounded-lg px-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button title="Select date" className="w-full text-left">
                        <div className="text-sm text-white">{formatEventDate(taskDate)} {taskTime}</div>
                        <div className="text-xs text-gray-400">Doesn't repeat</div>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-[#2D2D2D] border-[#3D3D3D]" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={taskDate}
                        onSelect={(date) => date && setTaskDate(date)}
                        className="rounded-md text-white [&_.rdp-weekday]:text-gray-400 [&_.rdp-day]:text-white [&_.rdp-day_button]:text-white [&_.rdp-day_button:hover]:bg-[#3D3D3D] [&_.rdp-day_button[data-selected-single=true]]:bg-[#1A73E8] [&_.rdp-day_button[data-selected-single=true]]:text-white [&_.rdp-caption_label]:text-white [&_.rdp-button_previous]:text-white [&_.rdp-button_next]:text-white [&_.rdp-day_button[data-today]]:bg-[#3D3D3D]"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Add deadline */}
              <div className="flex items-center gap-4 py-3 hover:bg-[#3D3D3D] rounded-lg px-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2"/>
                </svg>
                <input
                  type="date"
                  value={taskDeadline}
                  onChange={(e) => setTaskDeadline(e.target.value)}
                  placeholder="Add deadline"
                  className="flex-1 bg-transparent text-sm text-white placeholder-gray-400 focus:outline-none"
                />
              </div>

              {/* Add description */}
              <div className="py-3 px-3">
                <textarea
                  placeholder="Add description"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="w-full bg-[#3D3D3D] text-sm text-white placeholder-gray-400 rounded-lg p-3 focus:outline-none resize-none h-32"
                />
              </div>

              {/* Task List Selector */}
              <div className="flex items-center gap-4 py-3 px-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"/>
                </svg>
                <select 
                  title="Select task list" 
                  value={taskList}
                  onChange={(e) => setTaskList(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-white focus:outline-none cursor-pointer"
                  disabled={taskLists.length === 0}
                >
                  {taskLists.length === 0 ? (
                    <option value="" className="bg-[#2D2D2D]">Loading task lists...</option>
                  ) : (
                    taskLists.map((list) => (
                      <option key={list._id} value={list._id} className="bg-[#2D2D2D]">
                        {list.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </>
          ) : (
            <>
              {/* Appointment Schedule - Date Selection with Calendar */}
              <div className="flex items-center gap-4 py-3 px-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button title="Select date" className="w-full bg-[#3D3D3D] px-4 py-2 rounded-lg text-sm text-white cursor-pointer hover:bg-[#4D4D4D] transition-colors flex items-center justify-between">
                        <span>{formatAppointmentDate(appointmentDate)}</span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-[#2D2D2D] border-[#3D3D3D]" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={appointmentDate}
                        onSelect={(date) => date && setAppointmentDate(date)}
                        className="rounded-md text-white [&_.rdp-weekday]:text-gray-400 [&_.rdp-day]:text-white [&_.rdp-day_button]:text-white [&_.rdp-day_button:hover]:bg-[#3D3D3D] [&_.rdp-day_button[data-selected-single=true]]:bg-[#1A73E8] [&_.rdp-day_button[data-selected-single=true]]:text-white [&_.rdp-caption_label]:text-white [&_.rdp-button_previous]:text-white [&_.rdp-button_next]:text-white [&_.rdp-day_button[data-today]]:bg-[#3D3D3D]"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Time Range Selection with Dropdowns */}
              <div className="flex items-center gap-4 px-3">
                <div className="w-5 h-5"></div>
                <div className="flex-1 flex items-center gap-3">
                  <select
                    value={startTime}
                    onChange={(e) => handleStartTimeChange(e.target.value)}
                    title="Select start time"
                    className="bg-[#3D3D3D] px-4 py-2 rounded-lg text-sm text-white cursor-pointer hover:bg-[#4D4D4D] transition-colors focus:outline-none appearance-none pr-8 flex-1"
                  >
                    {timeOptions.map((time) => (
                      <option key={time} value={time} className="bg-[#2D2D2D]">
                        {time}
                      </option>
                    ))}
                  </select>
                  <select
                    value={endTime}
                    onChange={(e) => handleEndTimeChange(e.target.value)}
                    title="Select end time"
                    className="bg-[#3D3D3D] px-4 py-2 rounded-lg text-sm text-white cursor-pointer hover:bg-[#4D4D4D] transition-colors focus:outline-none appearance-none pr-8 flex-1"
                  >
                  
                    {timeOptions.map((time) => {
                      const isDisabled = timeToMinutes(time) <= timeToMinutes(startTime);
                      return (
                        <option 
                          key={time} 
                          value={time} 
                          disabled={isDisabled}
                          className="bg-[#2D2D2D]"
                        >
                          {time}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Info Box */}
              <div className="mx-3 my-6 p-4 bg-[#1A1A1A] border border-[#3D3D3D] rounded-lg">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm text-gray-300 mb-3">
                      Create a booking page that you can share with others so that they can book time with you themselves
                    </p>
                    <div className="flex gap-4">
                      <button title="See how it works" className="text-sm text-blue-400 hover:underline">See how it works</button>
                      <button title="Learn more" className="text-sm text-blue-400 hover:underline">Learn more</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-[#3D3D3D] my-4"></div>

              {/* Calendar selector */}
              <div className="flex items-center gap-4 py-3 px-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <select
                  value={selectedCalendarId}
                  onChange={(e) => setSelectedCalendarId(e.target.value)}
                  title="Select calendar"
                  className="flex-1 bg-transparent text-sm text-white focus:outline-none cursor-pointer"
                  disabled={calendars.length === 0}
                >
                  {calendars.length === 0 ? (
                    <option value="">Loading calendars...</option>
                  ) : (
                    calendars.map((cal) => (
                      <option key={cal._id} value={cal._id} className="bg-[#2D2D2D]">
                        {cal.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Divider */}
              <div className="border-t border-[#3D3D3D] my-4"></div>

              {/* Appointment selector */}
              <div className="flex items-center gap-4 py-3 px-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <select
                  value={selectedCalendarId}
                  onChange={(e) => setSelectedCalendarId(e.target.value)}
                  title="Select calendar"
                  className="flex-1 bg-transparent text-sm text-white focus:outline-none cursor-pointer"
                  disabled={calendars.length === 0}
                >
                  {calendars.length === 0 ? (
                    <option value="">Loading calendars...</option>
                  ) : (
                    calendars.map((cal) => (
                      <option key={cal._id} value={cal._id} className="bg-[#2D2D2D]">
                        {cal.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 pt-8">
          {activeTab === "Appointment schedule" ? (
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-[#A9CAFB] hover:bg-[#9AB8E8] text-black px-8 py-2 rounded-full text-sm font-medium disabled:opacity-50"
            >
              {loading ? "Saving..." : editingAppointment ? "Update" : "Set up the schedule"}
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                className="text-sm text-white hover:bg-[#3D3D3D] px-6 py-2"
              >
                More options
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading}
                className="bg-[#A9CAFB] hover:bg-[#9AB8E8] text-black px-8 py-2 rounded-full text-sm font-medium disabled:opacity-50"
              >
                {loading ? "Saving..." : (editingEvent || editingTask) ? "Update" : "Save"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDialog;
