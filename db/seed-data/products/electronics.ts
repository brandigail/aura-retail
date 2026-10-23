import type { RawSeedProduct } from "../types";

export const electronicsProducts: RawSeedProduct[] = [
  {
    name: "Helix H7 8-Core Desktop Processor",
    price: 32900,
    stock: 27,
    art: "cpu",
    hue: 215,
    description:
      "The all-rounder: eight fast cores for high-refresh gaming and sustained creative workloads, with integrated graphics for troubleshooting or light use.",
    specs: {
      Cores: "8 (16 threads)",
      "Base / Boost Clock": "4.2 / 5.3 GHz",
      "L3 Cache": "32 MB",
      Socket: "AM5",
      TDP: "105 W",
    },
  },
  {
    name: "Nova GT Pro 12GB Graphics Card",
    price: 49900,
    stock: 11,
    art: "gpu",
    hue: 150,
    description:
      "A strong 1440p graphics card with generous VRAM and a dual-fan cooler that stays quiet under load. Smooth frame rates at high settings in modern games.",
    specs: {
      Memory: "12 GB GDDR6X",
      "Boost Clock": "2.6 GHz",
      Outputs: "3x DisplayPort 1.4a, 1x HDMI 2.1",
      "Power Connector": "1x 12-pin",
      "Card Length": "305 mm",
    },
  },
  {
    name: "Ember DDR5-6000 32GB (2x16GB) Memory Kit",
    price: 12900,
    stock: 64,
    art: "ram",
    hue: 25,
    description:
      "A low-latency dual-channel memory kit with EXPO and XMP profiles, tested at its rated speed on mainstream motherboards.",
    specs: {
      Capacity: "32 GB (2x16 GB)",
      Speed: "DDR5-6000",
      Latency: "CL30-38-38-96",
      Voltage: "1.35 V",
      Profiles: "EXPO / XMP 3.0",
    },
  },
  {
    name: "Stratus 1TB NVMe Gen4 SSD",
    price: 7900,
    stock: 88,
    art: "ssd",
    hue: 190,
    description:
      "A fast, dependable boot and game drive with a DRAM cache and a five-year warranty. Slots straight into any M.2 port.",
    specs: {
      Capacity: "1 TB",
      Interface: "PCIe 4.0 x4 NVMe",
      "Sequential Read / Write": "7,000 / 5,300 MB/s",
      "Form Factor": "M.2 2280",
      Warranty: "5 years",
    },
  },
  {
    name: "Keystone 75% Wireless Mechanical Keyboard",
    price: 8900,
    stock: 35,
    art: "keyboard",
    hue: 265,
    description:
      "A compact 75% keyboard with hot-swappable linear switches, a gasket-mounted plate and three connection modes: Bluetooth, 2.4 GHz and USB-C.",
    specs: {
      Layout: "75% (84 keys)",
      Switches: "Hot-swappable linear",
      Connectivity: "USB-C, Bluetooth 5.1, 2.4 GHz",
      Battery: "4,000 mAh (about 120 hours)",
      Compatibility: "Windows, macOS, Linux",
    },
  },
  {
    name: "Pointer Pro Wireless Mouse",
    price: 5900,
    stock: 52,
    art: "mouse",
    hue: 300,
    description:
      "A light 58 g mouse with a precise 26,000 DPI sensor and a battery that lasts weeks, not days. Connects over Bluetooth or a 2.4 GHz dongle.",
    specs: {
      Sensor: "26,000 DPI optical",
      Weight: "58 g",
      Connectivity: "2.4 GHz, Bluetooth, USB-C",
      Battery: "Up to 90 hours",
      Buttons: "6 programmable",
    },
  },
];
