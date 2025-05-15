import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  BarChart2, 
  Calendar, 
  ChevronsUp, 
  ChevronsDown 
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { format, subDays } from 'date-fns';
import { ru } from 'date-fns/locale';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Mock data generator
const generateMockData = () => {
  // Generate last 7 days
  const labels = Array.from({ length: 7 }).map((_, i) => {
    return format(subDays(new Date(), 6 - i), 'dd MMM', { locale: ru });
  });

  // Revenue data
  const revenueData = labels.map(() => Math.floor(Math.random() * 50000) + 10000);
  const totalRevenue = revenueData.reduce((a, b) => a + b, 0);
  const averageOrderValue = Math.floor(Math.random() * 3000) + 500;
  const orderCount = Math.floor(totalRevenue / averageOrderValue);

  // Top dishes
  const topDishes = [
    { name: 'Стейк Рибай', count: 42, revenue: 33600 },
    { name: 'Паста Карбонара', count: 38, revenue: 17100 },
    { name: 'Тирамису', count: 35, revenue: 10500 },
    { name: 'Цезарь с курицей', count: 33, revenue: 13200 },
    { name: 'Борщ', count: 30, revenue: 9000 },
  ];

  // Top waiters
  const waiterPerformance = [
    { name: 'Анна', orderCount: 56, revenue: 112000 },
    { name: 'Иван', orderCount: 48, revenue: 96000 },
    { name: 'Мария', orderCount: 42, revenue: 84000 },
    { name: 'Алексей', orderCount: 38, revenue: 76000 },
  ];

  return {
    labels,
    revenueData,
    totalRevenue,
    averageOrderValue,
    orderCount,
    topDishes,
    waiterPerformance,
  };
};

const DashboardPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'week' | 'month'>('week');
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    labels,
    revenueData,
    totalRevenue,
    averageOrderValue,
    orderCount,
    topDishes,
    waiterPerformance,
  } = generateMockData();

  // Refresh data with loading indicator
  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  // Revenue chart data
  const revenueChartData = {
    labels,
    datasets: [
      {
        label: 'Выручка',
        data: revenueData,
        borderColor: '#2563EB',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Top dishes chart data
  const topDishesChartData = {
    labels: topDishes.map(dish => dish.name),
    datasets: [
      {
        label: 'Выручка',
        data: topDishes.map(dish => dish.revenue),
        backgroundColor: [
          'rgba(37, 99, 235, 0.7)',
          'rgba(6, 182, 212, 0.7)',
          'rgba(249, 115, 22, 0.7)',
          'rgba(34, 197, 94, 0.7)',
          'rgba(239, 68, 68, 0.7)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Дашборд</h1>
          <p className="text-sm text-gray-500">
            Аналитика работы ресторана
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={timeframe === 'week' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setTimeframe('week')}
          >
            Неделя
          </Button>
          <Button
            variant={timeframe === 'month' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setTimeframe('month')}
          >
            Месяц
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            leftIcon={<Calendar size={16} />}
            isLoading={isLoading}
            onClick={refreshData}
          >
            Обновить
          </Button>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary-50 border-primary-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 text-primary-600 mr-4">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-primary-600">Общая выручка</p>
              <h3 className="text-2xl font-bold text-gray-900">{totalRevenue.toLocaleString('ru-RU')} ₽</h3>
              <p className="text-xs text-primary-700 mt-1 flex items-center">
                <ChevronsUp size={16} />
                <span>+12.5% с прошлой недели</span>
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-secondary-50 border-secondary-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-secondary-100 text-secondary-600 mr-4">
              <ShoppingBag size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-secondary-600">Средний чек</p>
              <h3 className="text-2xl font-bold text-gray-900">{averageOrderValue.toLocaleString('ru-RU')} ₽</h3>
              <p className="text-xs text-secondary-700 mt-1 flex items-center">
                <ChevronsUp size={16} />
                <span>+3.2% с прошлой недели</span>
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-accent-50 border-accent-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-accent-100 text-accent-600 mr-4">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-accent-600">Количество заказов</p>
              <h3 className="text-2xl font-bold text-gray-900">{orderCount}</h3>
              <p className="text-xs text-error-700 mt-1 flex items-center">
                <ChevronsDown size={16} />
                <span>-2.1% с прошлой недели</span>
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card 
          title="Динамика выручки" 
          subtitle="Ежедневный доход ресторана"
          icon={<BarChart2 size={20} />}
          className="lg:col-span-2"
        >
          <div className="h-72">
            <Line 
              data={revenueChartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        return `${context.parsed.y.toLocaleString('ru-RU')} ₽`;
                      },
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return value.toLocaleString('ru-RU') + ' ₽';
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </Card>
        
        <Card title="Популярные блюда" subtitle="Топ-5 по выручке">
          <div className="h-80">
            <Bar 
              data={topDishesChartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y' as const,
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        return `${context.parsed.x.toLocaleString('ru-RU')} ₽`;
                      },
                    },
                  },
                },
                scales: {
                  x: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return value.toLocaleString('ru-RU') + ' ₽';
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </Card>
        
        <Card title="Эффективность официантов" subtitle="По сумме заказов">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Имя
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Заказы
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Выручка
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {waiterPerformance.map((waiter, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {waiter.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {waiter.orderCount}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {waiter.revenue.toLocaleString('ru-RU')} ₽
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;