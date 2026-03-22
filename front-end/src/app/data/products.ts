export interface Product {
  id: string;
  name: string;
  price: number;
  condition: "Excellent" | "Very Good" | "Good" | "Fair";
  category: "Drivers" | "Irons" | "Putters" | "Wedges" | "Hybrids" | "Bags" | "Shoes" | "Balls";
  brand: string;
  description: string;
  image: string;
  location: string;
  seller: string;
  listedDate: string;
  inventory: number;
}

export const products: Product[] = [
  {
    id: "1",
    name: "TaylorMade Stealth 2 Driver",
    price: 349,
    condition: "Excellent",
    category: "Drivers",
    brand: "TaylorMade",
    description: "Barely used TaylorMade Stealth 2 Driver, 10.5° loft. Incredible distance and forgiveness. Comes with headcover.",
    image: "https://images.unsplash.com/photo-1697448524524-99416ed5dbba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwZHJpdmVyJTIwY2x1YnxlbnwxfHx8fDE3NzQxMzQyMDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    location: "San Diego, CA",
    seller: "GolfPro22",
    listedDate: "2026-03-15",
    inventory: 1
  },
  {
    id: "2",
    name: "Scotty Cameron Newport 2 Putter",
    price: 275,
    condition: "Very Good",
    category: "Putters",
    brand: "Scotty Cameron",
    description: "Classic Scotty Cameron Newport 2. 34 inch. Great feel and balance. Minor cosmetic wear on sole.",
    image: "https://images.unsplash.com/photo-1722849899776-3c6abb5a46c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwcHV0dGVyfGVufDF8fHx8MTc3NDEzNDIwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    location: "Austin, TX",
    seller: "PuttKing99",
    listedDate: "2026-03-18",
    inventory: 2
  },
  {
    id: "3",
    name: "Titleist T200 Iron Set (4-PW)",
    price: 799,
    condition: "Excellent",
    category: "Irons",
    brand: "Titleist",
    description: "Titleist T200 irons, 4-PW (7 clubs). Steel shafts, regular flex. Only played 10 rounds. Amazing distance and control.",
    image: "https://images.unsplash.com/photo-1761233976530-d09fc58ad175?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwaXJvbiUyMGNsdWJzfGVufDF8fHx8MTc3NDEzNDIwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    location: "Phoenix, AZ",
    seller: "IronMaster",
    listedDate: "2026-03-14",
    inventory: 1
  },
  {
    id: "4",
    name: "Callaway Golf Bag - Org 14",
    price: 189,
    condition: "Very Good",
    category: "Bags",
    brand: "Callaway",
    description: "Callaway Org 14 cart bag. 14-way top, plenty of pockets. Some dirt marks but structurally perfect.",
    image: "https://images.unsplash.com/photo-1693163532134-5ea6c80b58a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwYmFnJTIwZXF1aXBtZW50fGVufDF8fHx8MTc3NDEzNDIwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    location: "Orlando, FL",
    seller: "BagCollector",
    listedDate: "2026-03-19",
    inventory: 3
  },
  {
    id: "5",
    name: "FootJoy Pro SL Golf Shoes",
    price: 95,
    condition: "Good",
    category: "Shoes",
    brand: "FootJoy",
    description: "FootJoy Pro SL shoes, size 10.5. Comfortable and waterproof. Worn for one season. Minor wear on spikes.",
    image: "https://images.unsplash.com/photo-1761074974307-c4e5c51a9156?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwc2hvZXN8ZW58MXx8fHwxNzc0MTM0MjA5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    location: "Seattle, WA",
    seller: "WalkTheCourse",
    listedDate: "2026-03-20",
    inventory: 4
  },
  {
    id: "6",
    name: "Pro V1 Golf Balls (Dozen)",
    price: 35,
    condition: "Good",
    category: "Balls",
    brand: "Titleist",
    description: "Mixed dozen of Titleist Pro V1 balls. All in playable condition with minimal scuffs. Great for practice.",
    image: "https://images.unsplash.com/photo-1689732902207-32a8ab8bc5e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwYmFsbHMlMjBib3h8ZW58MXx8fHwxNzc0MTM0MjEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    location: "Denver, CO",
    seller: "BallHunter",
    listedDate: "2026-03-17",
    inventory: 5
  },
  {
    id: "7",
    name: "Cleveland RTX ZipCore Wedge 56°",
    price: 89,
    condition: "Very Good",
    category: "Wedges",
    brand: "Cleveland",
    description: "Cleveland RTX ZipCore wedge, 56° sand wedge. Great spin and control. Minimal groove wear.",
    image: "https://images.unsplash.com/photo-1723084574869-12540112a721?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwd2VkZ2UlMjBjbHVifGVufDF8fHx8MTc3NDEzNDIxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    location: "Miami, FL",
    seller: "ShortGamePro",
    listedDate: "2026-03-16",
    inventory: 2
  },
  {
    id: "8",
    name: "Callaway Mavrik Hybrid 4H",
    price: 125,
    condition: "Excellent",
    category: "Hybrids",
    brand: "Callaway",
    description: "Callaway Mavrik 4 Hybrid, 22°. Super easy to hit and launch. Like new condition with headcover.",
    image: "https://images.unsplash.com/photo-1592459777315-00ab1374a953?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwaHlicmlkJTIwY2x1YnxlbnwxfHx8fDE3NzQxMzQyMTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    location: "Chicago, IL",
    seller: "HybridFan",
    listedDate: "2026-03-21",
    inventory: 1
  },
  {
    id: "9",
    name: "Ping G425 Driver",
    price: 299,
    condition: "Very Good",
    category: "Drivers",
    brand: "Ping",
    description: "Ping G425 Driver, 9° loft, stiff flex. Adjustable hosel. Great condition with minor paint chips on crown.",
    image: "https://images.unsplash.com/photo-1697448524524-99416ed5dbba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwZHJpdmVyJTIwY2x1YnxlbnwxfHx8fDE3NzQxMzQyMDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    location: "Dallas, TX",
    seller: "LongDrive123",
    listedDate: "2026-03-13",
    inventory: 1
  },
  {
    id: "10",
    name: "Odyssey White Hot Putter",
    price: 79,
    condition: "Good",
    category: "Putters",
    brand: "Odyssey",
    description: "Odyssey White Hot OG Rossie putter, 35 inch. Classic feel with great alignment. Normal wear.",
    image: "https://images.unsplash.com/photo-1722849899776-3c6abb5a46c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwcHV0dGVyfGVufDF8fHx8MTc3NDEzNDIwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    location: "Los Angeles, CA",
    seller: "PuttMaster",
    listedDate: "2026-03-12",
    inventory: 3
  },
  {
    id: "11",
    name: "Mizuno JPX923 Irons (5-GW)",
    price: 649,
    condition: "Excellent",
    category: "Irons",
    brand: "Mizuno",
    description: "Mizuno JPX923 Hot Metal irons. 5-GW (7 clubs). Graphite shafts, regular flex. Played less than 5 rounds.",
    image: "https://images.unsplash.com/photo-1761233976530-d09fc58ad175?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwaXJvbiUyMGNsdWJzfGVufDF8fHx8MTc3NDEzNDIwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    location: "Boston, MA",
    seller: "IronExpert",
    listedDate: "2026-03-11",
    inventory: 1
  },
  {
    id: "12",
    name: "Sun Mountain Stand Bag",
    price: 149,
    condition: "Excellent",
    category: "Bags",
    brand: "Sun Mountain",
    description: "Sun Mountain 4.5 LS stand bag. Lightweight with 4-way top. Perfect for walking rounds. Barely used.",
    image: "https://images.unsplash.com/photo-1693163532134-5ea6c80b58a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwYmFnJTIwZXF1aXBtZW50fGVufDF8fHx8MTc3NDEzNDIwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    location: "Portland, OR",
    seller: "WalkGolf",
    listedDate: "2026-03-10",
    inventory: 2
  }
];