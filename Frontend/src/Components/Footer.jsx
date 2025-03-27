import logo from "../assets/agrilogo.png";

const Footer = () => {
  return (
    <>
      <hr />
      <footer className="bg-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            {/* Logo and Social Icons */}
            <div className="mb-6 md:mb-0">
              <div className="flex items-center mb-4">
                <img src={logo} alt="Hostel" className="w-44 h-44 mr-2" />
                <h1 className="font-semibold text-lime-800 text-3xl font-cinzel">
                  AGRI{" "}
                  <span className="text-green-500 font-serif font-bold text-2xl">
                    CONNECT+
                  </span>{" "}
                </h1>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  <i className="fab fa-github"></i>
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  <i className="fab fa-dribbble"></i>
                </a>
              </div>
            </div>

            {/* Links Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Product</h4>
                <ul className="space-y-1">
                  <li>
                    <a href="#" className="text-gray-600 hover:text-gray-800">
                      Overview
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-gray-800">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-gray-800">
                      Solutions{" "}
                      <span className="ml-1 px-2 py-1 bg-gray-200 text-sm font-medium rounded-md">
                        New
                      </span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-gray-800">
                      Tutorials
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-gray-800">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-gray-800">
                      Releases
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Company</h4>
                <ul className="space-y-1">
                  <li>
                    <a href="#" className="text-gray-600 hover:text-gray-800">
                      About us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-gray-800">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-gray-800">
                      Press
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-gray-800">
                      News
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-gray-800">
                      Media kit
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-gray-800">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Resources</h4>
                <ul className="space-y-1">
                  <li>
                    <a href="#" className="text-gray-600 hover:text-gray-800">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-gray-800">
                      Newsletter
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-gray-800">
                      Events
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-gray-800">
                      Help centre
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-gray-800">
                      Tutorials
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-gray-800">
                      Support
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-8 border-t pt-6 text-center md:text-left">
            <p className="text-gray-600">
              Empowering Farmers with Agri Connect
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Bridging the gap between farmers and wholesalers to ensure fair
              prices and sustainable agriculture.
            </p>
            <p className="text-gray-400 text-sm mt-6">
              &copy; 2025 Agri Connect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
