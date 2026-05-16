import React from "react";
import styles from "../../../styles/style";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div
      className={`relative min-h-[70vh] 800px:min-h-[80vh] w-full bg-no-repeat ${styles.normalFlex}`}
      style={{
        backgroundImage:
          "url(https://themes.rslahmed.dev/rafcart/assets/images/banner-2.jpg)",
      }}
    >
      <div className={`${styles.section} w-[90%] 800px:w-[0=60%]`}>
        <h1
          className={`text-[35px] leading[1.2] 800px:text-[60px] text-[#3d3a3a] font-[600] capitalize`}
        >
          Discover Best Collection <br />
        </h1>
        <p className="pt-4 text-[20px] font-[Poppins] font-[400] text-[#000000ba]">
          Transform your living space with our exclusive home decor collection,
          <br />
          From elegant wall art to cozy accessories.
        </p>
        <Link to="/products" className="inline-block">
          <div className={`${styles.button} mt-5`}>
            <span className="text-[#fff] font-Outfit text-[20px]">
              Shop Now
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
