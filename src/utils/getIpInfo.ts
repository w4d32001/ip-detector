import { toast } from "react-toastify";
import { ipValidated } from "./ipValidated";

const parseIpOctets = (ip: string): number[] => ip.split(".").map(octet => parseInt(octet, 10));

const formatNumber = (num: number): string => num.toLocaleString();

export const getIpInfo = (ip: string) => {
    const { isValid } = ipValidated(ip);
    if (!isValid && ip) {
        toast.error("Dirección IP inválida");
        return { isValid };
    }

    const [oct1, oct2, oct3, oct4] = parseIpOctets(ip);

    let ipClass = "";
    let idRed = "";
    let ipRed = "";
    let idHost = "";
    let ipBroadcast = "";
    let subnetMask = "";
    let netMask = "";
    let numberOfIps = "0";
    let numberOfConfigurableIps = "0";
    let numberOfDifferentNetworks = "0";

    if (oct1 >= 1 && oct1 <= 126) {
        ipClass = "A";
        ipRed = `${oct1}.0.0.0`;
        ipBroadcast = `${oct1}.255.255.255`;
        idRed = `${oct1}`;
        idHost = `${oct2}.${oct3}.${oct4}`;
        netMask = "255.0.0.0";
        subnetMask = "/8";
        numberOfIps = formatNumber(2 ** 24);
        numberOfConfigurableIps = formatNumber(2 ** 24 - 2);
        numberOfDifferentNetworks = formatNumber(126); 
    } else if (oct1 >= 128 && oct1 <= 191) {
        ipClass = "B";
        ipRed = `${oct1}.${oct2}.0.0`;
        ipBroadcast = `${oct1}.${oct2}.255.255`;
        idRed = `${oct1}.${oct2}`;
        idHost = `${oct3}.${oct4}`;
        netMask = "255.255.0.0";
        subnetMask = "/16";
        numberOfIps = formatNumber(2 ** 16);
        numberOfConfigurableIps = formatNumber(2 ** 16 - 2);
        numberOfDifferentNetworks = formatNumber(2 ** 14);

    } else if (oct1 >= 192 && oct1 <= 223) {
        ipClass = "C";
        ipRed = `${oct1}.${oct2}.${oct3}.0`;
        ipBroadcast = `${oct1}.${oct2}.${oct3}.255`;
        idRed = `${oct1}.${oct2}.${oct3}`;
        idHost = `${oct4}`;
        netMask = "255.255.255.0";
        subnetMask = "/24";
        numberOfIps = formatNumber(2 ** 8);
        numberOfConfigurableIps = formatNumber(2 ** 8 - 2);
        numberOfDifferentNetworks = formatNumber(2 ** 21);

    } else if (oct1 >= 224 && oct1 <= 239) {
        ipClass = "D";
        idRed = "Multicast";
    } else if (oct1 >= 240 && oct1 <= 255) {
        ipClass = "E";
        idRed = "Experimental";
    }

    return {
        ipClass,
        isValid,
        idRed,
        ipRed,
        ipBroadcast,
        idHost,
        subnetMask,
        netMask,
        numberOfIps,
        numberOfConfigurableIps,
        numberOfDifferentNetworks,
    };
};
