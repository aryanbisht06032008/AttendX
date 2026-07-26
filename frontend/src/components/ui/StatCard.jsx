import { FaBuilding, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

function StatCard({
  title,
  value,
  color = "amber",
}) {
  const styles = {
    amber: {
      bg: "bg-amber-100",
      text: "text-amber-700",
      icon: <FaBuilding />,
    },
    green: {
      bg: "bg-green-100",
      text: "text-green-700",
      icon: <FaCheckCircle />,
    },
    red: {
      bg: "bg-red-100",
      text: "text-red-700",
      icon: <FaTimesCircle />,
    },
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-700",
    },
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

      <div className="flex justify-between items-start">

        <div>

          <p className="text-stone-500 text-sm font-medium">
            {title}
          </p>

          <h2 className="text-4xl font-bold text-stone-800 mt-3">
            {value}
          </h2>

        </div>

        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${styles[color].bg} ${styles[color].text}`}
        >
          {styles[color].icon}
        </div>

      </div>

    </div>
  );
}

export default StatCard;