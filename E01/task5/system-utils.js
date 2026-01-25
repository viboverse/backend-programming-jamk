import os from "os";

export async function getSystemInfo() {
  return {
    uptimeSeconds: os.uptime(),
    totalMemory: os.totalmem() / 1024 ** 2,
    platformName: os.platform(),
    cpuArch: os.arch(),
    cpuCores: os.cpus().length,
  };
}
