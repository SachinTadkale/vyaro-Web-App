const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-white scroll-mt-24">
      <div className="max-w-4xl mx-auto px-6 text-center">

        <h2 className="text-3xl md:text-4xl font-bold text-farmDark">
          Contact Us
        </h2>

        <form className="mt-12 space-y-6 text-left">

          <input
            type="text"
            placeholder="Name"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-farmGreen"
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-farmGreen"
          />

          <textarea
            rows={4}
            placeholder="Message"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-farmGreen"
          />

          <button
            type="submit"
            className="w-full bg-farmGreen text-white py-3 rounded-lg hover:bg-farmDark transition"
          >
            Send Message
          </button>

        </form>

      </div>
    </section>
  );
};

export default Contact;