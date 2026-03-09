const Features = () => {
  return (
    <section
      id="features"
      className="py-20 bg-white min-h-screen flex items-center scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-6 text-center">

        <h2 className="text-3xl md:text-4xl font-bold text-farmDark">
          Platform Features
        </h2>

        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Farmzy provides a transparent and efficient marketplace connecting
          farmers directly with companies for better agricultural trade.
        </p>

        <div className="grid md:grid-cols-4 gap-8 mt-14">

          <FeatureCard
            title="Direct Marketplace"
            desc="Farmers can list their crops directly and companies can place orders without intermediaries."
          />

          <FeatureCard
            title="Secure Transactions"
            desc="Payments are securely processed with transparent tracking and transaction records."
          />

          <FeatureCard
            title="Real-time Listings"
            desc="Companies can browse live marketplace listings and place orders instantly."
          />

          <FeatureCard
            title="Verified Companies"
            desc="All companies go through verification ensuring safe and trusted business."
          />

        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ title, desc }: { title: string; desc: string }) => (
  <div className="bg-farmBg p-6 rounded-xl shadow hover:shadow-lg transition hover:scale-105">
    <h3 className="text-xl font-semibold text-farmGreen">{title}</h3>
    <p className="mt-3 text-gray-600 text-sm">{desc}</p>
  </div>
);

export default Features;