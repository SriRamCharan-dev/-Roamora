if (process.env.NODE_ENV !== "production") {
  require('dotenv').config({ path: '../.env' });
}
const mongoose = require('mongoose');
const Listing = require('../Models/listing');
const User = require('../Models/user');

const dbUrl = process.env.ATLASDB_URL || 'mongodb://127.0.0.1:27017/airbnb';

const additionalListings = [
  // ── CASTLES ──
  {
    title: "Historic Highlands Castle Manor",
    description: "Live like royalty in this authentic 12th-century castle manor. Features soaring stone arches, spiral staircases, and a grand banquet hall overlooking the misty valley.",
    image: { url: "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=800&q=80", filename: "seedimage" },
    price: 6500,
    location: "Edinburgh, Scotland",
    country: "United Kingdom"
  },
  {
    title: "Loire Valley Chateau Castle",
    description: "A gorgeous French chateau nestled in private gardens. Experience classic Renaissance architecture, ornate chandeliers, and vineyard tours.",
    image: { url: "https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&w=800&q=80", filename: "seedimage" },
    price: 8200,
    location: "Loire Valley",
    country: "France"
  },
  {
    title: "Neuschwanstein Bavarian Alpine Castle",
    description: "Perched high in the Alps, this stunning castle features fairytale towers, cozy fireplaces, and breathtaking mountain panorama views.",
    image: { url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80", filename: "seedimage" },
    price: 7400,
    location: "Bavaria",
    country: "Germany"
  },

  // ── AMAZING POOLS ──
  {
    title: "Infinity Pool Oasis Villa",
    description: "Relax in luxury with a massive private infinity pool overlooking the lush tropical jungle. Features open-concept living and sun loungers.",
    image: { url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80", filename: "seedimage" },
    price: 3200,
    location: "Ubud, Bali",
    country: "Indonesia"
  },
  {
    title: "Oceanfront Pool Penthouse",
    description: "Sleek modern penthouse with a private pool deck hanging over the beach. Spectacular ocean views and premium sound system.",
    image: { url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80", filename: "seedimage" },
    price: 4900,
    location: "Miami Beach, Florida",
    country: "United States"
  },
  {
    title: "Santorini Cliffside Cave Pool Suite",
    description: "Carved into the volcanic rock, this suite features a heated indoor-outdoor cave pool with panoramic caldera and sunset views.",
    image: { url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80", filename: "seedimage" },
    price: 5500,
    location: "Oia, Santorini",
    country: "Greece"
  },

  // ── CAMPING ──
  {
    title: "Yosemite Valley Glamping Tent",
    description: "A luxury safari tent set up on a redwood deck deep in the forest. Fully furnished with a king bed, wood stove, and outdoor firepit.",
    image: { url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80", filename: "seedimage" },
    price: 950,
    location: "Yosemite National Park",
    country: "United States"
  },
  {
    title: "Nomadic Steppe Yurt Camping",
    description: "Experience authentic nomadic living in this traditional insulated yurt. Situated under star-filled skies on the open rolling hills.",
    image: { url: "https://images.unsplash.com/photo-1537905569109-fc94c1d72150?auto=format&fit=crop&w=800&q=80", filename: "seedimage" },
    price: 700,
    location: "Gorkhi-Terelj",
    country: "Mongolia"
  },
  {
    title: "Rainforest Bell Tent Camping Escape",
    description: "Fall asleep to the sound of rainfall in this large bohemian bell tent. Nestled in a lush coastal rainforest clearing.",
    image: { url: "https://images.unsplash.com/photo-1478131143081-d6f7e41be79a?auto=format&fit=crop&w=800&q=80", filename: "seedimage" },
    price: 600,
    location: "Byron Bay",
    country: "Australia"
  },

  // ── FARMS ──
  {
    title: "Tuscan Olive Grove Farm Cottage",
    description: "Charming stone cottage located on a working olive oil farm. Enjoy homemade wines, country cooking, and historic vineyard walks.",
    image: { url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80", filename: "seedimage" },
    price: 1300,
    location: "Siena, Tuscany",
    country: "Italy"
  },
  {
    title: "Renovated Heritage Barn House Farm",
    description: "A massive, beautifully converted 1800s timber barn. Features high open-beam ceilings, cozy reading lofts, and farm animals nearby.",
    image: { url: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80", filename: "seedimage" },
    price: 1800,
    location: "Stowe, Vermont",
    country: "United States"
  },
  {
    title: "Kyoto Tea Field Farmhouse",
    description: "Traditional tatami-mat farmhouse surrounded by rolling green tea terraces. Experience peaceful country living and tea harvesting.",
    image: { url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80", filename: "seedimage" },
    price: 1400,
    location: "Uji, Kyoto",
    country: "Japan"
  },

  // ── ARCTIC ──
  {
    title: "Glass Aurora Arctic Igloo",
    description: "Sleep under the stars and watch the Northern Lights dance directly from your cozy bed in this heated glass igloo.",
    image: { url: "https://images.unsplash.com/photo-1517783999520-f068d7431a60?auto=format&fit=crop&w=800&q=80", filename: "seedimage" },
    price: 4500,
    location: "Rovaniemi, Lapland",
    country: "Finland"
  },
  {
    title: "Snowy Fjord Arctic Cabin",
    description: "Cozy timber cabin located right on the edge of a frozen fjord. Includes a private wood-burning sauna and dog sledding access.",
    image: { url: "https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?auto=format&fit=crop&w=800&q=80", filename: "seedimage" },
    price: 2400,
    location: "Tromso",
    country: "Norway"
  },
  {
    title: "Ice Hotel Arctic Suite",
    description: "Stay in a room hand-carved entirely out of crystal clear glacier ice. Keeps a crisp -5 degrees, equipped with warm thermal sleeping bags.",
    image: { url: "https://images.unsplash.com/photo-1489493887462-402b72644d79?auto=format&fit=crop&w=800&q=80", filename: "seedimage" },
    price: 3800,
    location: "Jukkasjarvi",
    country: "Sweden"
  },

  // ── DOMES ──
  {
    title: "Patagonian Glacial Star Dome",
    description: "Geodesic eco-dome situated at the foot of massive glaciers. Unparalleled views of the night sky through the clear panoramic canopy.",
    image: { url: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80", filename: "seedimage" },
    price: 2600,
    location: "Torres del Paine",
    country: "Chile"
  },
  {
    title: "Luxury Martian Desert Dome",
    description: "High-tech luxury dome in the middle of red Martian-like desert sands. Equipped with private deck, AC, and stargazing telescopes.",
    image: { url: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80", filename: "seedimage" },
    price: 3100,
    location: "Wadi Rum",
    country: "Jordan"
  },
  {
    title: "Eco Jungle Dome Stay",
    description: "Sleep inside a stunning geometric bamboo dome high up in the tropical rainforest canopy. Experience monkeys and exotic birds outside your window.",
    image: { url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80", filename: "seedimage" },
    price: 1950,
    location: "Talamanca",
    country: "Costa Rica"
  },

  // ── BOATS ──
  {
    title: "Amstel Classic Canal Houseboat",
    description: "A charming, historic wooden houseboat floating on the famous Amsterdam canals. Cozy fireplace, vintage decor, and bikes included.",
    image: { url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80", filename: "seedimage" },
    price: 1550,
    location: "Amsterdam",
    country: "Netherlands"
  },
  {
    title: "Luxury Monaco Yacht Boat Stay",
    description: "Stay aboard a sleek 80-foot luxury yacht anchored in the harbor. Features custom sun decks, hot tub, and private chef service.",
    image: { url: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=800&q=80", filename: "seedimage" },
    price: 9800,
    location: "Monte Carlo Harbor",
    country: "Monaco"
  },
  {
    title: "Backwater Luxury Houseboat Cruise",
    description: "Glide through the calm, palm-fringed backwaters of Kerala on a traditional thatched-roof houseboat. Includes all gourmet local meals.",
    image: { url: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80", filename: "seedimage" },
    price: 2100,
    location: "Alleppey, Kerala",
    country: "India"
  },

  // ── ROOMS ──
  {
    title: "Polished Victorian Guest Room",
    description: "A beautifully appointed guest room in a historic brick townhouse. Features high ceilings, a grand fireplace, and elegant classic furniture.",
    image: { url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80", filename: "seedimage" },
    price: 650,
    location: "Kensington, London",
    country: "United Kingdom"
  },
  {
    title: "Minimalist Shinjuku Studio Room",
    description: "A compact, ultra-modern studio room in the heart of Tokyo. Perfect high-tech crashpad for solo travellers or quick city stopovers.",
    image: { url: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80", filename: "seedimage" },
    price: 800,
    location: "Shinjuku, Tokyo",
    country: "Japan"
  },
  {
    title: "Charming Chelsea Loft Room",
    description: "A bright and airy loft room featuring exposed brick walls, industrial metal windows, and a private staircase exit.",
    image: { url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80", filename: "seedimage" },
    price: 900,
    location: "Manhattan, New York",
    country: "United States"
  },

  // ── MOUNTAINS ──
  {
    title: "Spectacular Alpine Ridge Cabin",
    description: "A design-forward timber cabin built directly on a mountain ridge. Enjoy floor-to-ceiling glass views of snow-dusted spruce forests.",
    image: { url: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=800&q=80", filename: "seedimage" },
    price: 2200,
    location: "Zermatt",
    country: "Switzerland"
  },
  {
    title: "Redwood Canopy Mountain A-Frame",
    description: "Escape to this classic redwood A-frame cabin tucked deep in the Santa Cruz mountains. Unwind on the wrap-around forest deck.",
    image: { url: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80", filename: "seedimage" },
    price: 1650,
    location: "Santa Cruz, California",
    country: "United States"
  },
  {
    title: "Himalayan Ridge Eco Cabin",
    description: "Quiet timber cottage situated at 8,000 feet, offering unobstructed panoramic views of snow-capped Himalayan peaks.",
    image: { url: "https://images.unsplash.com/photo-1588880331149-a971af25f3c4?auto=format&fit=crop&w=800&q=80", filename: "seedimage" },
    price: 1100,
    location: "Manali, Himachal Pradesh",
    country: "India"
  },

  // ── ICONIC CITIES ──
  {
    title: "Charming Canal Side Suite",
    description: "Steps from the water, this historic suite puts you in the middle of Venice's winding canals and romantic bridges.",
    image: { url: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=800&q=80", filename: "seedimage" },
    price: 1950,
    location: "Venice",
    country: "Italy"
  },
  {
    title: "Downtown Parisian balcony Studio",
    description: "Sip espresso on your private wrought-iron balcony overlooking classic Parisian streets and the Eiffel Tower skyline.",
    image: { url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80", filename: "seedimage" },
    price: 2150,
    location: "Paris",
    country: "France"
  },
  {
    title: "Colonial Quarter Heritage Stay",
    description: "A high-ceilinged room inside a beautifully restored Portuguese villa, situated in the historic Fountainhas quarter.",
    image: { url: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=800&q=80", filename: "seedimage" },
    price: 1250,
    location: "Panaji, Goa",
    country: "India"
  }
];

async function seedAdditional() {
  try {
    await mongoose.connect(dbUrl);
    console.log("Connected to Database for additional seeding...");

    // Find any user to assign as owner
    const user = await User.findOne({});
    if (!user) {
      console.log("No user found. Run init/index.js first.");
      process.exit(0);
    }

    const listings = additionalListings.map(item => ({
      ...item,
      owner: user._id,
      geometry: { type: 'Point', coordinates: [77.2090, 28.6139] } // fallback Delhi coordinates, client-side resolves them dynamically
    }));

    await Listing.insertMany(listings);
    console.log(`Successfully added ${listings.length} listings for different categories!`);
    await mongoose.disconnect();
    console.log("Disconnected.");
  } catch (err) {
    console.error("Error seeding additional data:", err.message);
    process.exit(1);
  }
}

seedAdditional();
