import { toast } from "react-toastify";
import { ipValidated } from "./ipValidated";

export const getIpInfo = (ip: string) => {
    const { isValid } = ipValidated(ip);

    if (!isValid && ip) {
        toast.error("Dirección IP inválida");
    }

    const firstOctet = parseInt(ip.split(".")[0], 10);

    let ipClass = "";
    let idRed = ""
    let ipRed = "";
    let idHost = "";
    let ipBroadcast = "";
    let subnetMask = "";
    let numberOfIps = "0";
    let numberOfConfigurableIps = "0";
    let numberOfDifferentNetworks = "0";

    if (firstOctet >= 1 && firstOctet <= 126) {
        ipClass = "A";

        ipRed = `${firstOctet}.0.0.0`;

        ipBroadcast = `${firstOctet}.255.255.255`;

        idHost = `${parseInt(ip.split(".")[3], 10)}`;

        idRed = `${firstOctet}`;

        idHost = `${parseInt(ip.split(".")[1], 10)}.${parseInt(ip.split(".")[2], 10)}.${parseInt(ip.split(".")[3], 10)}`;

        subnetMask = "255.0.0.0";

        numberOfIps = '16,777,216'; 
        numberOfConfigurableIps = '16,777,214';
        numberOfDifferentNetworks = '126'; 

    } else if (firstOctet >= 128 && firstOctet <= 191) {
        ipClass = "B";

        ipRed = `${firstOctet}.${parseInt(ip.split(".")[1], 10)}.0.0`;

        ipBroadcast = `${firstOctet}.${parseInt(ip.split(".")[1], 10)}.255.255`;

        idRed = `${firstOctet}.${parseInt(ip.split(".")[1], 10)}`;

        subnetMask = "255.255.0.0";

        numberOfIps = '65,536';

        idHost = `${parseInt(ip.split(".")[2], 10)}.${parseInt(ip.split(".")[3], 10)}`;

        numberOfConfigurableIps = '65,534';

        numberOfDifferentNetworks = '16,384';

    } else if (firstOctet >= 192 && firstOctet <= 223) {
        ipClass = "C";

        ipRed = `${firstOctet}.${parseInt(ip.split(".")[1], 10)}.${parseInt(ip.split(".")[2], 10)}.0`;

        ipBroadcast = `${firstOctet}.${parseInt(ip.split(".")[1], 10)}.${parseInt(ip.split(".")[2], 10)}.255`;

        idRed = `${firstOctet}.${parseInt(ip.split(".")[1], 10)}.${parseInt(ip.split(".")[2], 10)}`;

        idHost = `${parseInt(ip.split(".")[3], 10)}`;

        subnetMask = "255.0.0.0";

        numberOfIps = '256';

        numberOfConfigurableIps = '254';

        numberOfDifferentNetworks = '2,097,152';

    } else if (firstOctet >= 224 && firstOctet <= 239) {
        ipClass = "D";
        idRed = "Multicast";
    } else if (firstOctet >= 240 && firstOctet <= 255) {
        ipClass = "E";
        idRed = "Experimental";
    }

    return { ipClass, isValid, idRed, ipRed, ipBroadcast, idHost, subnetMask, numberOfIps, numberOfConfigurableIps, numberOfDifferentNetworks };
};