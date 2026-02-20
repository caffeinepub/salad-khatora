import { CheckCircle, Clock, ChefHat, Package } from 'lucide-react';

interface OrderStatusTimelineProps {
  status: string;
}

export default function OrderStatusTimeline({ status }: OrderStatusTimelineProps) {
  const steps = [
    { key: 'pending', label: 'Order Placed', icon: Clock },
    { key: 'preparing', label: 'Preparing', icon: ChefHat },
    { key: 'ready', label: 'Ready', icon: Package },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle },
  ];

  const currentStepIndex = steps.findIndex((step) => step.key === status.toLowerCase());

  return (
    <div className="relative">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index <= currentStepIndex;
          const isActive = index === currentStepIndex;

          return (
            <div key={step.key} className="flex flex-col items-center flex-1 relative">
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-5 left-1/2 w-full h-0.5 ${
                    isCompleted ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                  style={{ zIndex: 0 }}
                />
              )}
              <div
                className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center ${
                  isCompleted
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-400'
                } ${isActive ? 'ring-4 ring-green-200' : ''}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <p
                className={`mt-2 text-xs text-center ${
                  isCompleted ? 'text-green-600 font-semibold' : 'text-gray-500'
                }`}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
