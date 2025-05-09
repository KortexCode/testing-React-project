type CalculatorProps = {
  a: number;
  b: number;
  operation: "add" | "substract" | "multiply" | "divide" | string;
};

export const Calculator = ({ a, b, operation }: CalculatorProps) => {
  const calculate = () => {
    switch (operation) {
      case "add":
        return a + b;
      case "substract":
        return a - b;
      case "multiply":
        return a * b;
      case "divide":
        return b !== 0 ? a / b : "Error";
      default:
        return "Invalid operation";
    }
  };

  return <section>Result: {calculate()}</section>;
};
