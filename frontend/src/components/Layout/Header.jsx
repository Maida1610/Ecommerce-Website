import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/style";
import { categoriesData } from "../../static/data";
import {
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";
import DropDown from "./DropDown";
import Navbar from "./Navbar";
import Cart from "../cart/Cart";
import Wishlist from "../Wishlist/Wishlist";
import { useSelector } from "react-redux";

const Header = ({ activeHeading }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { allProducts } = useSelector((state) => state.products);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [dropDown, setDropDown] = useState(false);
  const [active, setActive] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);

  useEffect(() => {
    const handleScroll = () => setActive(window.scrollY > 70);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = allProducts?.filter((p) =>
      p.name.toLowerCase().includes(term),
    );

    setSearchData(filtered || []);
  };

  const closeAllModals = () => {
    setOpenSidebar(false);
    setOpenCart(false);
    setOpenWishlist(false);
  };

  return (
    <>
      {/* ===== Desktop Header (2 Rows like Screenshot) ===== */}
      <div className="hidden lg:block w-full bg-white border-b border-gray-200">
        {/* ---- Row 1 (Logo + Search + Icons + Button) ---- */}
        <div className={`${styles.section}`}>
          <div className="h-[85px] flex items-center justify-between gap-6">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-[#4361ee] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="text-2xl font-bold text-[#1a1a2e]">Shop<span className="text-[#f72585]">O</span></span>
              </div>
            </Link>

            {/* Search */}
            <div className="flex-1 max-w-[820px] relative">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full h-[50px]  bg-gray-100 px-6 pr-14 outline-none border border-[#4361ee] border 2px   transition-all"
              />
              <AiOutlineSearch
                size={22}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-black cursor-pointer"
              />

              {searchData.length > 0 && (
                <div className="absolute top-[60px] left-0 w-full bg-white shadow-lg border border-gray-200 rounded-xl overflow-hidden z-50 max-h-[260px] overflow-y-auto">
                  {searchData.map((item, i) => (
                    <Link
                      key={i}
                      to={`/product/${item._id}`}
                      onClick={() => setSearchData([])}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all"
                    >
                      <img
                        src={item.images[0]?.url}
                        alt="product"
                        className="w-[45px] h-[45px] rounded-lg object-cover border border-gray-200"
                      />
                      <p className="text-sm text-gray-700">{item.name}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Become Seller */}
            <Link to={isSeller ? "/dashboard" : "/shop-create"}>
              <button className="bg-[#f72585] text-white px-6 py-3 rounded-2xl font-semibold shadow-md hover:bg-[#d6246e] hover:shadow-lg transition-all active:scale-95">
                {isSeller ? "Go Dashboard" : "Become Seller"}
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* ---- Row 2 (Categories + Navbar links) ---- */}
      <div
        className={`w-full  bg-[#4361ee] ${
          active ? "fixed top-0 left-0 z-30 shadow-md" : ""
        }`}
      >
        <div className={`${styles.section}`}>
          <div className="h-[70px] flex items-center justify-between">
            {/* Categories */}
            <div className="relative">
              <button
                onClick={() => setDropDown((prev) => !prev)}
                className="flex items-center gap-3 px-5 h-[50px]   bg-white border border-gray-200 hover:border-white hover:shadow-sm transition-all"
              >
                <BiMenuAltLeft size={24} className="text-[#cdaa80]" />
                <span className="font-semibold text-black">Categories</span>
                <IoIosArrowDown size={18} className="text-black" />
              </button>

              {dropDown && (
                <div className="absolute top-[60px] left-0 z-50">
                  <DropDown
                    categoriesData={categoriesData}
                    setDropDown={setDropDown}
                  />
                </div>
              )}
            </div>

            {/* Navbar */}
            <div className="flex-1 flex justify-center">
              <Navbar active={activeHeading} />
            </div>

            {/* Right Spacer (to keep navbar centered like screenshot) */}
            <div className="w-[270px]" />

            {/* Right Icons + Button */}
            <div className="flex items-center gap-5">
              {/* Wishlist */}
              <button
                onClick={() => setOpenWishlist(true)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-all"
              >
                <AiOutlineHeart size={26} className="text-white" />
                {wishlist?.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#ff2d8d] text-white text-[11px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                onClick={() => setOpenCart(true)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-all"
              >
                <AiOutlineShoppingCart size={26} className="text-white" />
                {cart?.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#ff2d8d] text-white text-[11px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                    {cart.length}
                  </span>
                )}
              </button>

              {/* Profile */}
              {isAuthenticated ? (
                <Link
                  to="/profile"
                  className="p-1 rounded-full hover:bg-gray-100 transition-all"
                >
                  <img
                    src={user?.avatar?.url}
                    alt="Profile"
                    className="w-[40px] h-[40px] rounded-full object-cover border-2 border-white"
                  />
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="p-2 rounded-full hover:bg-gray-100 transition-all"
                >
                  <CgProfile size={26} className="text-white" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Mobile Header (same as your current but keep theme) ===== */}
      <div
        className={`${
          active ? "shadow-sm fixed top-0 left-0 z-20" : ""
        } lg:hidden w-full bg-gradient-to-r from-[#0f1e3f] via-[#213a56] to-[#0f1e3f] h-[60px] flex items-center justify-between px-3 sm:px-4`}
      >
        {/* Menu Button */}
        <button
          className="p-2 cursor-pointer text-white hover:text-[#cdaa80] active:scale-95 transition-all"
          onClick={() => setOpenSidebar(true)}
          aria-label="Open menu"
        >
          <BiMenuAltLeft size={30} />
        </button>

        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <h1 className="text-lg sm:text-xl font-bold text-white">Shop<span className="text-[#f72585]">O</span></h1>
        </Link>

        {/* Icons Container */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Wishlist Icon */}
          <button
            className="p-2 relative cursor-pointer text-white hover:text-[#cdaa80] active:scale-95 transition-all"
            onClick={() => setOpenWishlist(true)}
            aria-label="Open wishlist"
          >
            <AiOutlineHeart size={24} />
            {wishlist?.length > 0 && (
              <span className="absolute top-0 right-0 bg-gradient-to-r from-[#cdaa80] to-[#997953] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Icon */}
          <button
            className="p-2 relative cursor-pointer text-white hover:text-[#cdaa80] active:scale-95 transition-all"
            onClick={() => setOpenCart(true)}
            aria-label="Open cart"
          >
            <AiOutlineShoppingCart size={24} />
            {cart?.length > 0 && (
              <span className="absolute top-0 right-0 bg-gradient-to-r from-[#cdaa80] to-[#997953] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ===== Sidebar for Mobile ===== */}
      {openSidebar && (
        <div
          className="fixed inset-0 bg-[#00000060] z-30 lg:hidden"
          onClick={() => setOpenSidebar(false)}
        >
          <div
            className="fixed bg-black text-white w-[85%] sm:w-[75%] h-full overflow-y-auto shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-black flex justify-between items-center p-4 border-b border-[#cdaa80]">
              {/* Wishlist Icon */}
              <button
                className="p-2 relative cursor-pointer text-white hover:text-[#cdaa80] transition-colors"
                onClick={() => setOpenWishlist(true)}
                aria-label="Open wishlist"
              >
                <AiOutlineHeart size={24} />
                {wishlist?.length > 0 && (
                  <span className="absolute top-0 right-0 bg-gradient-to-r from-[#cdaa80] to-[#997953] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Close Button */}
              <button
                className="p-2 cursor-pointer hover:text-[#cdaa80] active:scale-95 transition-all"
                onClick={() => setOpenSidebar(false)}
                aria-label="Close menu"
              >
                <RxCross1 size={24} />
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-[#cdaa80]">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="h-[40px] w-full border-2 border-[#cdaa80] rounded-md px-3 focus:border-[#997953] focus:outline-none bg-gray-900 text-white placeholder-gray-400"
              />
              {searchData.length > 0 && (
                <div className="bg-gray-900 shadow-md w-full mt-2 rounded-md max-h-[200px] overflow-y-auto border border-[#cdaa80]">
                  {searchData.map((item, i) => (
                    <Link
                      key={i}
                      to={`/product/${item._id}`}
                      onClick={() => closeAllModals()}
                      className="flex items-center gap-3 p-3 hover:bg-[#111827] active:bg-[#020617] transition-colors border-b border-gray-800"
                    >
                      <img
                        src={item.images[0]?.url}
                        alt="product"
                        className="w-[40px] h-[40px] rounded object-cover flex-shrink-0"
                      />
                      <p className="text-sm text-gray-100 line-clamp-2">
                        {item.name}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation Links */}
            <nav className="p-4 border-b border-[#cdaa80]">
              <Navbar active={activeHeading} />
            </nav>

            {/* Seller Button */}
            <div className="p-4 border-b border-[#cdaa80]">
              <Link
                to={isSeller ? "/dashboard" : "/shop-create"}
                onClick={() => setOpenSidebar(false)}
              >
                <div className="bg-gradient-to-r from-[#0f1e3f] via-[#213a56] to-[#997953] rounded-lg hover:shadow-lg transition-all duration-300 active:scale-95">
                  <h1 className="text-white flex items-center justify-center px-6 py-3 font-medium">
                    {isSeller ? "Go Dashboard" : "Become Seller"}
                    <IoIosArrowForward className="ml-2" />
                  </h1>
                </div>
              </Link>
            </div>

            {/* Profile Section */}
            <div className="p-4">
              {isAuthenticated ? (
                <Link
                  to="/profile"
                  onClick={() => setOpenSidebar(false)}
                  className="flex items-center gap-3 p-3 hover:bg-[#111827] active:bg-[#020617] rounded-lg transition-colors"
                >
                  <img
                    src={user?.avatar?.url}
                    alt="profile"
                    className="w-[50px] h-[50px] rounded-full border-2 border-[#cdaa80] object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">My Profile</p>
                    <p className="text-gray-400 text-xs">{user?.name}</p>
                  </div>
                </Link>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setOpenSidebar(false)}
                    className="block w-full bg-gradient-to-r from-[#0f1e3f] to-[#213a56] text-white py-3 rounded-lg text-center font-medium hover:shadow-lg active:scale-95 transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    to="/sign-up"
                    onClick={() => setOpenSidebar(false)}
                    className="block w-full bg-gray-800 text-white py-3 rounded-lg text-center font-medium hover:bg-gray-700 active:scale-95 transition-all"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Popups */}
      {openCart && <Cart setOpenCart={setOpenCart} />}
      {openWishlist && <Wishlist setOpenWishlist={setOpenWishlist} />}
    </>
  );
};

export default Header;