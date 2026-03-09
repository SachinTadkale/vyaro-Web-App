import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section
      id="home"
      className="bg-farmBg py-20 min-h-screen flex items-center scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-farmDark leading-tight">
            Connecting Farmers <br /> and Companies
          </h1>

          <p className="mt-6 text-gray-600 text-lg">
            Farmzy is a smart agriculture marketplace where farmers can sell
            crops directly to companies with transparency and better pricing.
          </p>

          <div className="mt-8 flex gap-4">
            <button className="bg-farmGreen text-white px-6 py-3 rounded-lg hover:bg-farmDark hover:scale-105 transition">
              Explore Platform
            </button>

            <a
              href="#download"
              className="border border-farmGreen text-farmGreen px-6 py-3 rounded-lg hover:bg-farmGreen hover:text-white hover:scale-105 transition"
            >
              Download App
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854"
            alt="Farm"
            className="rounded-xl shadow-lg"
          />
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;