import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useRef } from 'react';
import type { IUser } from '../../api/user';

ChartJS.register(ArcElement, Tooltip, Legend);

interface UserScorePieChartProps {
  users: IUser[];
  onSegmentClick?: (status: 'Cumple' | 'Cumple Media' | 'Incumple') => void;
}

const UserScorePieChart: React.FC<UserScorePieChartProps> = ({ users, onSegmentClick }) => {
  const chartRef = useRef<any>(null);

  let cumple = 0;
  let cumpleMedia = 0;
  let incumple = 0;

  users.forEach(user => {
    const score = (user as any).totalScore ?? 0;
    const average = (user as any).averageScore ?? 0;

    if (score >= 8) {
      cumple++;
    } else if (average >= 8) {
      cumpleMedia++;
    } else {
      incumple++;
    }
  });

  const data = {
    labels: ['Cumple', 'Cumple Media', 'Incumple'],
    datasets: [
      {
        data: [cumple, cumpleMedia, incumple],
        backgroundColor: ['#4CAF50', '#008cff', '#F44336'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    onClick: (event: any) => {
      const chart = chartRef.current;
      if (!chart) return;

      const points = chart.getElementsAtEventForMode(event.native, 'nearest', { intersect: true }, true);
      if (points.length > 0) {
        const index = points[0].index;
        const label = data.labels[index];
        if (onSegmentClick) {
          onSegmentClick(label as 'Cumple' | 'Cumple Media' | 'Incumple');
        }
      }
    },
  };

  return <Pie ref={chartRef} data={data} options={options} />;
};

export default UserScorePieChart;
