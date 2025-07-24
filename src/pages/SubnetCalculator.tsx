import { Calculator, Network, Wifi, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

interface Subnet {
  id: number;
  network: string;
  mask: string;
  cidr: number;
  firstHost: string;
  lastHost: string;
  broadcast: string;
  totalHosts: number;
  usableHosts: number;
  networkClass: string;
  bitsNeeded: number;
  jump: number;
}

type NetworkClass = 'A' | 'B' | 'C' | 'Unknown';

function SubnetCalculator() {
  const [ipAddress, setIpAddress] = useState<string>('192.168.1.0');
  const [numSubnets, setNumSubnets] = useState<number>(4);
  const [subnets, setSubnets] = useState<Subnet[]>([]);
  const [error, setError] = useState<string>('');

  const isValidIP = (ip: string): boolean => {
    const parts = ip.split('.');
    return parts.length === 4 && parts.every(part => {
      const num = parseInt(part);
      return !isNaN(num) && num >= 0 && num <= 255;
    });
  };

  const ipToInt = (ip: string): number => {
    const parts = ip.split('.').map(Number);
    return (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
  };

  const intToIp = (int: number): string => {
    return [
      (int >>> 24) & 255,
      (int >>> 16) & 255,
      (int >>> 8) & 255,
      int & 255
    ].join('.');
  };

  const cidrToMask = (cidr: number): string => {
    const mask = (0xffffffff << (32 - cidr)) >>> 0;
    return intToIp(mask);
  };

  const getNetworkClass = (ip: string): NetworkClass => {
    const firstOctet = parseInt(ip.split('.')[0]);
    if (firstOctet >= 1 && firstOctet <= 126) return 'A';
    if (firstOctet >= 128 && firstOctet <= 191) return 'B';
    if (firstOctet >= 192 && firstOctet <= 223) return 'C';
    return 'Unknown';
  };

  const getDefaultCIDR = (networkClass: NetworkClass): number => {
    switch (networkClass) {
      case 'A': return 8;
      case 'B': return 16;
      case 'C': return 24;
      default: return 24;
    }
  };

  const calculateJump = (cidr: number): number => {
    return Math.pow(2, 32 - cidr);
  };

  const calculateSubnets = (): void => {
    if (!isValidIP(ipAddress)) {
      setError('Dirección IP no válida');
      return;
    }

    if (numSubnets < 1 || numSubnets > 65536) {
      setError('Número de subredes debe estar entre 1 y 65536');
      return;
    }

    const networkClass = getNetworkClass(ipAddress);
    const defaultCIDR = getDefaultCIDR(networkClass);

    const bitsNeeded = Math.ceil(Math.log2(numSubnets));
    const newCidr = defaultCIDR + bitsNeeded;

    if (newCidr > 30) {
      setError('No hay suficientes bits disponibles para crear estas subredes con esta clase de IP');
      return;
    }

    setError('');

    const baseIp = ipToInt(ipAddress);
    const originalMask = (0xffffffff << (32 - defaultCIDR)) >>> 0;
    const networkIp = baseIp & originalMask;
    
    const hostsPerSubnet = Math.pow(2, 32 - newCidr);
    const jump = calculateJump(newCidr);
    const calculatedSubnets: Subnet[] = [];

    for (let i = 0; i < numSubnets; i++) {
      const subnetNetwork = networkIp + (i * hostsPerSubnet);
      const subnetBroadcast = subnetNetwork + hostsPerSubnet - 1;
      const firstHost = subnetNetwork + 1;
      const lastHost = subnetBroadcast - 1;

      calculatedSubnets.push({
        id: i + 1,
        network: intToIp(subnetNetwork),
        mask: cidrToMask(newCidr),
        cidr: newCidr,
        firstHost: intToIp(firstHost),
        lastHost: intToIp(lastHost),
        broadcast: intToIp(subnetBroadcast),
        totalHosts: hostsPerSubnet,
        usableHosts: hostsPerSubnet - 2,
        networkClass: networkClass,
        bitsNeeded: bitsNeeded,
        jump: jump
      });
    }

    setSubnets(calculatedSubnets);
  };

  useEffect(() => {
    calculateSubnets();
  }, [ipAddress, numSubnets]);

  const handleIPChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setIpAddress(e.target.value);
  };

  const handleSubnetsChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNumSubnets(parseInt(e.target.value) || 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Network className="w-12 h-12 text-indigo-400 mr-3" />
            <h1 className="text-4xl font-bold text-white">Calculadora de Subredes</h1>
          </div>
          <p className="text-gray-300 text-lg">Ingresa solo la IP y número de subredes - El resto se calcula automáticamente</p>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Wifi className="w-4 h-4 inline mr-2" />
                Dirección IP Base
              </label>
              <input
                type="text"
                value={ipAddress}
                onChange={handleIPChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="192.168.1.0"
              />
              {ipAddress && isValidIP(ipAddress) && (
                <p className="text-xs text-gray-500 mt-1">
                  Clase: {getNetworkClass(ipAddress)} | CIDR detectado: /{getDefaultCIDR(getNetworkClass(ipAddress))}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Network className="w-4 h-4 inline mr-2" />
                Número de Subredes
              </label>
              <input
                type="number"
                min="1"
                max="65536"
                value={numSubnets}
                onChange={handleSubnetsChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ejemplos Rápidos
              </label>
              <div className="flex flex-col space-y-1">
                <button
                  onClick={() => setIpAddress('10.0.0.0')}
                  className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors"
                >
                  Clase A: 10.0.0.0
                </button>
                <button
                  onClick={() => setIpAddress('172.16.0.0')}
                  className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                >
                  Clase B: 172.16.0.0
                </button>
                <button
                  onClick={() => setIpAddress('192.168.1.0')}
                  className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors"
                >
                  Clase C: 192.168.1.0
                </button>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Results Table */}
        {subnets.length > 0 && !error && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-indigo-600 text-white p-4">
              <h2 className="text-2xl font-bold">Resultados del Cálculo</h2>
              <p className="text-indigo-100">
                Red original: {ipAddress}/{getDefaultCIDR(getNetworkClass(ipAddress))} → 
                {numSubnets} subredes con CIDR /{subnets[0]?.cidr} → {subnets[0]?.bitsNeeded} bits necesarios → Salto: {subnets[0]?.jump}
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subred #</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clase</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Red</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Máscara</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CIDR</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salto</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Primer Host</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Último Host</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Broadcast</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hosts Útiles</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subnets.map((subnet, index) => (
                    <tr key={subnet.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {subnet.id}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          subnet.networkClass === 'A' ? 'bg-green-100 text-green-800' :
                          subnet.networkClass === 'B' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {subnet.networkClass}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{subnet.network}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{subnet.mask}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">/{subnet.cidr}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          {subnet.jump.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-green-600">{subnet.firstHost}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-green-600">{subnet.lastHost}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-red-600">{subnet.broadcast}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {subnet.usableHosts.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Summary Info */}
        {subnets.length > 0 && !error && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Network className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total de Subredes</dt>
                    <dd className="text-lg font-medium text-gray-900">{subnets.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Network className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500">Total de Subredes utilizables</dt>
                    <dd className="text-lg font-medium text-gray-900">{subnets.length - 2}</dd>
                  </dl>
                </div>
              </div>
            </div>


            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calculator className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Hosts por Subred</dt>
                    <dd className="text-lg font-medium text-gray-900">{subnets[0]?.usableHosts.toLocaleString() || 0}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Wifi className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">CIDR Calculado</dt>
                    <dd className="text-lg font-medium text-gray-900">/{subnets[0]?.cidr || 0}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ArrowRight className="h-8 w-8 text-orange-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Salto</dt>
                    <dd className="text-lg font-medium text-gray-900">{subnets[0]?.jump.toLocaleString() || 0}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 font-bold text-sm">
                      {getNetworkClass(ipAddress)}
                    </span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Clase de Red</dt>
                    <dd className="text-lg font-medium text-gray-900">Clase {getNetworkClass(ipAddress)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SubnetCalculator;