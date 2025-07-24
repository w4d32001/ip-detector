import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="min-h-svh flex flex-col justify-center bg-primary text-white items-center font-mono gap-y-12">
            <div className="flex flex-col items-center gap-y-4">
                <h1 className="text-2xl font-bold">Home</h1>
                <p className="text-lg">Bienvenido a la aplicación IP Detector</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-8">
                <Link
                    to="/ip-detector"
                    className="bg-secondary p-8 flex items-center justify-center rounded shadow-lg"
                >
                    Ir a IP Detector
                </Link>
                <Link
                    to="/pull-ip"
                    className="bg-secondary p-8 flex items-center justify-center rounded shadow-lg"
                >
                    Pull IP
                </Link>
            </div>
        </div>
    );
}

export default Home;
