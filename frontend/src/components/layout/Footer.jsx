import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Footer = () => {
  const { isAuthenticated } = useAuth();

  return (
    <footer className="bg-gray-900 text-white text-body2 mt-auto">
      <div className="max-w-7xl mx-auto p-homepage-margin-x">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className=" font-semibold mb-layout-sm">Scentra</h3>
            <p className="text-gray-200">
              Your destination for the finest perfumes and fragrances.
            </p>
          </div>
          <div>
            <h3 className=" font-semibold mb-layout-sm">Quick Links</h3>
            <ul className="space-y-2 text-gray-200">
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to={isAuthenticated ? "/quiz" : "/login?redirect=/quiz"} className="hover:text-white transition-colors">
                  Perfume Finder Quiz
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className=" font-semibold mb-layout-sm">Contact</h3>
            <p className="text-gray-200 mb-2">
              Email: support@scentra.com
            </p>
            <p className="text-gray-200">
              Phone: +358 123456789
            </p>
          </div>
        </div>
        <div className=" text-center text-caption mt-layout-xl text-gray-200">
          <p>&copy; {new Date().getFullYear()} Scentra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

