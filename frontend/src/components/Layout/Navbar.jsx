import React from "react";
import { Link } from "react-router-dom";
import { navItems } from "../../static/data";
import styles from "../../styles/style";

const Navbar = ({ active }) => {
  return (
    <div className={`flex flex-col md:flex-row ${styles.noramlFlex}`}>
      {navItems &&
        navItems.map((item, index) => (
          <div className="flex" key={item.url || item.title || index}>
            <Link
              to={item.url}
              className={`pb-2 md:pb-0 px-4 md:px-6 font-medium cursor-pointer transition-colors duration-200
                ${
                  active === index + 1
                    ? "text-[#c9a45c]"
                    : "text-slate-900 md:text-white hover:text-[#c9a45c]"
                }`}
            >
              {item.title}
            </Link>
          </div>
        ))}
    </div>
  );
};

export default Navbar;