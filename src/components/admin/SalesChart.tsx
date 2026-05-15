'use client';

import { useState, useMemo } from 'react';
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Line,
  ComposedChart,
} from 'recharts';

/** Tipe order record dari database */
interface OrderRecord {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  totalAmount: number;
  shippingCost: number;
  discount: number;
  status: string;
  paymentMethod: string | null;
  createdAt: string | null;
}

interface SalesChartProps {
  orders: OrderRecord[];
}

/** Tipe data untuk tooltip Recharts */
interface TooltipPayloadEntry {
  color: string;
  name: string;
  value: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}

/** Format ke Rupiah */
const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/** Custom Tooltip untuk chart */
const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-card border border-border rounded-lg p-3 shadow-xl">
        <p className="text-text-primary text-sm font-medium mb-2">{label}</p>
        {payload.map((entry: TooltipPayloadEntry, index: number) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {formatPrice(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function SalesChart({ orders }: SalesChartProps) {
  const [dateRange, setDateRange] = useState<7 | 14 | 30 | 0>(7);
  const [chartType, setChartType] = useState<'daily' | 'cumulative'>('daily');

  /** Kelompokkan orders per tanggal dan hitung total revenue harian */
  const chartData = useMemo(() => {
    if (!orders.length) return [];

    // Filter by date range (if not 'all')
    const now = new Date();
    const filteredOrders = dateRange === 0
      ? orders
      : orders.filter((o) => {
          if (!o.createdAt) return false;
          const orderDate = new Date(o.createdAt);
          const diffDays = Math.floor(
            (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          return diffDays <= dateRange;
        });

    // Group by date
    const dateMap = new Map<string, number>();
    filteredOrders.forEach((o) => {
      if (!o.createdAt) return;
      const dateKey = new Date(o.createdAt).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
      });
      dateMap.set(dateKey, (dateMap.get(dateKey) || 0) + o.totalAmount);
    });

    // Convert to array and sort by date
    const sortedData = Array.from(dateMap.entries())
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => {
        const [dayA, monthA] = a.date.split(' ');
        const [dayB, monthB] = b.date.split(' ');
        const months = [
          'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
          'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
        ];
        const monthIdxA = months.indexOf(monthA);
        const monthIdxB = months.indexOf(monthB);
        if (monthIdxA !== monthIdxB) return monthIdxA - monthIdxB;
        return parseInt(dayA) - parseInt(dayB);
      });

    // If cumulative, calculate running total
    if (chartType === 'cumulative') {
      let runningTotal = 0;
      return sortedData.map((d) => {
        runningTotal += d.revenue;
        return { ...d, revenue: runningTotal };
      });
    }

    return sortedData;
  }, [orders, dateRange, chartType]);

  /** Hitung total pendapatan untuk periode yang dipilih */
  const totalRevenue = useMemo(() => {
    return chartData.reduce((sum, d) => sum + d.revenue, 0);
  }, [chartData]);

  /** Hitung rata-rata harian */
  const avgDailyRevenue = useMemo(() => {
    return chartData.length > 0 ? totalRevenue / chartData.length : 0;
  }, [chartData, totalRevenue]);

  /** Periode label */
  const periodLabel = dateRange === 0 ? 'Semua Waktu' : `${dateRange} Hari Terakhir`;

  if (!orders.length) {
    return (
      <div className="bg-surface-alt rounded-xl border border-border p-6 shadow-sm shadow-black/20">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          📊 Grafik Penjualan
        </h3>
        <div className="text-center py-12">
          <div className="text-5xl mb-4 opacity-30">📈</div>
          <p className="text-text-secondary">Belum ada data penjualan</p>
          <p className="text-text-tertiary text-sm mt-1">
            Grafik akan muncul setelah ada pesanan
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-alt rounded-xl border border-border p-6 shadow-sm shadow-black/20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            📊 Grafik Penjualan
          </h3>
          <p className="text-sm text-text-secondary mt-1">
            Periode: <span className="text-gold font-medium">{periodLabel}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Chart Type Toggle */}
          <div className="flex bg-surface rounded-lg p-0.5 border border-border">
            <button
              onClick={() => setChartType('daily')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                chartType === 'daily'
                  ? 'bg-gold text-black'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Harian
            </button>
            <button
              onClick={() => setChartType('cumulative')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                chartType === 'cumulative'
                  ? 'bg-gold text-black'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Kumulatif
            </button>
          </div>

          {/* Date Range Filter */}
          <div className="flex bg-surface rounded-lg p-0.5 border border-border">
            {([7, 14, 30, 0] as const).map((days) => (
              <button
                key={days}
                onClick={() => setDateRange(days)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  dateRange === days
                    ? 'bg-gold text-black'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {days === 0 ? 'Semua' : `${days}H`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-surface rounded-lg p-3 border border-border">
          <p className="text-xs text-text-secondary uppercase tracking-wider">Total Pendapatan</p>
          <p className="text-xl font-bold text-green-400 mt-1">{formatPrice(totalRevenue)}</p>
        </div>
        <div className="bg-surface rounded-lg p-3 border border-border">
          <p className="text-xs text-text-secondary uppercase tracking-wider">Rata-rata Harian</p>
          <p className="text-xl font-bold text-gold mt-1">{formatPrice(avgDailyRevenue)}</p>
        </div>
        <div className="bg-surface rounded-lg p-3 border border-border">
          <p className="text-xs text-text-secondary uppercase tracking-wider">Transaksi</p>
          <p className="text-xl font-bold text-blue-400 mt-1">
            {orders.filter((o) => {
              if (dateRange === 0) return true;
              if (!o.createdAt) return false;
              const diffDays = Math.floor(
                (new Date().getTime() - new Date(o.createdAt).getTime()) / (1000 * 60 * 60 * 24)
              );
              return diffDays <= dateRange;
            }).length}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-surface rounded-lg p-4 border border-border">
        {chartData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-secondary">Tidak ada data untuk periode ini</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={chartData} barCategoryGap="20%">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
                interval={Math.max(0, Math.floor(chartData.length / 10) - 1)}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
                tickFormatter={(value) => {
                  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}jt`;
                  if (value >= 1000) return `${(value / 1000).toFixed(0)}rb`;
                  return value.toString();
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12, color: 'var(--color-text-secondary)' }}
                iconType="circle"
              />
              <Bar
                dataKey="revenue"
                name="Pendapatan"
                fill="#D4AF37"
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
                opacity={0.85}
              />
              {chartType === 'cumulative' && (
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Tren Kumulatif"
                  stroke="#22C55E"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#22C55E' }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Keterangan */}
      <p className="text-xs text-text-tertiary mt-3 text-center">
        {chartType === 'daily'
          ? 'Grafik menampilkan total pendapatan per hari'
          : 'Grafik menampilkan akumulasi pendapatan dari hari ke hari'}
        {' · '}Data diperbarui secara otomatis dari database
      </p>
    </div>
  );
}
