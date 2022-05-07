import { Api } from '../api';

const network = () => {
  const downloadSpeed = ({ url, size }) => new Promise((resolve) => {
    const startTime = new Date().getTime();

    Api.get(url).then((response) => {
      const endTime = new Date().getTime();
      const duration = (endTime - startTime) / 1000;
      // Convert bytes into bits by multiplying with 8
      const bitsLoaded = size * 8;
      const bps = (bitsLoaded / duration).toFixed(2);
      const kbps = (bps / 1000).toFixed(2);
      const mbps = (kbps / 1000).toFixed(2);
      resolve({ bps, kbps, mbps });
    }).catch((error) => {
      resolve({ bps: 0, kbps: 0, mbps: 0 });
    });
  })

  return {
    downloadSpeed
  }
}

export default network;
