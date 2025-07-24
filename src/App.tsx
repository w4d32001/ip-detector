import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home";
import PullIp from "./pages/SubnetCalculator";
import IpDetector from "./pages/IpDetector";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/ip-detector" element={<IpDetector />} />
                <Route path="/pull-ip" element={<PullIp />} />
                <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
            <ToastContainer />
        </div>
    );
}

export default App;
