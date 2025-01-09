import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { X, Download, Search } from "lucide-react";

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  //checking if there is data in local storage and setting if exist
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem('calendarTasks');
    return storedTasks ? JSON.parse(storedTasks) : {};
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    starttime: "09:00",
    endtime: "17:00"
  });

  useEffect(() => {
    const storedTasks = localStorage.getItem('calendarTasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('calendarTasks', JSON.stringify(tasks));
  }, [tasks]);

  const getDaysInMonth = (month, year) => {
    return new Array(new Date(year, month + 1, 0).getDate())
      .fill(null)
      .map((_, i) => new Date(year, month, i + 1));
  };

  const formatDate = (date) => {
    if (!date) return null;
    return date.toISOString().split('T')[0];
  };

  const handleDateClick = (date) => {
    if (!date) return;
    setSelectedDate(date);
    setDialogOpen(true);
    setFormData({
      title: "",
      description: "",
      starttime: "09:00",
      endtime: "10:00"
    });
  };
  const checkTimeOverlap = (newStart, newEnd, dateStr) => {
    if (!tasks[dateStr]) return false;
    
    const newStartMinutes = timeToMinutes(newStart);
    const newEndMinutes = timeToMinutes(newEnd);
    
    return tasks[dateStr].some(task => {
      const existingStartMinutes = timeToMinutes(task.starttime);
      const existingEndMinutes = timeToMinutes(task.endtime);
      
      return (
        (newStartMinutes >= existingStartMinutes && newStartMinutes < existingEndMinutes) ||
        (newEndMinutes > existingStartMinutes && newEndMinutes <= existingEndMinutes) ||
        (newStartMinutes <= existingStartMinutes && newEndMinutes >= existingEndMinutes)
      );
    });
  };
  
  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };
  

  
  const handleSubmit = (e) => {
    e.preventDefault();
    const dateStr = formatDate(selectedDate);
    if (!dateStr) return;
  

    if (timeToMinutes(formData.endtime) <= timeToMinutes(formData.starttime)) {
      alert('End time must be after start time');
      return;
    }
  
    // Check for time overlap
    if (checkTimeOverlap(formData.starttime, formData.endtime, dateStr)) {
      alert('This time slot overlaps with an existing task');
      return;
    }
  
    const newTask = {
      ...formData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
  
    setTasks(prev => ({
      ...prev,
      [dateStr]: [...(prev[dateStr] || []), newTask]
    }));
    setDialogOpen(false);
    setFormData({
      title: "",
      description: "",
      starttime: "09:00",
      endtime: "17:00"
    });
  };

  const handleDeleteTask = (dateStr, taskId) => {
    setTasks(prev => ({
      ...prev,
      [dateStr]: prev[dateStr].filter(task => task.id !== taskId)
    }));
  };

  // download csv
  const downloadCSV = () => {
    // Check if there are any tasks
    if (Object.keys(tasks).length === 0) {
      alert('No tasks to export');
      return;
    }
  
    try {

      const rows = [];
      
      
      rows.push(['Date', 'Title', 'Description', 'Start Time', 'End Time']);
      
 
      Object.entries(tasks).forEach(([date, dayTasks]) => {
        if (dayTasks && dayTasks.length > 0) {
          dayTasks.forEach(task => {
            // Escape special characters and wrap in quotes to handle commas in text
            const escapedDescription = task.description.replace(/"/g, '""');
            const escapedTitle = task.title.replace(/"/g, '""');
            
            rows.push([
              date,
              `"${escapedTitle}"`,
              `"${escapedDescription}"`,
              task.starttime,
              task.endtime
            ]);
          });
        }
      });
  
      
      const csvContent = rows.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      const fileName = `calendar-tasks-${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`;
      
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Error exporting tasks. Please try again.');
    }
  };

  const getFilteredTasks = (dateStr) => {
    if (!tasks[dateStr]) return [];
    return tasks[dateStr].filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const daysInMonth = getDaysInMonth(currentDate.getMonth(), currentDate.getFullYear());
  const firstDayIndex = startOfMonth.getDay();
  const grid = [...new Array(firstDayIndex).fill(null), ...daysInMonth];

  const TaskList = ({ tasks, dateStr }) => (
    <div className="mt-4 space-y-2">
      {tasks.length === 0 ? (
        <p className="text-center text-gray-500">No tasks found</p>
      ) : (
        tasks.map(task => (
          <div key={task.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{task.title}</h3>
                <p className="text-sm text-gray-600">{task.starttime} - {task.endtime}</p>
                <p className="text-sm mt-1">{task.description}</p>
              </div>
              <button
                onClick={() => handleDeleteTask(dateStr, task.id)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <Card className="w-full max-w-4xl mx-auto p-2 sm:p-4">
      <CardHeader className="text-center p-2 sm:p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-auto pl-10 pr-4 py-2 border rounded-md"
            />
          </div>
          <button
            onClick={downloadCSV}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
        <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold">
          {currentDate.toLocaleDateString("default", { month: "long", year: "numeric" })}
        </CardTitle>
      </CardHeader>

      <CardContent className="overflow-x-auto p-2 sm:p-4">
        <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-4 text-center text-xs sm:text-sm md:text-base font-medium">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-gray-600 p-1 sm:p-2">{day}</div>
          ))}

          {grid.map((day, index) => {
            const dateStr = formatDate(day);
            const dayTasks = dateStr && getFilteredTasks(dateStr);
            const isToday = day &&
              day.getDate() === new Date().getDate() &&
              day.getMonth() === new Date().getMonth() &&
              day.getFullYear() === new Date().getFullYear();

            return (
              <div
                key={index}
                className={`aspect-square flex flex-col items-center justify-center rounded-lg cursor-pointer shadow-sm sm:shadow-md transition-colors text-xs sm:text-sm md:text-base p-1
                  ${dayTasks?.length ? 'bg-green-100 hover:bg-green-200' :
                    isToday ? "bg-blue-500 text-white" :
                      day ? "bg-gray-100 hover:bg-gray-200" : ""
                  }`}
                onClick={() => handleDateClick(day)}
              >
                {day && (
                  <>
                    <span>{day.getDate()}</span>
                    {dayTasks?.length > 0 && (
                      <div className="text-xs mt-0.5 sm:mt-1">
                        {dayTasks.length} task{dayTasks.length > 1 ? 's' : ''}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between mt-2 sm:mt-4 p-2 sm:p-4">
        <button
          className="px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gray-300 rounded-md hover:bg-gray-400 transition-colors"
          onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
        >
          Previous
        </button>
        <button
          className="px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gray-300 rounded-md hover:bg-gray-400 transition-colors"
          onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
        >
          Next
        </button>
      </CardFooter>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
  <DialogContent className="sm:max-w-3xl mx-4 bg-white p-4 mt-28" >
    <div className="relative">
      
      <DialogHeader className="text-center pb-4">
        <DialogTitle className="text-2xl font-bold text-blue-600">
          {selectedDate?.toLocaleDateString()}
        </DialogTitle>
      </DialogHeader>

      {selectedDate && (
        <TaskList
          tasks={getFilteredTasks(formatDate(selectedDate))}
          dateStr={formatDate(selectedDate)}
        />
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={e => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            rows="3"
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <input
              type="time"
              name="starttime"
              value={formData.starttime}
              onChange={e => {
                const newStartTime = e.target.value;
                setFormData(prev => ({ ...prev, starttime: newStartTime }));
              }}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">End Time</label>
            <input
              type="time"
              name="endtime"
              value={formData.endtime}
              onChange={e => {
                const newEndTime = e.target.value;
                setFormData(prev => ({ ...prev, endtime: newEndTime }));
              }}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full mt-6 px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Add Task
        </button>
      </form>
    </div>
  </DialogContent>
</Dialog>
    </Card>
  );
}

export default Calendar;