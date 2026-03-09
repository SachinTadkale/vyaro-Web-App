const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="py-20 bg-white min-h-screen flex items-center scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-6 text-center">

        <h2 className="text-3xl md:text-4xl font-bold text-farmDark">
          How Farmzy Works
        </h2>

        <div className="grid md:grid-cols-3 gap-10 mt-16">

          <Step
            number="1"
            title="Farmers List Crops"
            desc="Farmers add crop listings with quantity and pricing."
          />

          <Step
            number="2"
            title="Companies Place Orders"
            desc="Verified companies browse listings and place orders."
          />

          <Step
            number="3"
            title="Secure Payment & Delivery"
            desc="Payments are securely processed and tracked."
          />

        </div>

      </div>
    </section>
  );
};

const Step = ({
  number,
  title,
  desc,
}: {
  number: string;
  title: string;
  desc: string;
}) => (
  <div className="p-6 bg-farmBg rounded-xl shadow hover:shadow-lg transition hover:scale-105">
    <div className="text-3xl font-bold text-farmGreen">{number}</div>
    <h3 className="mt-4 text-xl font-semibold text-farmDark">{title}</h3>
    <p className="mt-3 text-gray-600 text-sm">{desc}</p>
  </div>
);

export default HowItWorks;