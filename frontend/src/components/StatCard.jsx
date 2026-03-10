export default function StatCard({ title, value, icon, accent }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6 flex items-center space-x-4">
      {icon && <div className={`text-2xl ${accent}`}>{icon}</div>}
      <div>
        <div className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-1">{title}</div>
        <div className="text-2xl font-bold text-slate-800">{value}</div>
      </div>
    </div>
  );
}
