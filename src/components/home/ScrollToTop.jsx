import { ArrowUp } from "lucide-react";
import React, { useEffect, useRef } from "react";

const ScrollToTop = () => {
  const topRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        topRef.current.classList.remove("hidden");
      } else {
        topRef.current.classList.add("hidden");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <>
      <div
        ref={topRef}
        onClick={scrollToTop}
        className="bg-red-500 fixed bottom-5 right-5 z-50 p-3 rounded-full hidden"
      >
        <ArrowUp />
      </div>
    </>
  );
};

export default ScrollToTop;
