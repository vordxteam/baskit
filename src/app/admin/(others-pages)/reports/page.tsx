"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { MoreDotIcon } from "@/icons";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import Badge from "@/components/ui/badge/Badge";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { downloadCSV } from "@/utils/csvExport";
import { revenueRows, revenueSummary, ReportPeriod } from "./data";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const periods: ReportPeriod[] = ["Monthly", "Quarterly", "Annually"];

function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{hint}</p>
    </div>
  );
}

export default function ReportsPage() {
  const [period, setPeriod] = useState<ReportPeriod>("Monthly");
  const [isOpen, setIsOpen] = useState(false);

  const chartSeries = useMemo(() => {
    if (period === "Quarterly") {
      return [{ name: "Revenue", data: [72000, 84500, 102400, 120800] }];
    }

    if (period === "Annually") {
      return [{ name: "Revenue", data: [revenueSummary.totalRevenue] }];
    }

    return [{ name: "Revenue", data: revenueRows.map((row) => row.revenue) }];
  }, [period]);

  const chartCategories = useMemo(() => {
    if (period === "Quarterly") return ["Q1", "Q2", "Q3", "Q4"];
    if (period === "Annually") return ["2026"];
    return revenueRows.map((row) => row.month);
  }, [period]);

  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      type: "bar",
      height: 320,
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: "44%",
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: chartCategories,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (value) => `$${Math.round(value / 1000)}k`,
      },
    },
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 4,
    },
    tooltip: {
      y: {
        formatter: (value: number) => `$${value.toLocaleString()}`,
      },
    },
  };

  const exportRows = revenueRows.map((row) => ({
    Month: row.month,
    Income: row.income,
    Revenue: row.revenue,
    Orders: row.orders,
    Refunds: row.refunds,
  }));

  const handleExport = () => {
    downloadCSV(exportRows, `revenue-report-${period.toLowerCase()}.csv`);
    setIsOpen(false);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Revenue Report</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Monitor income, revenue, and monthly growth with a downloadable CSV export.</p>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Income" value={`$${revenueSummary.totalIncome.toLocaleString()}`} hint="Net income across the selected period" />
        <StatCard label="Revenue" value={`$${revenueSummary.totalRevenue.toLocaleString()}`} hint="Gross revenue collected" />
        <StatCard label="Growth" value={`+${revenueSummary.growth}%`} hint="Compared with the previous period" />
        <StatCard label="Avg Order Value" value={`$${revenueSummary.averageOrderValue.toFixed(2)}`} hint="Average order size" />
        <StatCard label="Refunds" value={`${revenueSummary.refunds}`} hint="Orders refunded in the period" />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03] sm:p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Income and Revenue Trend</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Use the period selector and export the visible data as CSV.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-900">
              {periods.map((item) => (
                <button
                  key={item}
                  onClick={() => setPeriod(item)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${period === item ? "bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="relative">
              <button onClick={() => setIsOpen((open) => !open)} className="dropdown-toggle flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-gray-700 dark:border-white/10 dark:bg-white/[0.03] dark:hover:text-gray-200">
                <MoreDotIcon />
              </button>
              <Dropdown isOpen={isOpen} onClose={() => setIsOpen(false)} className="w-44 p-2">
                <DropdownItem onItemClick={handleExport} className="flex w-full rounded-lg px-3 py-2 text-left font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                  Export CSV
                </DropdownItem>
                <DropdownItem onItemClick={() => setIsOpen(false)} className="flex w-full rounded-lg px-3 py-2 text-left font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                  Refresh
                </DropdownItem>
              </Dropdown>
            </div>
          </div>
        </div>

        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[780px] xl:min-w-full">
            <ReactApexChart options={options} series={chartSeries} type="bar" height={320} />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] overflow-hidden">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-white/[0.05] sm:px-6">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">Monthly Breakdown</h3>
        </div>

        <div className="hidden md:block max-w-full overflow-x-auto">
          <div className="min-w-[900px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  {[
                    "Month",
                    "Income",
                    "Revenue",
                    "Orders",
                    "Refunds",
                  ].map((header) => (
                    <TableCell key={header} isHeader className="px-5 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {revenueRows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white/90">{row.month}</TableCell>
                    <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">${row.income.toLocaleString()}</TableCell>
                    <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">${row.revenue.toLocaleString()}</TableCell>
                    <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{row.orders}</TableCell>
                    <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                      <Badge size="sm" color={row.refunds > 10 ? "warning" : "success"}>{row.refunds}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="grid gap-4 p-4 md:hidden">
          {revenueRows.map((row) => (
            <div key={row.id} className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white/90">{row.month}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{row.orders} orders</p>
                </div>
                <Badge size="sm" color={row.refunds > 10 ? "warning" : "success"}>{row.refunds} refunds</Badge>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Income</p>
                  <p className="font-medium text-gray-800 dark:text-white/90">${row.income.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Revenue</p>
                  <p className="font-medium text-gray-800 dark:text-white/90">${row.revenue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}