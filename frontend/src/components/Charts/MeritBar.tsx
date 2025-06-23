import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import type { Merit } from '../../api/merits';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface MeritBarChartProps {
  merits: Merit[];
}

const MeritBarChart: React.FC<MeritBarChartProps> = ({ merits }) => {
  const researcherScores: Record<string, number> = {};

  merits.forEach(merit => {
    const name = merit.user?.fullName ?? 'Desconocido';
    researcherScores[name] = (researcherScores[name] || 0) + (merit.score ?? 0);
  });

  const data = {
    labels: Object.keys(researcherScores),
    datasets: [
      {
        label: 'Puntuación Total',
        data: Object.values(researcherScores),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Puntuación Total por Investigador',
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default MeritBarChart;
