import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

function Footer() {
  return (
    <footer className="relative overflow-hidden py-10">
      {/* Background  */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#28cdba] via-[#20a89a] to-[#1a8a80] z-0">
        <div className="absolute top-[-50%] left-[-20%] w-[70%] h-[150%] bg-[#5eeadb] rounded-full opacity-30 blur-[80px]"></div>
        <div className="absolute bottom-[-30%] right-[-10%] w-[60%] h-[120%] bg-[#1a9e8f] rounded-full opacity-40 blur-[100px]"></div>
        <div className="absolute top-[20%] right-[20%] w-[40%] h-[40%] bg-[#7ff5e8] rounded-full opacity-20 blur-[60px]"></div>
        <div className="absolute bottom-[10%] left-[30%] w-[30%] h-[30%] bg-[#0f6b61] rounded-full opacity-30 blur-[70px]"></div>
      </div>

      {/* Konten footer*/}
      <div className="container mx-auto px-96 relative z-10 text-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo dan Deskripsi */}
          <div className="col-span-1">
            <h2 className="text-2xl font-bold mb-4">TravelJoy</h2>
            <p className="text-sm mb-4">Temukan destinasi impianmu, pesan tiket dengan mudah, dan ciptakan kenangan seumur hidup bersama kami.</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-gray-200 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="hover:text-gray-200 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="hover:text-gray-200 transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="hover:text-gray-200 transition-colors">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Jelajahi</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:underline">
                  Destinasi Populer
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Aktivitas Terbaik
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Promo Spesial
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Kategori Wisata
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Blog Perjalanan
                </a>
              </li>
            </ul>
          </div>

          {/* Informasi */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Informasi</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:underline">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Syarat & Ketentuan
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Kebijakan Privasi
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Hubungi Kami
                </a>
              </li>
            </ul>
          </div>

          {/* Kontak */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Kontak</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MdLocationOn size={18} />
                <span>Jl. Wisata Indah No. 123, Jakarta</span>
              </li>
              <li className="flex items-center gap-2">
                <MdPhone size={18} />
                <span>+62 812 3456 7890</span>
              </li>
              <li className="flex items-center gap-2">
                <MdEmail size={18} />
                <span>info@traveljoy.id</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-6 text-center text-sm">
          <p>© {new Date().getFullYear()} TravelJoy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
