if (process.env.NODE_ENV !== "production") {
  require('dotenv').config({ path: '../.env' });
}
const mongoose = require('mongoose');
const Listing = require('../Models/listing');

const dbUrl = process.env.ATLASDB_URL || 'mongodb://127.0.0.1:27017/airbnb';

// Map: listing title → correct matching Unsplash image URL
const imageUpdates = [
  // ── Original data.js listings ──
  {
    title: "Cozy Beachfront Cottage",
    url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Modern Loft in Downtown",
    url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Mountain Retreat",
    url: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Historic Villa in Tuscany",
    url: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Secluded Treehouse Getaway",
    url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Beachfront Paradise",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Rustic Cabin by the Lake",
    url: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Luxury Penthouse with City Views",
    url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Ski-In/Ski-Out Chalet",
    url: "https://images.unsplash.com/photo-1605540436563-5bca919ae766?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Safari Lodge in the Serengeti",
    url: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Historic Canal House",
    url: "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Private Island Retreat",
    url: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Charming Cottage in the Cotswolds",
    url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Historic Brownstone in Boston",
    url: "https://images.unsplash.com/photo-1519974719765-e6559eac2575?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Beachfront Bungalow in Bali",
    url: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Mountain View Cabin in Banff",
    url: "https://images.unsplash.com/photo-1482192505345-5852310ffd4c?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Art Deco Apartment in Miami",
    url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Tropical Villa in Phuket",
    url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Historic Castle in Scotland",
    url: "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Desert Oasis in Dubai",
    url: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Rustic Log Cabin in Montana",
    url: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Beachfront Villa in Greece",
    url: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Eco-Friendly Treehouse Retreat",
    url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Historic Cottage in Charleston",
    url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Modern Apartment in Tokyo",
    url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Lakefront Cabin in New Hampshire",
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Luxury Villa in the Maldives",
    url: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Ski Chalet in Aspen",
    url: "https://images.unsplash.com/photo-1548777123-e216912df7d8?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Secluded Beach House in Costa Rica",
    url: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80"
  },

  // ── Category-specific seed-additional.js listings ──
  {
    title: "Historic Highlands Castle Manor",
    url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Loire Valley Chateau Castle",
    url: "https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Neuschwanstein Bavarian Alpine Castle",
    url: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Infinity Pool Oasis Villa",
    url: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Oceanfront Pool Penthouse",
    url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Santorini Cliffside Cave Pool Suite",
    url: "https://images.unsplash.com/photo-1551882547-ff40c4a49f3b?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Yosemite Valley Glamping Tent",
    url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Nomadic Steppe Yurt Camping",
    url: "https://images.unsplash.com/photo-1537905569109-fc94c1d72150?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Rainforest Bell Tent Camping Escape",
    url: "https://images.unsplash.com/photo-1478131143081-d6f7e41be79a?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Tuscan Olive Grove Farm Cottage",
    url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Renovated Heritage Barn House Farm",
    url: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Kyoto Tea Field Farmhouse",
    url: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Glass Aurora Arctic Igloo",
    url: "https://images.unsplash.com/photo-1517783999520-f068d7431a60?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Snowy Fjord Arctic Cabin",
    url: "https://images.unsplash.com/photo-1458442310124-dde6edb43d10?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Ice Hotel Arctic Suite",
    url: "https://images.unsplash.com/photo-1519922639192-e73293ca430e?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Patagonian Glacial Star Dome",
    url: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Luxury Martian Desert Dome",
    url: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Eco Jungle Dome Stay",
    url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Amstel Classic Canal Houseboat",
    url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Luxury Monaco Yacht Boat Stay",
    url: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Backwater Luxury Houseboat Cruise",
    url: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Polished Victorian Guest Room",
    url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Minimalist Shinjuku Studio Room",
    url: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Charming Chelsea Loft Room",
    url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Spectacular Alpine Ridge Cabin",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Redwood Canopy Mountain A-Frame",
    url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Himalayan Ridge Eco Cabin",
    url: "https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Charming Canal Side Suite",
    url: "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Downtown Parisian balcony Studio",
    url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Colonial Quarter Heritage Stay",
    url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
  },
];

async function updateImages() {
  try {
    await mongoose.connect(dbUrl);
    console.log("Connected. Updating images...\n");

    let updated = 0;
    let notFound = 0;

    for (const item of imageUpdates) {
      const result = await Listing.updateOne(
        { title: item.title },
        { $set: { "image.url": item.url, "image.filename": "seedimage" } }
      );

      if (result.matchedCount > 0) {
        console.log(`✓  Updated: ${item.title}`);
        updated++;
      } else {
        console.log(`✗  Not found: ${item.title}`);
        notFound++;
      }
    }

    console.log(`\nDone. Updated: ${updated}, Not found: ${notFound}`);
    await mongoose.disconnect();
  } catch (err) {
    console.error("Error updating images:", err.message);
    process.exit(1);
  }
}

updateImages();
