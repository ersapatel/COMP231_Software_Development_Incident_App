import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useIncidents } from "../context/IncidentContext";
import "./ViewReport.css";

const ViewReport = () => {
  const { incidents, loadingIncidents } = useIncidents();

  if (loadingIncidents) return <p>Loading...</p>;

  const { categories, data } = processTrendData(incidents);

  const options = {
    chart: {
        height: 350
    },
    title: { text: "Incident Trend" },
    xAxis: { categories },
    yAxis: { title: { text: "Number of Incidents" } },
    series: [
        {
        name: "Incidents",
        data
        }
    ]
    };

    const severityData = processSeverityData(incidents);

    const pieOptions = {
        chart: {
            type: "pie",
            height: 350
        },
        title: {
            text: "Incidents by Severity"
        },
        series: [
            {
            name: "Incidents",
            data: severityData
            }
        ]
    };

  return (
    <div>
      <h2>Incident Report</h2>

      <div className="chart-box">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
      <div className="chart-box">
        <HighchartsReact highcharts={Highcharts} options={pieOptions} />
      </div>
    </div>
  );
};

export default ViewReport;

const processTrendData = (incidents) => {
  const grouped = {};

  incidents.forEach(item => {
    const date = new Date(item.dateOccured).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });

    grouped[date] = (grouped[date] || 0) + 1;
  });

  return {
    categories: Object.keys(grouped),
    data: Object.values(grouped)
  };
};

const processSeverityData = (incidents) => {
  const counts = {
    High: 0,
    Medium: 0,
    Low: 0
  };

  incidents.forEach(item => {
    if (counts[item.severity] !== undefined) {
      counts[item.severity]++;
    }
  });

  return [
    { name: "High", y: counts.High },
    { name: "Medium", y: counts.Medium },
    { name: "Low", y: counts.Low }
  ];
};