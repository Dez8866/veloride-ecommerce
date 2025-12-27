import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const bikes = [
  {
    name: "Carbon Aero Pro X1",
    description: "Professional racing bike with aerodynamic carbon frame, Shimano Ultegra groupset, and lightweight design. Perfect for competitive cyclists seeking maximum performance.",
    price: 3499.99,
    category: "bike",
    imageUrl: "https://cdn.abacus.ai/images/3933eb42-3edc-4b29-926f-e1d9c2b5b68d.png",
    stock: 15,
    featured: true
  },
  {
    name: "Mountain Thunder Elite",
    description: "High-performance mountain bike with full suspension, 29-inch wheels, and hydraulic disc brakes. Built to conquer the toughest trails.",
    price: 2899.99,
    category: "bike",
    imageUrl: "https://cdn.abacus.ai/images/bbdfe8f9-f4d2-419d-ba06-6d6e37f93429.png",
    stock: 12,
    featured: true
  },
  {
    name: "City Cruiser Deluxe",
    description: "Elegant urban bike with comfort saddle, integrated lights, and smooth gear shifting. Ideal for daily commuting in style.",
    price: 1299.99,
    category: "bike",
    imageUrl: "https://cdn.abacus.ai/images/803684df-5cd3-4d48-8762-ba29f1af3537.png",
    stock: 20,
    featured: false
  },
  {
    name: "Electric PowerRide 3000",
    description: "Premium electric bike with 500W motor, 60-mile range, and smart display. Experience effortless cycling with cutting-edge technology.",
    price: 4299.99,
    category: "bike",
    imageUrl: "https://cdn.abacus.ai/images/1abe2c78-aad6-4a55-be37-8459ae2c855d.png",
    stock: 8,
    featured: true
  },
  {
    name: "Gravel Explorer GT",
    description: "Versatile gravel bike designed for adventure, featuring wide tire clearance and robust construction for mixed-terrain riding.",
    price: 2199.99,
    category: "bike",
    imageUrl: "https://cdn.abacus.ai/images/936ded7a-1dfc-428b-b17d-edff2bdf6c71.png",
    stock: 10,
    featured: false
  },
  {
    name: "Road Master Sprint",
    description: "Lightweight road bike with responsive handling and premium components. Perfect for long-distance rides and weekend adventures.",
    price: 1899.99,
    category: "bike",
    imageUrl: "https://cdn.abacus.ai/images/2cde8716-fe86-4c6d-a04f-8cca7396813f.png",
    stock: 18,
    featured: false
  },
  {
    name: "BMX Freestyle Pro",
    description: "Durable BMX bike built for tricks and stunts, featuring reinforced frame and precision bearings for smooth performance.",
    price: 899.99,
    category: "bike",
    imageUrl: "https://cdn.abacus.ai/images/cfaf5a20-7d2c-4c02-9b83-67e0ad3e03fb.png",
    stock: 25,
    featured: false
  },
  {
    name: "Touring Champion XT",
    description: "Long-distance touring bike with comfortable geometry, rack mounts, and reliable components for extended journeys.",
    price: 2599.99,
    category: "bike",
    imageUrl: "https://cdn.abacus.ai/images/b819e905-91dd-4a2c-84f5-a90b364e5a0f.png",
    stock: 7,
    featured: false
  },
  {
    name: "Hybrid Comfort Plus",
    description: "Comfortable hybrid bike combining road and mountain bike features. Ideal for casual riders and fitness enthusiasts.",
    price: 1499.99,
    category: "bike",
    imageUrl: "https://cdn.abacus.ai/images/a545d6ae-7a33-4ef2-9d92-1b952f86922e.png",
    stock: 22,
    featured: false
  },
  {
    name: "Track Velocity Carbon",
    description: "Fixed-gear track bike with aerodynamic carbon frame. Designed for velodrome racing and speed enthusiasts.",
    price: 3899.99,
    category: "bike",
    imageUrl: "https://cdn.abacus.ai/images/dacce426-3ca1-4ad4-ab2a-6194a6cacf11.png",
    stock: 5,
    featured: true
  },
  {
    name: "Enduro Beast 2.0",
    description: "Aggressive enduro mountain bike with long-travel suspension and robust build for downhill dominance.",
    price: 3299.99,
    category: "bike",
    imageUrl: "https://cdn.abacus.ai/images/0d741f6e-f1bd-4d3b-8423-206b51e4d7fc.png",
    stock: 9,
    featured: false
  },
  {
    name: "Kids Adventure 20",
    description: "Safe and fun bike for young riders, with training wheels option and colorful design to inspire confidence.",
    price: 399.99,
    category: "bike",
    imageUrl: "https://cdn.abacus.ai/images/0c1a73f3-0bef-4b3e-a768-18741e9dc898.png",
    stock: 30,
    featured: false
  },
  {
    name: "Folding Metro Compact",
    description: "Space-saving folding bike perfect for commuters with limited storage. Lightweight and easy to carry.",
    price: 799.99,
    category: "bike",
    imageUrl: "https://cdn.abacus.ai/images/a2f06a6b-d33f-4f10-91e9-baf7c307ffed.png",
    stock: 16,
    featured: false
  },
  {
    name: "Fat Tire Snow Beast",
    description: "Specialized fat bike with oversized tires for snow and sand riding. Conquer any terrain in all conditions.",
    price: 2399.99,
    category: "bike",
    imageUrl: "https://cdn.abacus.ai/images/bb27431a-90ce-43b3-a95a-c9960144e0b2.png",
    stock: 11,
    featured: false
  },
  {
    name: "Time Trial Aero Machine",
    description: "Ultimate time trial bike with cutting-edge aerodynamics and integrated components for maximum speed.",
    price: 5299.99,
    category: "bike",
    imageUrl: "https://cdn.abacus.ai/images/611b1acd-1e9f-4b28-b246-4f7e094df774.png",
    stock: 4,
    featured: true
  }
];

const carToys = [
  {
    name: "Ferrari F40 Scale Model",
    description: "1:18 scale die-cast replica of the iconic Ferrari F40. Detailed interior, opening doors, and authentic paint finish.",
    price: 149.99,
    category: "car-toy",
    imageUrl: "https://cdn.abacus.ai/images/8983d328-0303-44e8-af6e-6a39eaf98696.png",
    stock: 35,
    featured: true
  },
  {
    name: "Lamborghini Aventador RC",
    description: "Remote-controlled Lamborghini with realistic sound effects and LED lights. Reaches speeds up to 15 mph.",
    price: 199.99,
    category: "car-toy",
    imageUrl: "https://cdn.abacus.ai/images/b1096c6d-f2de-4f30-8b0a-dd0a42ae2222.png",
    stock: 28,
    featured: true
  },
  {
    name: "Porsche 911 GT3 Collector's Edition",
    description: "Limited edition 1:12 scale Porsche 911 GT3 with premium packaging. Perfect for serious collectors.",
    price: 299.99,
    category: "car-toy",
    imageUrl: "https://cdn.abacus.ai/images/7d3bb9bc-7267-46c4-8201-115713e7f344.png",
    stock: 12,
    featured: true
  },
  {
    name: "Tesla Model S Electric Toy",
    description: "Battery-powered Tesla Model S toy car with working headlights and realistic acceleration sounds.",
    price: 89.99,
    category: "car-toy",
    imageUrl: "https://cdn.abacus.ai/images/76bf68ba-c40b-43ae-9fdc-dd6e672f9ea9.png",
    stock: 40,
    featured: false
  },
  {
    name: "Mercedes AMG GT Drift Car",
    description: "RC drift car with adjustable suspension and drift tires. Perfect for motorsport enthusiasts.",
    price: 179.99,
    category: "car-toy",
    imageUrl: "https://cdn.abacus.ai/images/d89560d2-3526-449b-8882-78f0b32bdb13.png",
    stock: 22,
    featured: false
  },
  {
    name: "Bugatti Chiron Masterpiece",
    description: "Hand-assembled 1:8 scale Bugatti Chiron with over 3,000 pieces. A true work of automotive art.",
    price: 899.99,
    category: "car-toy",
    imageUrl: "https://cdn.abacus.ai/images/6a92e9e3-7da7-490d-90f5-1cc66ec79aed.png",
    stock: 5,
    featured: true
  },
  {
    name: "Audi R8 V10 Plus Model",
    description: "Detailed 1:24 scale Audi R8 with functioning steering and suspension. Opening doors reveal intricate interior.",
    price: 79.99,
    category: "car-toy",
    imageUrl: "https://cdn.abacus.ai/images/38648bd8-ef83-4f01-95bd-383807e49a8e.png",
    stock: 45,
    featured: false
  },
  {
    name: "McLaren P1 Hypercar Set",
    description: "Premium McLaren P1 model with carbon fiber detailing and display case. Limited production run.",
    price: 449.99,
    category: "car-toy",
    imageUrl: "https://cdn.abacus.ai/images/1a08a852-db58-4eda-9ef9-0d90414fce4a.png",
    stock: 8,
    featured: true
  },
  {
    name: "Corvette C8 Stingray RC",
    description: "High-speed RC Corvette with precision steering and rechargeable battery. Ready to race out of the box.",
    price: 129.99,
    category: "car-toy",
    imageUrl: "https://cdn.abacus.ai/images/cfccae92-2612-44a3-b1a9-2ea45f995a4f.png",
    stock: 32,
    featured: false
  },
  {
    name: "Range Rover Sport SUV",
    description: "Luxury SUV toy with working lights, sounds, and opening trunk. Perfect for young adventurers.",
    price: 119.99,
    category: "car-toy",
    imageUrl: "https://cdn.abacus.ai/images/4d59d653-d3ca-41bd-8e01-443b53ad46e6.png",
    stock: 38,
    featured: false
  },
  {
    name: "Jeep Wrangler Off-Road RC",
    description: "All-terrain RC Jeep with independent suspension and waterproof design. Conquer mud, rocks, and water.",
    price: 159.99,
    category: "car-toy",
    imageUrl: "https://cdn.abacus.ai/images/0301616e-8465-4fdd-881d-b9459879d219.png",
    stock: 26,
    featured: false
  },
  {
    name: "Ford Mustang GT Classic",
    description: "Vintage 1967 Ford Mustang GT model with authentic details and period-correct wheels and badges.",
    price: 94.99,
    category: "car-toy",
    imageUrl: "https://cdn.abacus.ai/images/2c36e33e-ea50-4369-bcf9-4ddbda61ce40.png",
    stock: 42,
    featured: false
  },
  {
    name: "BMW M4 Competition Track Set",
    description: "BMW M4 with miniature track and accessories. Includes cones, barriers, and timing gate for racing fun.",
    price: 189.99,
    category: "car-toy",
    imageUrl: "https://cdn.abacus.ai/images/621dc71c-6706-473a-bc9f-07acafd448da.png",
    stock: 19,
    featured: false
  },
  {
    name: "Nissan GT-R Nismo Edition",
    description: "High-performance GT-R model with aerodynamic body kit and signature Nismo red accents.",
    price: 139.99,
    category: "car-toy",
    imageUrl: "https://cdn.abacus.ai/images/f7b9d1d4-117a-4bb7-b9d2-aa33ec9eb226.png",
    stock: 30,
    featured: false
  },
  {
    name: "Aston Martin DB11 Luxury Model",
    description: "Elegant Aston Martin DB11 with leather-look interior and working headlights. British luxury at its finest.",
    price: 249.99,
    category: "car-toy",
    imageUrl: "https://cdn.abacus.ai/images/14f45f79-f061-4d28-89a9-6cf676df5b95.png",
    stock: 14,
    featured: true
  },
  {
    name: "Dodge Challenger Hellcat",
    description: "Muscle car toy with detailed engine bay and authentic Hellcat badging. American power in miniature form.",
    price: 99.99,
    category: "car-toy",
    imageUrl: "https://cdn.abacus.ai/images/983f9ae9-d7e0-4a3d-9ea4-1b5db1b4d8f3.png",
    stock: 36,
    featured: false
  },
  {
    name: "Lotus Evora GT4 Racer",
    description: "Track-focused Lotus Evora GT4 with race livery and sponsored decals. Lightweight performance replica.",
    price: 169.99,
    category: "car-toy",
    imageUrl: "https://cdn.abacus.ai/images/6dc357fa-9f30-46a1-a59d-8abd7bde4307.png",
    stock: 17,
    featured: false
  },
  {
    name: "Maserati Ghibli Premium",
    description: "Italian luxury sedan model with chrome details and leather-textured seats. Sophistication in scale.",
    price: 124.99,
    category: "car-toy",
    imageUrl: "https://cdn.abacus.ai/images/996d7cbf-94a4-4bdd-9e66-1e0970f88b67.png",
    stock: 21,
    featured: false
  },
  {
    name: "Alfa Romeo 4C Spider",
    description: "Convertible sports car model with removable roof and Italian racing heritage. Pure driving pleasure.",
    price: 109.99,
    category: "car-toy",
    imageUrl: "https://cdn.abacus.ai/images/5b96806d-1637-496d-bb76-66a963fe0075.png",
    stock: 27,
    featured: false
  },
  {
    name: "Pagani Huayra Ultimate Collection",
    description: "Museum-quality Pagani Huayra with functioning active aerodynamics and luxurious display stand.",
    price: 799.99,
    category: "car-toy",
    imageUrl: "https://cdn.abacus.ai/images/bc009804-b747-4ac7-bb9c-93eacfc8422d.png",
    stock: 3,
    featured: true
  }
];

async function main() {
  console.log('Starting seed...');

  // Create admin user (test account)
  const hashedPassword = await bcrypt.hash('johndoe123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      name: 'John Doe',
      password: hashedPassword,
      role: 'admin',
    },
  });
  console.log('Created admin user:', admin.email);

  // Seed bikes
  for (const bike of bikes) {
    await prisma.product.upsert({
      where: { id: `bike-${bikes.indexOf(bike)}` },
      update: {},
      create: {
        ...bike,
        id: `bike-${bikes.indexOf(bike)}`,
      },
    });
  }
  console.log('Seeded bikes');

  // Seed car toys
  for (const car of carToys) {
    await prisma.product.upsert({
      where: { id: `car-${carToys.indexOf(car)}` },
      update: {},
      create: {
        ...car,
        id: `car-${carToys.indexOf(car)}`,
      },
    });
  }
  console.log('Seeded car toys');

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
