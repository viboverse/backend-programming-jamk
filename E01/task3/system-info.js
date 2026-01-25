import os from "os";

function getSystemInfo() {
  return {
    uptimeSeconds: os.uptime(),
    totalMemory: os.totalmem() / 1024 ** 2,
    platformName: os.platform(),
    cpuArch: os.arch(),
    cpuCores: os.cpus().length,
  };
}

const info = getSystemInfo();

console.log(info);
