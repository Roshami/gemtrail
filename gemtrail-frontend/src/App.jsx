import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './App.css'
import Navbar from './components/Navbar';
import Intro from './pages/Intro';
import Home from './pages/Home';
import Places from './pages/Places';
import PlaceDetails from './pages/PlaceDetails';
import Itinerary from './pages/Itinerary';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const location = useLocation();

  const isIntroPage = location.pathname === "/intro";

  return (
    <>
      {!isIntroPage && <Navbar />}

      <Routes>

        <Route
          path="/"
          element={<Navigate to="/intro" replace />}
        />

        <Route
          path="/intro"
          element={<Intro />}
        />

        <Route
          path="/home"
          element={<Home />}
        />

        <Route
          path="/places"
          element={<Places />}
        />

        <Route
          path="/places/:id"
          element={<PlaceDetails />}
        />

        <Route
          path="/itinerary"
          element={<Itinerary />}
        />


        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

      </Routes>
    </>
  );
}

export default App;