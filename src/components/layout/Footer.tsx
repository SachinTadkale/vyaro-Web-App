const Footer = () => {
  return (
    <footer className="bg-farmDark text-white py-12">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">

        {/* Logo */}
        <div>
          <h2 className="text-2xl font-bold text-farmLeaf">FarmzyZY</h2>
          <p className="mt-4 text-sm text-gray-300">
            Farmzy connects farmers and companies through a transparent
            agriculture marketplace.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>

          <ul className="space-y-2 text-gray-300">
            <li><a href="#about" className="hover:text-farmLeaf">About</a></li>
            <li><a href="#features" className="hover:text-farmLeaf">Features</a></li>
            <li><a href="#contact" className="hover:text-farmLeaf">Contact</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact</h3>

          <p className="text-gray-300 text-sm">
            Email: support@farmzy.com
          </p>

          <p className="text-gray-300 text-sm mt-2">
            Phone: +91 7249408615
          </p>
        </div>

      </div>

      {/* Bottom */}
      <div className="mt-10 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} Farmzy. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;