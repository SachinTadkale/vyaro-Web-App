const DownloadApp = () => {
  return (
    <section
      id="download"
      className="py-20 bg-farmBg min-h-screen flex items-center scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-farmDark">
            Download the Farmzy App
          </h2>

          <p className="mt-6 text-gray-600">
            Access the Farmzy marketplace anytime from your mobile device.
          </p>

          <div className="mt-8 flex gap-4">

            <a
              href="/farmzy-app.apk"
              className="bg-farmGreen text-white px-6 py-3 rounded-lg hover:bg-farmDark transition"
            >
              Download APK
            </a>

            <a
              href="https://play.google.com"
              target="_blank"
              className="border border-farmGreen text-farmGreen px-6 py-3 rounded-lg hover:bg-farmGreen hover:text-white transition"
            >
              Get it on Play Store
            </a>

          </div>
        </div>

        <img
          src="https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb"
          alt="Mobile App"
          className="rounded-xl shadow-lg"
        />

      </div>
    </section>
  );
};

export default DownloadApp;