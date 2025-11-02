import mongoose from 'mongoose';
import Event from '../models/Event';
import Task from '../models/Task';
import Appointment from '../models/Appointment';
import Calendar from '../models/Calendar';
import TaskList from '../models/TaskList';

const MONGODB_URI = 'mongodb+srv://honey25609_db_user:ZjRTaFFqdaDYuDQy@cluster0.cbqosdm.mongodb.net/calendar-app?retryWrites=true&w=majority';

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Event.deleteMany({});
    await Task.deleteMany({});
    await Appointment.deleteMany({});
    await Calendar.deleteMany({});
    await TaskList.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create calendars
    const calendar1 = await Calendar.create({
      name: 'Dushyant',
      color: '#1A73E8',
      isVisible: true
    });

    await Calendar.create({
      name: 'Work',
      color: '#D50000',
      isVisible: true
    });

    await Calendar.create({
      name: 'Personal',
      color: '#F4511E',
      isVisible: true
    });

    console.log('📅 Created calendars');

    // Create task list
    const taskList = await TaskList.create({
      name: 'My Tasks',
      count: 0
    });

    console.log('📝 Created task list');

    // Create events
    await Event.create({
      title: 'Team Meeting',
      date: '2025-11-03',
      startTime: '10:00am',
      endTime: '11:00am',
      isAllDay: false,
      guests: 'john@example.com, jane@example.com',
      location: 'Conference Room A',
      description: 'Weekly team sync meeting',
      calendarId: String(calendar1._id),
      repeatOption: 'Weekly'
    });

    await Event.create({
      title: 'Project Deadline',
      date: '2025-11-05',
      startTime: '9:00am',
      endTime: '5:00pm',
      isAllDay: true,
      calendarId: String(calendar1._id),
      repeatOption: 'Does not repeat'
    });

    console.log('📆 Created events');

    // Create tasks
    await Task.create({
      title: 'Complete presentation',
      date: '2025-11-04',
      time: '2:00pm',
      deadline: '2025-11-04',
      description: 'Finish Q4 presentation slides',
      taskListId: String(taskList._id),
      isCompleted: false
    });

    await Task.create({
      title: 'Review code',
      date: '2025-11-03',
      time: '11:00am',
      taskListId: String(taskList._id),
      isCompleted: true
    });

    console.log('✅ Created tasks');

    // Create appointment
    await Appointment.create({
      title: 'Client Meeting',
      date: '2025-11-06',
      startTime: '2:00pm',
      endTime: '3:00pm',
      calendarId: String(calendar1._id)
    });

    console.log('📞 Created appointment');

    console.log('🎉 Database seeded successfully!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
