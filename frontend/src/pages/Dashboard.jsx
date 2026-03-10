import { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import WeeklyUsersChart from '../charts/WeeklyUsersChart';
import EventFrequencyChart from '../charts/EventFrequencyChart';
import DeviceUsageChart from '../charts/DeviceUsageChart';
import SessionDurationChart from '../charts/SessionDurationChart';
import { getWeeklyActiveUsers, getEventFrequency, getDeviceUsage, getSessionDuration } from '../services/api';
import { FaUsers, FaCalendarAlt, FaClock, FaMobileAlt } from 'react-icons/fa';

export default function Dashboard() {
  const [weeklyUsers, setWeeklyUsers] = useState([]);
  const [eventFrequency, setEventFrequency] = useState([]);
  const [deviceUsage, setDeviceUsage] = useState([]);
  const [sessionDuration, setSessionDuration] = useState([]);

  useEffect(() => {
    getWeeklyActiveUsers().then(res => setWeeklyUsers(res.data));
    getEventFrequency().then(res => setEventFrequency(res.data));
    getDeviceUsage().then(res => {
      // Convert count to number for recharts
      const data = Array.isArray(res.data)
        ? res.data.map(d => ({ ...d, count: Number(d.count) }))
        : [];
      setDeviceUsage(data);
    });
    getSessionDuration().then(res => setSessionDuration(res.data));
  }, []);

  const kpi = [
    {
      title: 'Weekly Active Users',
      value: weeklyUsers.length ? weeklyUsers[weeklyUsers.length - 1].active_users : '--',
      icon: <FaUsers />, accent: 'text-indigo-600'
    },
    {
      title: 'Total Events',
      value: eventFrequency.reduce((sum, e) => sum + Number(e.event_count), 0),
      icon: <FaCalendarAlt />, accent: 'text-cyan-500'
    },
    {
      title: 'Avg Session Duration',
      value: sessionDuration.length ? Math.round(sessionDuration[sessionDuration.length - 1].avg_session_duration) + 's' : '--',
      icon: <FaClock />, accent: 'text-green-500'
    },
    {
      title: 'Top Device',
      value: deviceUsage.length ? deviceUsage[0].device : '--',
      icon: <FaMobileAlt />, accent: 'text-slate-500'
    },
  ];

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpi.map((item, idx) => (
          <StatCard key={idx} {...item} />
        ))}
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard title="Weekly Active Users">
          <WeeklyUsersChart data={weeklyUsers} />
        </ChartCard>
        <ChartCard title="Event Frequency">
          <EventFrequencyChart data={eventFrequency} />
        </ChartCard>
        <ChartCard title="Device Usage">
          <DeviceUsageChart data={deviceUsage} />
        </ChartCard>
        <ChartCard title="Session Duration Trend">
          <SessionDurationChart data={sessionDuration} />
        </ChartCard>
      </div>
    </div>
  );
}
