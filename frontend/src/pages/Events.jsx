import { useEffect, useState } from 'react';
import EventFrequencyChart from '../charts/EventFrequencyChart';
import DataTable from '../components/DataTable';
import { getEventFrequency } from '../services/api';

export default function Events() {
  const [eventFrequency, setEventFrequency] = useState([]);

  useEffect(() => {
    getEventFrequency().then(res => setEventFrequency(res.data));
  }, []);

  const columns = [
    { header: 'Event Name', key: 'event_name' },
    { header: 'Count', key: 'event_count' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <div className="font-semibold text-slate-700 mb-4">Event Frequency</div>
            <EventFrequencyChart data={eventFrequency} />
          </div>
        </div>
        <div className="col-span-1">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <div className="font-semibold text-slate-700 mb-4">Top Events</div>
            <DataTable columns={columns} data={eventFrequency} />
          </div>
        </div>
      </div>
    </div>
  );
}
