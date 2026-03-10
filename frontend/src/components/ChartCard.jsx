export default function ChartCard({ title, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
      <div className="font-semibold text-slate-700 mb-4">{title}</div>
      {children}
    </div>
  );
}
