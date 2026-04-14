import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Component that scrolls the window to the top on every route change.
 * This should be placed inside the Router component in App.jsx.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top of the window
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // Use "instant" to avoid a visible scrolling effect during navigation
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
