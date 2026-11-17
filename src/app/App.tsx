import { Route, Routes } from "react-router-dom";
import Home from "../pages/movies/Home";
import Favorites from "../pages/movies/Favorites";
import NavBar from "../components/NavBar";
import "../styles/App.css";
import Login from "../pages/auth/Login";
import DefaultPage from "../pages/landing/DefaultPage";
import ProtectedRoute from "../components/ProtectedRoute";
import AIAssistance from "../pages/ai-assistance/AIAssistance";
function App() {
  return (
    <>
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<DefaultPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/discover" element={<Home />} />
          <Route path="/ai-assistance" element={<AIAssistance />} />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </>
  );
}

export default App;
