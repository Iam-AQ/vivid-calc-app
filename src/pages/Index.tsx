import { Calculator } from "@/components/Calculator";

const Index = () => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "var(--gradient-main)" }}
    >
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-white drop-shadow-lg">
            Colorful Calculator
          </h1>
          <p className="text-xl text-white/90 drop-shadow">
            A beautiful, vibrant calculator for all your math needs
          </p>
        </div>
        
        <Calculator />
      </div>
    </div>
  );
};

export default Index;
