const steps = ["ตะกร้า", "ข้อมูล & ชำระเงิน", "แจ้งชำระเงิน", "รอยืนยัน"];

export default function StepIndicator({ current }: { current: number }) {
  return (
    <ol className="flex items-center justify-center gap-2 sm:gap-4 py-6">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const done = stepNumber < current;
        const active = stepNumber === current;
        return (
          <li key={step} className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                  done
                    ? "bg-sage text-white"
                    : active
                      ? "bg-sage text-white"
                      : "bg-black/5 text-muted"
                }`}
              >
                {done ? "✓" : stepNumber}
              </span>
              <span
                className={`hidden sm:inline text-sm ${
                  active ? "text-ink font-medium" : "text-muted"
                }`}
              >
                {step}
              </span>
            </div>
            {stepNumber < steps.length && (
              <span className="h-px w-6 sm:w-10 bg-black/10" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
