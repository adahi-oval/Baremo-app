import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import type { Merit } from '../../api/merits';

ChartJS.register(ArcElement, Tooltip, Legend);

interface MeritStatusPieChartProps {
  merits: Merit[];
  onSegmentClick: (status: 'Completo' | 'Incompleto') => void;
}

const MeritStatusPieChart = ({ merits, onSegmentClick }: MeritStatusPieChartProps) => {
  const completeCount = merits.filter(m => m.complete).length;
  const incompleteCount = merits.filter(m => !m.complete).length;

  const data = {
    labels: ['Completo', 'Incompleto'],
    datasets: [
      {
        data: [completeCount, incompleteCount],
        backgroundColor: ['#198754', '#dc3545'],
        borderColor: ['#fff', '#fff'],
        borderWidth: 2,
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
    onClick: (_: any, elements: any[]) => {
      if (!elements.length) return;
      const index = elements[0].index;
      if (index === 0) {
        onSegmentClick('Completo');
      } else if (index === 1) {
        onSegmentClick('Incompleto');
      }
    },
  };

  return (
    <div>
      <Pie data={data} options={options} />
    </div>
  );
};

export default MeritStatusPieChart;
