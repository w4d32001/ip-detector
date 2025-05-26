import { Search } from "lucide-react";
import { Card } from "./components/Card";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { getIpInfo } from "./utils/getIpInfo";

function App() {
    const [ip, setIp] = useState("1.1.1.1")
    const [ipClass, setIpClass] = useState<string>("");
    const [idRed, setIdRed] = useState<string>("");
    const [ipRed, setIpRed] = useState<string>("");
    const [ipBroadcast, setIpBroadcast] = useState<string>("");
    const [idHost, setIdHost] = useState<string>("");
    const [subnetMask, setSubnetMask] = useState<string>("");
    const [netMask, setNetMask] = useState<string>("");
    const [numberOfIps, setNumberOfIps] = useState<string>("");
    const [numberOfConfigurableIps, setNumberOfConfigurableIps] = useState<string>("");
    const [numberOfDifferentNetworks, setNumberOfDifferentNetworks] = useState<string>("");

    const selectIp = (ip: string) => {
        const {isValid, ipClass, idRed, ipRed, ipBroadcast, idHost, subnetMask, numberOfIps, numberOfConfigurableIps, numberOfDifferentNetworks, netMask} = getIpInfo(ip);
        console.log(isValid)
        console.log(ipClass)
        setIpClass(ipClass);
        setIdRed(idRed);
        setIpRed(ipRed);
        setIpBroadcast(ipBroadcast);
        setIdHost(idHost);
        setSubnetMask(subnetMask);
        setNumberOfIps(numberOfIps);
        setNumberOfConfigurableIps(numberOfConfigurableIps);
        setNumberOfDifferentNetworks(numberOfDifferentNetworks);
        setNetMask(netMask);
    }

    return (
        <div className="min-h-svh flex flex-col justify-start bg-primary text-black items-center gap-y-8 p-4 md:p-8 font-mono">
            <header className=" flex items-center">
                <div className="flex items-center">
                    <div className="flex items-center">
                        <input
                            type="text"
                            className="bg-white rounded-l py-2 px-4 outline-none text-black font-mono"
                            placeholder="1.1.1.1"
                            value={ip}
                            onChange={(e) => setIp(e.target.value)}
                        />
                        <button className="bg-gray-300 text-black rounded-r p-2 right-0 top-0 cursor-pointer border-l border-gray-300" onClick={() => selectIp(ip)}>
                            <Search />
                        </button>
                    </div>
                </div>
            </header>
            <main className="grid  grid-cols-6 w-full gap-8 px-8 md:px-16">
                <div className="col-span-6 md:col-span-2 bg-secondary shadow-xl rounded flex flex-col p-4 gap-y-4 justify-center">
                    <span className="text-4xl text-gray-100">Clase:</span>
                    <span className="text-5xl md:text-7xl text-center text-purple-600 font-bold font-mono">
                        {ipClass ? ipClass : "N/A"}
                    </span>
                </div>
                <div className="col-span-6 md:col-span-4 bg-secondary shadow-xl rounded flex flex-col justify-between p-4">
                    <div className="flex p-4 items-center flex-col lg:flex-row justify-around gap-4 border-b border-gray-300">
                        <div className="flex lg:w-1/2 items-center flex-col gap-y-2">
                            <span className="text-xl md:text-2xl text-start text-gray-300">
                                Direccion IP:
                            </span>
                            <span className="text-2xl md:text-3xl text-white font-bold">
                                {subnetMask ? ip + subnetMask : "N/A"}
                            </span>
                        </div>
                        <div className="flex lg:w-1/2 items-center  flex-col gap-y-2">
                            <span className="text-xl md:text-2xl text-gray-300">
                                Ip de red:
                            </span>
                            <span className="text-2xl md:text-3xl text-white font-bold">
                                {ipRed ? ipRed : "N/A"}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-around mt-4">
                        <div className="flex flex-col md:flex-row items-center gap-y-2">
                            <span className="text-gray-300 text-xl">
                                Id de Red:{" "}
                            </span>
                            <span className="text-3xl text-white font-bold">
                                {idRed ? idRed : "N/A"}
                            </span>
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-y-2">
                            <span className="text-gray-300 text-xl">
                                Id de Host:{" "}
                            </span>
                            <span className="text-3xl text-white font-bold">
                                { idHost ? idHost : "N/A"}
                            </span>
                        </div>
                    </div>
                </div>
                <Card title="Mascara de red" value={netMask ? netMask : "N/A"} />
                <Card title="Direccion de Broadcast" value={ipBroadcast ? ipBroadcast : "N/A"} />
                <Card title="Ip de host" value={ip} />
                <Card title="Nro de ips" value={numberOfIps ? numberOfIps : "N/A"} />
                <Card title="Nro de ips configurables" value={numberOfConfigurableIps ? numberOfConfigurableIps : "N/A"} />
                <Card title="Nro de redes distintas" value={numberOfDifferentNetworks ? numberOfDifferentNetworks : "N/A"} />
            </main>
            <ToastContainer />
        </div>
    );
}

export default App;
