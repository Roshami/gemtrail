import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Intro() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home", { replace: true });
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-green-950 via-green-800 to-emerald-600 flex items-center justify-center">

      {/* Animated Background Circles */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-green-400/20 rounded-full blur-2xl animate-pulse"></div>

      <div
        className="absolute bottom-10 right-10 w-52 h-52 bg-emerald-300/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "500ms" }}
      ></div>

      <div
        className="absolute top-1/2 left-1/2 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1000ms" }}
      ></div>

      {/* Main Content */}
      <div className="relative z-10 text-center text-white">

        {/* Logo */}
        <div className="animate-[zoomIn_0.8s_ease-out]">
          <div className="w-28 h-28 mx-auto rounded-full bg-white shadow-2xl flex items-center justify-center">

            <div className="w-20 h-20 rounded-full bg-green-700 flex items-center justify-center shadow-inner">

              <span className="text-5xl font-bold text-white">
                G
              </span>

            </div>

          </div>
        </div>

        {/* Project Name */}
        <h1 className="mt-7 text-5xl md:text-6xl font-extrabold tracking-wide animate-[slideUp_0.9s_ease-out]">
          GemTrail
        </h1>

        {/* Tagline */}
        <p
          className="mt-3 text-lg md:text-xl text-green-100 tracking-wider animate-[fadeIn_1.2s_ease-out]"
          style={{ animationDelay: "500ms", animationFillMode: "both" }}
        >
          Discover. Explore. Plan.
        </p>

        {/* Loading Animation */}
        <div
          className="mt-9 animate-[fadeIn_1s_ease-out]"
          style={{ animationDelay: "900ms", animationFillMode: "both" }}
        >
          <div className="flex justify-center items-center gap-2">

            <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce"></div>

            <div
              className="w-2.5 h-2.5 bg-white rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>

            <div
              className="w-2.5 h-2.5 bg-white rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>

          </div>
        </div>

        {/* Small Text */}
        <p
          className="mt-5 text-sm text-green-200 animate-[fadeIn_1s_ease-out]"
          style={{ animationDelay: "1200ms", animationFillMode: "both" }}
        >
          Your one-day journey starts here
        </p>

      </div>

    </div>
  );
}

export default Intro;