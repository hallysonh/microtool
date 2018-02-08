const os = require('os');

export function networkIp(): string {
  const ifaces = os.networkInterfaces();
  const address = ['127.0.0.1'];
  Object.keys(ifaces).forEach(function(ifname) {
    ifaces[ifname].forEach((iface: any) => {
      if ("IPv4" !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }
      address.push(iface.address);
    });
  });
  return address[address.length - 1];
}
