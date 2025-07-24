import { useState } from "react";
import { Card } from "../components/Card";
import { getIpInfo } from "../utils/getIpInfo";
import { Search } from "lucide-react";

function IpDetector() {
  const [ip, setIp] = useState("");
    const [isValid, setIsValid] = useState<boolean>(false);
    const [ipClass, setIpClass] = useState<string | undefined>("");
    const [idRed, setIdRed] = useState<string | undefined>("");
    const [ipRed, setIpRed] = useState<string | undefined>("");
    const [ipBroadcast, setIpBroadcast] = useState<string | undefined>("");
    const [idHost, setIdHost] = useState<string | undefined>("");
    const [subnetMask, setSubnetMask] = useState<string | undefined>("");
    const [netMask, setNetMask] = useState<string | undefined>("");
    const [numberOfIps, setNumberOfIps] = useState<string | undefined>("");
    const [numberOfConfigurableIps, setNumberOfConfigurableIps] = useState<
        string | undefined
    >("");
    const [numberOfDifferentNetworks, setNumberOfDifferentNetworks] = useState<
        string | undefined
    >("");

    const selectIp = (ip: string) => {
        const {
            isValid,
            ipClass,
            idRed,
            ipRed,
            ipBroadcast,
            idHost,
            subnetMask,
            numberOfIps,
            numberOfConfigurableIps,
            numberOfDifferentNetworks,
            netMask,
        } = getIpInfo(ip);
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
        setIsValid(isValid);
    };

    return (
        <div className="min-h-svh flex flex-col justify-start bg-primary text-black items-center gap-y-8 p-4 md:p-8 font-mono">
            <header className="flex items-center">
                <div className="flex items-center">
                    <form action="">
                        <div className="flex items-center">
                            <input
                                type="text"
                                className="bg-white rounded-l py-2 px-4 outline-none text-black font-mono"
                                placeholder="0.0.0.0"
                                value={ip}
                                onChange={(e) => setIp(e.target.value)}
                            />
                            <button
                                className="bg-gray-300 text-black rounded-r p-2 right-0 top-0 cursor-pointer border-l border-gray-300"
                                onClick={() => selectIp(ip)}
                            >
                                <Search />
                            </button>
                        </div>
                    </form>
                </div>
            </header>
            <main className="grid  grid-cols-6 w-full gap-8 px-8 md:px-16">
                <div className="col-span-6 md:col-span-2 bg-secondary shadow-xl rounded flex flex-col p-4 gap-y-4 justify-center">
                    <span className="text-4xl text-gray-100">Clase:</span>
                    <span className="text-5xl md:text-7xl text-center text-purple-600 font-bold font-mono">
                        {ipClass && isValid ? ipClass : "N/A"}
                    </span>
                </div>
                <div className="col-span-6 md:col-span-4 bg-secondary shadow-xl rounded flex flex-col justify-between p-4">
                    <div className="flex p-4 items-center flex-col lg:flex-row justify-around gap-4 border-b border-gray-300">
                        <div className="flex lg:w-1/2 items-center flex-col gap-y-2">
                            <span className="text-xl md:text-2xl text-start text-gray-300">
                                Direccion IP:
                            </span>
                            <span className="text-2xl md:text-3xl text-white font-bold">
                                {subnetMask && isValid
                                    ? ip + subnetMask
                                    : "N/A"}
                            </span>
                        </div>
                        <div className="flex lg:w-1/2 items-center  flex-col gap-y-2">
                            <span className="text-xl md:text-2xl text-gray-300">
                                Ip de red:
                            </span>
                            <span className="text-2xl md:text-3xl text-white font-bold">
                                {ipRed && isValid ? ipRed : "N/A"}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-around mt-4">
                        <div className="flex flex-col md:flex-row items-center gap-y-2">
                            <span className="text-gray-300 text-xl">
                                Id de Red:{" "}
                            </span>
                            <span className="text-3xl text-white font-bold">
                                {idRed && isValid ? idRed : "N/A"}
                            </span>
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-y-2">
                            <span className="text-gray-300 text-xl">
                                Id de Host:{" "}
                            </span>
                            <span className="text-3xl text-white font-bold">
                                {idHost && isValid ? idHost : "N/A"}
                            </span>
                        </div>
                    </div>
                </div>
                <Card
                    title="Mascara de red"
                    value={netMask && isValid ? netMask : "N/A"}
                />
                <Card
                    title="Direccion de Broadcast"
                    value={ipBroadcast && isValid ? ipBroadcast : "N/A"}
                />
                <Card title="Ip de host" value={ip && isValid ? ip : "N/A"} />
                <Card
                    title="Nro de ips"
                    value={numberOfIps && isValid ? numberOfIps : "N/A"}
                />
                <Card
                    title="Nro de ips configurables"
                    value={
                        numberOfConfigurableIps && isValid
                            ? numberOfConfigurableIps
                            : "N/A"
                    }
                />
                <Card
                    title="Nro de redes distintas"
                    value={
                        numberOfDifferentNetworks && isValid
                            ? numberOfDifferentNetworks
                            : "N/A"
                    }
                />
            </main>
            
        </div>
    );
}

export default IpDetector