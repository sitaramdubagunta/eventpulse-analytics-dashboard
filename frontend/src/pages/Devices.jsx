import { useEffect, useState } from 'react';
import DeviceUsageChart from '../charts/DeviceUsageChart';
import { getDeviceUsage } from '../services/api';

export default function Devices() {
  const [deviceUsage, setDeviceUsage] = useState([]);

  useEffect(() => {
    getDeviceUsage().then(res => setDeviceUsage(res.data));
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <div className="font-semibold text-slate-700 mb-4">Device Usage</div>
            <DeviceUsageChart data={deviceUsage} />
          </div>
        </div>
        <div className="col-span-1">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <div className="font-semibold text-slate-700 mb-4">Device Breakdown</div>
            <ul className="divide-y divide-slate-200">
              {deviceUsage.map((d, idx) => (
                <li key={idx} className="py-3 flex justify-between text-slate-700">
                  <span>{d.device}</span>
                  <span className="font-semibold">{d.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
