import { Outlet } from "react-router";
import { Navbar } from "./Components/NavBar";
import Footer from "./Components/Footer";

function App() {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default App;
