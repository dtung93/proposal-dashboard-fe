import React from 'react';

interface StatCardProps {
    title: string;
    value: string;
    // FIX: Changed icon type from React.ReactNode to React.ReactElement for type safety with React.cloneElement.
    // FIX: Further specified the element's props type to fix cloneElement type inference.
    icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
    color: 'indigo' | 'yellow' | 'green' | 'red' | 'blue' | 'purple' | 'teal';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
    const colorClasses = {
        indigo: 'bg-indigo-500',
        yellow: 'bg-yellow-500',
        green: 'bg-green-500',
        red: 'bg-red-500',
        blue: 'bg-blue-500',
        purple: 'bg-purple-500',
        teal: 'bg-teal-500',
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 flex items-center gap-6">
            <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg text-white ${colorClasses[color]}`}>
                {/* FIX: Removed unnecessary type assertion as the prop type is now correct. */}
                {React.cloneElement(icon, { className: 'w-6 h-6' })}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;