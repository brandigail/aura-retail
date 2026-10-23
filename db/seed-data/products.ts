export interface SeedProduct {
  slug: string;
  name: string;
  category: string;
  /** Integer cents. */
  price: number;
  stock: number;
  description: string;
  specs: Record<string, string>;
}

export const seedProducts: SeedProduct[] = [
  {
    slug: "helix-h5-6-core-processor",
    name: "Helix H5 6-Core Desktop Processor",
    category: "Processors",
    price: 18900,
    stock: 42,
    description:
      "An efficient six-core chip for everyday builds and 1080p gaming. Runs cool enough to use with the bundled cooler.",
    specs: {
      Cores: "6 (12 threads)",
      "Base / Boost Clock": "3.8 / 5.0 GHz",
      "L3 Cache": "32 MB",
      Socket: "AM5",
      TDP: "65 W",
      "Integrated Graphics": "Yes",
    },
  },
  {
    slug: "helix-h7-8-core-processor",
    name: "Helix H7 8-Core Desktop Processor",
    category: "Processors",
    price: 32900,
    stock: 27,
    description:
      "The all-rounder: eight fast cores for high-refresh gaming and sustained creative workloads.",
    specs: {
      Cores: "8 (16 threads)",
      "Base / Boost Clock": "4.2 / 5.3 GHz",
      "L3 Cache": "32 MB",
      Socket: "AM5",
      TDP: "105 W",
      "Integrated Graphics": "Yes",
    },
  },
  {
    slug: "helix-h9-16-core-processor",
    name: "Helix H9 16-Core Desktop Processor",
    category: "Processors",
    price: 54900,
    stock: 4,
    description:
      "Sixteen cores for rendering, compiling and streaming while you game. Cooler not included.",
    specs: {
      Cores: "16 (32 threads)",
      "Base / Boost Clock": "4.5 / 5.7 GHz",
      "L3 Cache": "64 MB",
      Socket: "AM5",
      TDP: "170 W",
      "Integrated Graphics": "Yes",
    },
  },
  {
    slug: "nova-gt-8gb-graphics-card",
    name: "Nova GT 8GB Graphics Card",
    category: "Graphics Cards",
    price: 29900,
    stock: 18,
    description:
      "Smooth 1080p gaming at high settings in a compact dual-fan design that fits small cases.",
    specs: {
      Memory: "8 GB GDDR6",
      "Boost Clock": "2.5 GHz",
      "Memory Bus": "128-bit",
      Outputs: "3x DisplayPort 1.4a, 1x HDMI 2.1",
      "Power Connector": "1x 8-pin",
      "Card Length": "242 mm",
    },
  },
  {
    slug: "nova-gt-pro-12gb-graphics-card",
    name: "Nova GT Pro 12GB Graphics Card",
    category: "Graphics Cards",
    price: 49900,
    stock: 11,
    description:
      "A strong 1440p card with generous VRAM and a triple-fan cooler that stays quiet under load.",
    specs: {
      Memory: "12 GB GDDR6X",
      "Boost Clock": "2.6 GHz",
      "Memory Bus": "192-bit",
      Outputs: "3x DisplayPort 1.4a, 1x HDMI 2.1",
      "Power Connector": "1x 12-pin",
      "Card Length": "305 mm",
    },
  },
  {
    slug: "nova-gt-ultra-16gb-graphics-card",
    name: "Nova GT Ultra 16GB Graphics Card",
    category: "Graphics Cards",
    price: 79900,
    stock: 0,
    description:
      "Flagship performance for 4K gaming and GPU compute. Needs a 750 W or larger power supply.",
    specs: {
      Memory: "16 GB GDDR6X",
      "Boost Clock": "2.7 GHz",
      "Memory Bus": "256-bit",
      Outputs: "3x DisplayPort 1.4a, 1x HDMI 2.1",
      "Power Connector": "1x 12-pin",
      "Card Length": "336 mm",
    },
  },
  {
    slug: "ember-ddr5-32gb-6000-memory",
    name: "Ember DDR5-6000 32GB (2x16GB) Memory Kit",
    category: "Memory",
    price: 12900,
    stock: 64,
    description:
      "A low-latency dual-channel kit with EXPO and XMP profiles, tested at rated speed on mainstream boards.",
    specs: {
      Capacity: "32 GB (2x16 GB)",
      Speed: "DDR5-6000",
      Latency: "CL30-38-38-96",
      Voltage: "1.35 V",
      Profiles: "EXPO / XMP 3.0",
      "Heat Spreader": "Aluminium, low profile",
    },
  },
  {
    slug: "ember-ddr5-64gb-6400-memory",
    name: "Ember DDR5-6400 64GB (2x32GB) Memory Kit",
    category: "Memory",
    price: 23900,
    stock: 15,
    description:
      "High-capacity memory for virtual machines, video editing and large datasets, without giving up speed.",
    specs: {
      Capacity: "64 GB (2x32 GB)",
      Speed: "DDR5-6400",
      Latency: "CL32-39-39-102",
      Voltage: "1.40 V",
      Profiles: "XMP 3.0",
      "Heat Spreader": "Aluminium, RGB lighting",
    },
  },
  {
    slug: "stratus-nvme-1tb-gen4-ssd",
    name: "Stratus 1TB NVMe Gen4 SSD",
    category: "Storage",
    price: 7900,
    stock: 88,
    description:
      "Fast, dependable boot and game drive with a DRAM cache and a 5-year warranty.",
    specs: {
      Capacity: "1 TB",
      Interface: "PCIe 4.0 x4 NVMe",
      "Sequential Read / Write": "7,000 / 5,300 MB/s",
      "Form Factor": "M.2 2280",
      Endurance: "600 TBW",
      Warranty: "5 years",
    },
  },
  {
    slug: "stratus-nvme-2tb-gen4-ssd",
    name: "Stratus 2TB NVMe Gen4 SSD",
    category: "Storage",
    price: 13900,
    stock: 3,
    description:
      "Room for a whole game library on the same fast controller, with a thin heatsink for tight boards.",
    specs: {
      Capacity: "2 TB",
      Interface: "PCIe 4.0 x4 NVMe",
      "Sequential Read / Write": "7,300 / 6,600 MB/s",
      "Form Factor": "M.2 2280",
      Endurance: "1,200 TBW",
      Warranty: "5 years",
    },
  },
  {
    slug: "stratus-sata-1tb-ssd",
    name: "Stratus 1TB SATA SSD",
    category: "Storage",
    price: 6900,
    stock: 56,
    description:
      "An easy upgrade for older desktops and laptops, with no special slot required.",
    specs: {
      Capacity: "1 TB",
      Interface: "SATA III 6 Gb/s",
      "Sequential Read / Write": "560 / 520 MB/s",
      "Form Factor": '2.5" 7 mm',
      Endurance: "360 TBW",
      Warranty: "3 years",
    },
  },
  {
    slug: "atlas-b650-atx-wifi-motherboard",
    name: "Atlas B650 ATX WiFi Motherboard",
    category: "Motherboards",
    price: 19900,
    stock: 21,
    description:
      "A solid mid-range ATX board with PCIe 5.0 graphics, three M.2 slots and built-in WiFi 6E.",
    specs: {
      Socket: "AM5",
      Chipset: "B650",
      "Form Factor": "ATX",
      Memory: "4x DDR5, up to 128 GB",
      "M.2 Slots": "3 (1x PCIe 5.0, 2x PCIe 4.0)",
      Networking: "2.5 GbE, WiFi 6E, Bluetooth 5.3",
    },
  },
  {
    slug: "atlas-b650-mini-itx-motherboard",
    name: "Atlas B650I Mini-ITX Motherboard",
    category: "Motherboards",
    price: 17900,
    stock: 9,
    description:
      "Full-featured small-form-factor board for compact builds, with a reinforced PCIe slot and rear USB-C.",
    specs: {
      Socket: "AM5",
      Chipset: "B650",
      "Form Factor": "Mini-ITX",
      Memory: "2x DDR5, up to 64 GB",
      "M.2 Slots": "2 (PCIe 4.0)",
      Networking: "2.5 GbE, WiFi 6E, Bluetooth 5.3",
    },
  },
  {
    slug: "glacier-240-aio-liquid-cooler",
    name: "Glacier 240mm AIO Liquid Cooler",
    category: "Cooling",
    price: 9900,
    stock: 30,
    description:
      "A quiet 240 mm all-in-one cooler with a low-noise pump and two PWM fans. Fits AM5 and LGA1700.",
    specs: {
      "Radiator Size": "240 mm",
      Fans: "2x 120 mm PWM",
      "Max Noise": "28 dBA",
      "Socket Support": "AM5, AM4, LGA1700, LGA1851",
      "Tube Length": "400 mm",
      Warranty: "5 years",
    },
  },
  {
    slug: "glacier-air-tower-cpu-cooler",
    name: "Glacier Air Tower CPU Cooler",
    category: "Cooling",
    price: 4900,
    stock: 47,
    description:
      "A dependable single-tower air cooler that handles most 8-core chips without the pump noise or leak risk.",
    specs: {
      Height: "155 mm",
      Fans: "1x 120 mm PWM",
      "Heat Pipes": "5x 6 mm copper",
      "Max Noise": "25 dBA",
      "Socket Support": "AM5, AM4, LGA1700",
      Warranty: "3 years",
    },
  },
  {
    slug: "forge-750w-gold-power-supply",
    name: "Forge 750W 80+ Gold Modular Power Supply",
    category: "Power Supplies",
    price: 10900,
    stock: 24,
    description:
      "Fully modular, 80+ Gold efficient and quiet at low loads, with a native 12-pin cable for modern graphics cards.",
    specs: {
      Wattage: "750 W",
      Efficiency: "80+ Gold",
      Modularity: "Fully modular",
      "Form Factor": "ATX",
      "Fan Size": "135 mm, zero-RPM mode",
      Warranty: "10 years",
    },
  },
  {
    slug: "keystone-75-mechanical-keyboard",
    name: "Keystone 75% Wireless Mechanical Keyboard",
    category: "Peripherals",
    price: 8900,
    stock: 35,
    description:
      "A compact 75% layout with hot-swappable linear switches, gasket mount and three connection modes.",
    specs: {
      Layout: "75% (84 keys)",
      Switches: "Hot-swappable linear",
      Connectivity: "USB-C, Bluetooth 5.1, 2.4 GHz",
      Battery: "4,000 mAh (about 120 hours)",
      Keycaps: "PBT double-shot",
      Compatibility: "Windows, macOS, Linux",
    },
  },
  {
    slug: "pointer-pro-wireless-mouse",
    name: "Pointer Pro Wireless Mouse",
    category: "Peripherals",
    price: 5900,
    stock: 52,
    description:
      "A light 58 g mouse with a precise 26,000 DPI sensor and a battery that lasts weeks, not days.",
    specs: {
      Sensor: "26,000 DPI optical",
      Weight: "58 g",
      Connectivity: "2.4 GHz, Bluetooth, USB-C",
      Battery: "Up to 90 hours",
      Buttons: "6 programmable",
      "Polling Rate": "Up to 4,000 Hz",
    },
  },
];
