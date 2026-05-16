
import React from "react";
import Lottie from "react-lottie";
import animationData from "../../Assests/animations/Animation - 1718914824813.json";

const Loader = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-white">
      <div className="w-[200px] sm:w-[250px] md:w-[300px]">
        <Lottie options={defaultOptions} />
      </div>
    </div>
  );
};

export default Loader;