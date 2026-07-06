interface Step { id: string; label: string; description?: string; }
interface StepperProps {
  steps: Step[];
  currentStep: number;
  orientation?: 'horizontal' | 'vertical';
}

export function Stepper({ steps, currentStep, orientation = 'horizontal' }: StepperProps) {
  if (orientation === 'vertical') return (
    <div className="flex flex-col">
      {steps.map((step, i) => {
        const done = i < currentStep, active = i === currentStep;
        return (
          <div key={step.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0
                ${done ? 'bg-primary text-text-inverse' : active ? 'bg-info-light text-info-text border-2 border-primary' : 'bg-bg-tertiary text-text-disabled'}`}>
                {done ? '✓' : i + 1}
              </div>
              {i < steps.length - 1 && <div className={`w-0.5 h-8 mt-1 ${done ? 'bg-primary' : 'bg-bg-hover'}`} />}
            </div>
            <div className="pb-8 pt-1">
              <p className={`text-sm font-medium ${active ? 'text-info-text' : done ? 'text-text-primary' : 'text-text-disabled'}`}>{step.label}</p>
              {step.description && <p className="text-xs text-text-secondary mt-0.5">{step.description}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
  return (
    <div className="flex items-center">
      {steps.map((step, i) => {
        const done = i < currentStep, active = i === currentStep;
        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${done ? 'bg-primary text-text-inverse' : active ? 'bg-info-light text-info-text border-2 border-primary' : 'bg-bg-tertiary text-text-disabled'}`}>
                {done ? '✓' : i + 1}
              </div>
              <span className={`text-xs font-medium whitespace-nowrap ${active ? 'text-info-text' : done ? 'text-text-primary' : 'text-text-disabled'}`}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 mb-5 ${done ? 'bg-primary' : 'bg-bg-hover'}`} />}
          </div>
        );
      })}
    </div>
  );
}
