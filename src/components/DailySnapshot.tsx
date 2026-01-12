import { TrendingUp, TrendingDown, MessageSquare } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DailySnapshotProps {
  onOpenChat: () => void;
}

export default function DailySnapshot({ onOpenChat }: DailySnapshotProps) {
  // Mock data for production trend
  const productionData = [
    { day: 'Mon', actual: 2650, target: 3000 },
    { day: 'Tue', actual: 2800, target: 3000 },
    { day: 'Wed', actual: 2720, target: 3000 },
    { day: 'Thu', actual: 2890, target: 3000 },
    { day: 'Fri', actual: 2710, target: 3000 },
    { day: 'Sat', actual: 2820, target: 3000 },
    { day: 'Today', actual: 2847, target: 3000 },
  ];

  // Mock data for behind/ahead analysis
  const scheduleData = [
    { name: 'Product Line A', value: 120, status: 'ahead' },
    { name: 'Product Line B', value: -85, status: 'behind' },
    { name: 'Product Line C', value: 45, status: 'ahead' },
    { name: 'Product Line D', value: -30, status: 'behind' },
    { name: 'Product Line E', value: 90, status: 'ahead' },
  ];

  // Mock data for quality metrics
  const qualityData = [
    { name: 'Dimensional Issues', value: 45 },
    { name: 'Surface Defects', value: 28 },
    { name: 'Material Defects', value: 18 },
    { name: 'Assembly Errors', value: 12 },
    { name: 'Other', value: 7 },
  ];

  const COLORS = {
    ahead: '#10B981',
    behind: '#EF4444',
    quality: ['#2E5C8A', '#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE'],
  };

  const miniSparklineData = [2650, 2800, 2720, 2890, 2710, 2820, 2847];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Daily Snapshot</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">January 11, 2026</span>
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:border-[#2E5C8A] focus:outline-none focus:ring-2 focus:ring-[#2E5C8A] focus:border-transparent transition-all cursor-pointer">
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>Custom</option>
            </select>
          </div>
        </div>
        <button
          onClick={onOpenChat}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#2E5C8A] text-white rounded-lg hover:bg-[#244A6E] transition-all hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <MessageSquare className="w-4 h-4" />
          Ask about today's performance →
        </button>
      </div>

      {/* Top Row - Critical Metrics (4 KPI Cards) */}
      <div className="grid grid-cols-4 gap-6">
        {/* Card 1: Production vs Target */}
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-[#2E5C8A]/30 transform hover:-translate-y-1">
          <div className="text-sm text-gray-600 mb-2">Production vs Target</div>
          <div className="text-4xl font-semibold text-gray-900 mb-2">2,847</div>
          <div className="text-sm text-gray-600 mb-3">units today</div>
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Target: 3,000</span>
              <span className="font-medium text-[#2E5C8A]">94.9%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#2E5C8A] rounded-full" style={{ width: '94.9%' }}></div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>5% vs yesterday</span>
          </div>
          <div className="mt-3 h-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={miniSparklineData.map((v, i) => ({ value: v }))}>
                <Line type="monotone" dataKey="value" stroke="#2E5C8A" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 2: OEE */}
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-[#2E5C8A]/30 transform hover:-translate-y-1">
          <div className="text-sm text-gray-600 mb-2">OEE (Overall Equipment Effectiveness)</div>
          <div className="text-4xl font-medium text-yellow-600 mb-2">78.3%</div>
          <div className="text-sm text-gray-900 font-medium mb-1">$127,450</div>
          <div className="text-xs text-gray-600 mb-3">value today</div>
          <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full mb-2">
            Target: 80%+
          </div>
          <div className="text-xs text-gray-600 mt-2">
            Breakdown: Availability × Performance × Quality
          </div>
        </div>

        {/* Card 3: Scrap Rate */}
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-[#2E5C8A]/30 transform hover:-translate-y-1 border-l-4 border-red-500">
          <div className="text-sm text-gray-600 mb-2">Scrap Rate</div>
          <div className="text-4xl font-medium text-red-600 mb-2">2.1%</div>
          <div className="text-sm text-red-600 font-medium mb-1">-$4,230</div>
          <div className="text-xs text-gray-600 mb-3">in scrap today</div>
          <div className="flex items-center gap-1 text-sm text-green-600 mb-2">
            <TrendingDown className="w-4 h-4" />
            <span>0.3% vs last week</span>
          </div>
          <div className="text-xs text-gray-600">
            Target: &lt;2.5%
          </div>
        </div>

        {/* Card 4: Uptime */}
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-[#2E5C8A]/30 transform hover:-translate-y-1">
          <div className="text-sm text-gray-600 mb-2">Uptime</div>
          <div className="text-4xl font-medium text-green-600 mb-2">94.2%</div>
          <div className="text-sm text-gray-900 font-medium mb-1">22.6 hrs productive</div>
          <div className="text-xs text-gray-600 mb-3">out of 24 hrs</div>
          <div className="inline-block px-3 py-1 bg-red-100 text-red-800 text-xs rounded-full mb-2">
            ⚠ 1.4 hrs unplanned downtime
          </div>
          <div className="text-xs text-gray-600 mt-2">
            Machines down: CNC-03, Press-12
          </div>
        </div>
      </div>

      {/* Middle Section - Visual Analytics */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column (2/3 width) - Charts */}
        <div className="col-span-2 space-y-6">
          {/* Behind/Ahead Analysis */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Behind/Ahead Analysis</h3>
                <p className="text-sm text-gray-600">Units ahead or behind schedule by product line</p>
              </div>
              <button className="text-sm text-[#2E5C8A] hover:underline">⚙️ Customize</button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scheduleData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8">
                  {scheduleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.status === 'ahead' ? COLORS.ahead : COLORS.behind} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <button
              onClick={onOpenChat}
              className="mt-4 text-sm text-[#2E5C8A] hover:underline"
            >
              💬 Ask AI: Why is Product Line B behind?
            </button>
          </div>

          {/* Production Trend */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Production Trend</h3>
                <p className="text-sm text-gray-600">Actual vs target over the last 7 days</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <button className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded">Hour</button>
                  <button className="px-3 py-1 bg-[#2E5C8A] text-white text-xs rounded">Day</button>
                  <button className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded">Week</button>
                </div>
                <button className="text-sm text-[#2E5C8A] hover:underline">⚙️ Customize</button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="actual" stroke="#2E5C8A" strokeWidth={2} name="Actual Production" />
                <Line type="monotone" dataKey="target" stroke="#94A3B8" strokeWidth={2} strokeDasharray="5 5" name="Target" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column (1/3 width) - Panels */}
        <div className="space-y-6">
          {/* Quality Metrics Panel */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality Metrics</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={qualityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {qualityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.quality[index % COLORS.quality.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">First-pass yield:</span>
                <span className="font-medium text-gray-900">91.2%</span>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <div className="text-xs font-medium text-gray-700 mb-2">Top Issues Today:</div>
                <ol className="text-xs text-gray-600 space-y-1">
                  <li>1. Dimensional issues (45 defects)</li>
                  <li>2. Surface defects (28 defects)</li>
                  <li>3. Material defects (18 defects)</li>
                </ol>
              </div>
              <button className="text-sm text-[#2E5C8A] hover:underline mt-3">
                View detailed quality report →
              </button>
            </div>
          </div>

          {/* Sales Performance Panel */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Performance</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Revenue Today</div>
                <div className="text-2xl font-medium text-gray-900">$342,890</div>
                <div className="text-sm text-gray-600">Target: $375,000 (91.4%)</div>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Orders shipped:</span>
                  <span className="font-medium text-green-600">47</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Orders pending:</span>
                  <span className="font-medium text-yellow-600">12</span>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="text-xs font-medium text-gray-700 mb-2">Top Customers Today:</div>
                <ol className="text-xs text-gray-600 space-y-1">
                  <li>1. Acme Corp ($84,200)</li>
                  <li>2. TechStart Inc ($56,700)</li>
                  <li>3. BuildRight LLC ($42,150)</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row - Embedded AI Chat */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Quick Insights</h3>
          <button
            onClick={onOpenChat}
            className="text-sm text-[#2E5C8A] hover:underline"
          >
            Open full chat →
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Ask about your production data... (e.g., 'Which machines had the most downtime?')"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E5C8A] focus:border-transparent"
            onClick={onOpenChat}
            readOnly
          />
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200">
            OEE by shift
          </button>
          <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200">
            Scrap by product
          </button>
          <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200">
            Downtime causes
          </button>
          <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200">
            Compare to last week
          </button>
        </div>
      </div>
    </div>
  );
}