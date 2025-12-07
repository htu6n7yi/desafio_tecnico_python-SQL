interface CardDashboardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  bg?: string;
  border?: string;
  textColor?: string;
  icon?: React.ReactNode;
}

export default function CardDashboard({
  title,
  value,
  subtitle,
  bg = "bg-white",
  border = "border-gray-200",
  textColor = "text-gray-900",
  icon
}: CardDashboardProps) {
  return (
    <div className={`${bg} rounded-lg border-2 ${border} p-6 hover:shadow-lg transition-shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
        </div>

        {icon && (
          <div className="p-3 rounded-lg bg-gray-100">
            {icon}
          </div>
        )}
      </div>

      {subtitle && (
        <div className="mt-4 flex items-center text-sm text-gray-500">
          {subtitle}
        </div>
      )}
    </div>
  );
}
