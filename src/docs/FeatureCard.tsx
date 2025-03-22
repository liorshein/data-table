import { ReactNode } from "react";

const FeatureCard = ({ icon, title, description }: { icon: ReactNode, title: string, description: string }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
            {icon}
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

export default FeatureCard