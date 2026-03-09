const About = () => {
  return (
    <section
      id="about"
      className="py-20 bg-farmBg min-h-screen flex items-center scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

        <img
          src="https://images.unsplash.com/photo-1500595046743-cd271d694d30"
          alt="Farmers"
          className="rounded-xl shadow-lg"
        />

        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-farmDark">
            About Farmzy
          </h2>

          <p className="mt-6 text-gray-600 leading-relaxed">
            Farmzy is a digital agriculture marketplace designed to connect
            farmers directly with companies.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-6">

            <Stat title="100+" label="Farmers Connected" />
            <Stat title="50+" label="Companies Registered" />
            <Stat title="500+" label="Crop Listings" />
            <Stat title="24/7" label="Marketplace Access" />

          </div>

        </div>

      </div>
    </section>
  );
};

const Stat = ({ title, label }: { title: string; label: string }) => (
  <div>
    <h3 className="text-2xl font-bold text-farmGreen">{title}</h3>
    <p className="text-gray-600 text-sm">{label}</p>
  </div>
);

export default About;