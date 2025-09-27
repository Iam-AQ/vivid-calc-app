import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CalculatorButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "number" | "operator" | "equals" | "clear";
  className?: string;
  disabled?: boolean;
}

const CalculatorButton = ({ 
  children, 
  onClick, 
  variant = "number", 
  className,
  disabled = false 
}: CalculatorButtonProps) => {
  const baseClasses = "h-16 text-xl font-semibold rounded-2xl transition-all duration-200 transform active:scale-95 shadow-lg";
  
  const variantClasses = {
    number: "bg-btn-number hover:bg-btn-number-hover text-btn-number-text",
    operator: "bg-btn-operator hover:bg-btn-operator-hover text-btn-operator-text", 
    equals: "bg-btn-equals hover:bg-btn-equals-hover text-btn-equals-text",
    clear: "bg-btn-clear hover:bg-btn-clear-hover text-btn-clear-text"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseClasses,
        variantClasses[variant],
        "hover:shadow-xl hover:-translate-y-1",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
};

export const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? String(num) : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation?: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation || null);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case "+":
        return firstValue + secondValue;
      case "-":
        return firstValue - secondValue;
      case "×":
        return firstValue * secondValue;
      case "÷":
        return secondValue !== 0 ? firstValue / secondValue : firstValue;
      default:
        return secondValue;
    }
  };

  const handleOperation = (op: string) => {
    performOperation(op);
  };

  const handleEquals = () => {
    performOperation();
  };

  // Format display number
  const formatDisplay = (value: string) => {
    const number = parseFloat(value);
    if (isNaN(number)) return value;
    
    // Handle very large or very small numbers
    if (Math.abs(number) > 999999999 || (Math.abs(number) < 0.000001 && number !== 0)) {
      return number.toExponential(6);
    }
    
    // Handle normal numbers
    return parseFloat(number.toPrecision(12)).toString();
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Calculator Container */}
      <div 
        className="bg-calc-bg p-6 rounded-3xl shadow-2xl"
        style={{
          background: "var(--gradient-main)",
          boxShadow: "var(--shadow-glow)"
        }}
      >
        {/* Display */}
        <div 
          className="bg-calc-display text-calc-display-text p-6 rounded-2xl mb-6 text-right overflow-hidden shadow-inner"
          style={{
            background: "var(--gradient-display)"
          }}
        >
          <div className="text-4xl font-light leading-none min-h-[3rem] flex items-end justify-end">
            {formatDisplay(display)}
          </div>
        </div>

        {/* Button Grid */}
        <div className="grid grid-cols-4 gap-3">
          {/* First Row */}
          <CalculatorButton variant="clear" onClick={clear} className="col-span-2">
            Clear
          </CalculatorButton>
          <CalculatorButton variant="operator" onClick={() => handleOperation("÷")}>
            ÷
          </CalculatorButton>
          <CalculatorButton variant="operator" onClick={() => handleOperation("×")}>
            ×
          </CalculatorButton>

          {/* Second Row */}
          <CalculatorButton onClick={() => inputNumber("7")}>7</CalculatorButton>
          <CalculatorButton onClick={() => inputNumber("8")}>8</CalculatorButton>
          <CalculatorButton onClick={() => inputNumber("9")}>9</CalculatorButton>
          <CalculatorButton variant="operator" onClick={() => handleOperation("-")}>
            −
          </CalculatorButton>

          {/* Third Row */}
          <CalculatorButton onClick={() => inputNumber("4")}>4</CalculatorButton>
          <CalculatorButton onClick={() => inputNumber("5")}>5</CalculatorButton>
          <CalculatorButton onClick={() => inputNumber("6")}>6</CalculatorButton>
          <CalculatorButton variant="operator" onClick={() => handleOperation("+")}>
            +
          </CalculatorButton>

          {/* Fourth Row */}
          <CalculatorButton onClick={() => inputNumber("1")}>1</CalculatorButton>
          <CalculatorButton onClick={() => inputNumber("2")}>2</CalculatorButton>
          <CalculatorButton onClick={() => inputNumber("3")}>3</CalculatorButton>
          <CalculatorButton variant="equals" onClick={handleEquals} className="row-span-2">
            =
          </CalculatorButton>

          {/* Fifth Row */}
          <CalculatorButton onClick={() => inputNumber("0")} className="col-span-2">
            0
          </CalculatorButton>
          <CalculatorButton onClick={inputDecimal}>.</CalculatorButton>
        </div>
      </div>
    </div>
  );
};