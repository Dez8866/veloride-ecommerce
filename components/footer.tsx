import Link from "next/link";
import { Bike } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Bike className="w-8 h-8 text-blue-500" />
              <span className="text-xl font-bold text-white">
                Velo<span className="text-blue-500">Ride</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Your destination for premium bikes and luxury car toys. Quality and performance in every product.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <p className="text-gray-400 text-sm">
              Get in touch with us for any inquiries about our products or services.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} VeloRide Premium. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
