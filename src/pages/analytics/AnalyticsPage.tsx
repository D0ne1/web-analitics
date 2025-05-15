import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, DollarSign, Users } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { supabase } from '../../lib/supabase';
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
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { ru } from 'date-fns/locale';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'week' | 'month'>('week');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    averageCheck: 0,
    totalOrders: 0,
    topDishes: [],
    dailyRevenue: [],
    topWaiters: []
  });

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const daysToFetch = timeframe === 'week' ? 7 : 30;
      const startDate = startOfDay(subDays(new Date(), daysToFetch - 1));

      // Fetch orders for the period
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(
            quantity,
            price,
            dish:dishes(name)
          )
        `)
        .gte('created_at', startDate.toISOString())
        .eq('status', 'completed');

      if (ordersError) throw ordersError;

      // Calculate analytics
      const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
      const totalOrders = orders?.length || 0;
      const averageCheck = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;

      // Calculate daily revenue
      const dailyRevenue = Array.from({ length: daysToFetch }).map((_, index) => {
        const date = subDays(new Date(), daysToFetch - 1 - index);
        const dayOrders = orders?.filter(order => 
          new Date(order.created_at).toDateString() === date.toDateString()
        ) || [];
        return {
          date: format(date, 'dd MMM', { locale: ru }),
          revenue: dayOrders.reduce((sum, order) => sum + order.total_amount, 0)
        };
      });

      setAnalytics({
        totalRevenue,
        averageCheck,
        totalOrders,
        topDishes: [],
        dailyRevenue,
        topWaiters: []
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const revenueChartData = {
    labels: analytics.dailyRevenue.map(day => day.date),
    datasets: [
      {
        label: 'Выручка',
        data: analytics.dailyRevenue.map(day => day.revenue),
        borderColor: '#2563EB',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Аналитика</h1>
          <p className="text-sm text-gray-500">Анализ работы ресторана</p>
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
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-primary-50 border-primary-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-primary-100 text-primary-600 mr-4">
                  <DollarSign size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary-600">Общая выручка</p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {analytics.totalRevenue.toLocaleString('ru-RU')} ₽
                  </h3>
                </div>
              </div>
            </Card>

            <Card className="bg-secondary-50 border-secondary-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-secondary-100 text-secondary-600 mr-4">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-secondary-600">Средний чек</p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {analytics.averageCheck.toLocaleString('ru-RU')} ₽
                  </h3>
                </div>
              </div>
            </Card>

            <Card className="bg-accent-50 border-accent-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-accent-100 text-accent-600 mr-4">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-accent-600">Количество заказов</p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {analytics.totalOrders}
                  </h3>
                </div>
              </div>
            </Card>
          </div>

          <Card 
            title="Динамика выручки" 
            subtitle={`Данные за ${timeframe === 'week' ? 'неделю' : 'месяц'}`}
            icon={<Calendar size={20} />}
          >
            <div className="h-80">
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
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;