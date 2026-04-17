require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
const DailyRate = require('../models/DailyRate');
const ServicePartner = require('../models/ServicePartner');
const User = require('../models/User');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB Connected for seeding');
};

// ---- VENDORS ----
const vendors = [
  { name: 'Gujarat Glass Works', city: 'Ahmedabad', state: 'Gujarat', rating: 4.7, totalReviews: 312, deliveryDays: 7, specializations: ['Clear Float', 'Toughened', 'Laminated'], certifications: ['ISO 9001', 'BIS Certified'], establishedYear: 1998, isVerified: true, phone: '+91-79-2222-3333', email: 'sales@gujaratglass.com' },
  { name: 'Mumbai Glass Factory', city: 'Mumbai', state: 'Maharashtra', rating: 4.5, totalReviews: 278, deliveryDays: 5, specializations: ['Reflective', 'Low-E', 'IGU'], certifications: ['ISO 9001'], establishedYear: 2003, isVerified: true, phone: '+91-22-4444-5555', email: 'info@mumbaiglassfactory.com' },
  { name: 'Delhi Glass House', city: 'Delhi', state: 'Delhi', rating: 4.3, totalReviews: 195, deliveryDays: 6, specializations: ['Mirror', 'Frosted', 'Back-Painted'], certifications: ['BIS Certified'], establishedYear: 2001, isVerified: true, phone: '+91-11-6666-7777', email: 'orders@delhiglasshouse.com' },
  { name: 'Hyderabad Glazing Solutions', city: 'Hyderabad', state: 'Telangana', rating: 4.6, totalReviews: 156, deliveryDays: 8, specializations: ['Toughened', 'Structural Glazing', 'Facades'], certifications: ['ISO 9001', 'IGBC Preferred'], establishedYear: 2007, isVerified: true, phone: '+91-40-8888-9999', email: 'hgs@glazing.in' },
  { name: 'Chennai Smart Glass', city: 'Chennai', state: 'Tamil Nadu', rating: 4.4, totalReviews: 134, deliveryDays: 9, specializations: ['Switchable', 'Acoustic', 'Ceramic Printed'], certifications: ['ISO 9001'], establishedYear: 2012, isVerified: false, phone: '+91-44-1111-2222', email: 'sales@chennaismartglass.com' },
];

// ---- PRODUCTS (Glass) ----
const glassProducts = [
  { name: 'Premium Clear Float Glass', glassType: 'Clear Float', category: 'glass', thickness: [4, 5, 6, 8, 10, 12], process: ['Standard', 'Polished Edges', 'Beveled'], application: ['Window', 'Interior', 'Furniture', 'General'], minSize: '300×300 mm', maxSize: '3300×2400 mm', description: 'High-quality flat clear glass manufactured by the float process. Perfectly flat, optically clear, suitable for all standard glazing applications.', tags: ['clear', 'float', 'standard', 'basic', 'window'], isFeatured: true, image: 'https://images.unsplash.com/photo-1541893976356-91edae1dbfce?w=800&q=80' },
  { name: 'Toughened Safety Glass', glassType: 'Toughened/Tempered', category: 'glass', thickness: [6, 8, 10, 12, 15], process: ['Tempered', 'Heat Soaked', 'Ceramic Frit'], application: ['Shower', 'Railing', 'Door', 'Partition', 'Facade'], minSize: '300×300 mm', maxSize: '2600×5000 mm', description: 'Thermally toughened safety glass — 4x stronger than annealed glass. Breaks into small harmless granules. Mandatory for shower enclosures, doors, and balcony railings.', tags: ['tempered', 'toughened', 'safety', 'shower', 'railing', 'balcony'], isFeatured: true, specs: { safetyRating: 'Safety Glass (IS:2553)', certifications: ['BIS IS:2553', 'CE Marked'] }, image: 'https://images.unsplash.com/photo-1582236511116-f3cc61ce6ea2?w=800&q=80' },
  { name: 'Laminated Safety Glass (PVB)', glassType: 'Laminated', category: 'glass', thickness: [6.38, 8.38, 10.38, 12.38], process: ['PVB Laminated', 'EVA Laminated', 'SGP Laminated'], application: ['Skylight', 'Overhead', 'Partition', 'Facade', 'Railing'], minSize: '300×600 mm', maxSize: '3300×6000 mm', description: 'Two or more glass panes bonded with PVB interlayer. Stays intact when broken — ideal for overhead glazing, skylights, and where safety is paramount.', tags: ['laminated', 'safety', 'skylight', 'pvb', 'overhead'], isFeatured: true, specs: { soundReduction: '33-38 dB', safetyRating: 'Safety Glass Class B (IS:2553 Part 2)' }, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80' },
  { name: 'Insulated Glass Unit (DGU)', glassType: 'Insulated (IGU/DGU)', category: 'glass', thickness: [24, 28], process: ['Double Glazed', 'Argon Filled', 'Warm Edge Spacer'], application: ['Window', 'Facade', 'Door', 'Commercial'], minSize: '400×600 mm', maxSize: '3000×4000 mm', description: 'Double glazed unit (6+12+6mm) with argon-filled cavity. Excellent thermal and acoustic performance. Essential for energy-efficient buildings and green ratings.', tags: ['IGU', 'DGU', 'double glazed', 'thermal', 'energy efficient', 'window'], isFeatured: true, specs: { uValue: '1.1 W/m²K', soundReduction: '30-35 dB' }, image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80' },
  { name: 'Bronze Tinted Float Glass', glassType: 'Tinted', category: 'glass', thickness: [5, 6, 8], process: ['Tinted in Mass', 'Polished Edges'], application: ['Facade', 'Window', 'Commercial', 'Interior'], minSize: '300×300 mm', maxSize: '3300×2400 mm', description: 'Bronze body-tinted glass that reduces solar glare and heat. Popular in commercial buildings and residential windows. Available in Bronze, Green, and Blue tints.', tags: ['tinted', 'bronze', 'solar control', 'commercial', 'glare'], isFeatured: false, image: 'https://images.unsplash.com/photo-1621291884485-bd0c090daeb8?w=800&q=80' },
  { name: 'Solar Reflective Glass (Silver)', glassType: 'Reflective', category: 'glass', thickness: [5, 6, 8], process: ['Online Coated', 'Offline Coated'], application: ['Facade', 'Commercial', 'Mall', 'Office Building'], minSize: '600×900 mm', maxSize: '3300×2440 mm', description: 'Hard or soft coated reflective glass that reflects solar radiation. Gives the mirror-like exterior finish seen in commercial towers. Reduces HVAC load by 20-30%.', tags: ['reflective', 'solar control', 'facade', 'commercial', 'mirror exterior'], isFeatured: true, image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80' },
  { name: 'Acid Etched Frosted Glass', glassType: 'Frosted/Etched', category: 'glass', thickness: [4, 5, 6, 8], process: ['Acid Etched', 'Sandblasted', 'One Side Frosted'], application: ['Bathroom', 'Office', 'Interior', 'Furniture', 'Door'], minSize: '300×300 mm', maxSize: '3300×2400 mm', description: 'Uniformly frosted on one or both sides via acid etching. Provides privacy while diffusing beautiful natural light. Scratch-resistant matte surface.', tags: ['frosted', 'etched', 'privacy', 'bathroom', 'interior', 'matte'], isFeatured: false, image: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=800&q=80' },
  { name: 'Copper-Free Safety Mirror', glassType: 'Mirror', category: 'glass', thickness: [4, 5, 6], process: ['Silver Coated', 'Copper-Free', 'Safety Backed'], application: ['Bathroom', 'Bedroom', 'Gym', 'Salon', 'Commercial'], minSize: '300×300 mm', maxSize: '2500×3800 mm', description: 'Premium copper-free mirror with anti-corrosion protection. Safety backing prevents shattering. Suitable for humid environments like bathrooms.', tags: ['mirror', 'bathroom', 'copper free', 'safety', 'reflection'], isFeatured: false, image: 'https://images.unsplash.com/photo-1582736166723-6447814b2d35?w=800&q=80' },
  { name: 'Low-E Coated Glass (South Asia)', glassType: 'Low-E', category: 'glass', thickness: [5, 6, 8], process: ['MSVD Coated', 'TSVD Coated', 'Double Silver'], application: ['Facade', 'Window', 'IGU', 'Skylight'], minSize: '600×900 mm', maxSize: '3300×2440 mm', description: 'Low emissivity coated glass that allows visible light while blocking infrared heat. SHGC as low as 0.19. Essential for IGBC / LEED Green Building compliance.', tags: ['low-e', 'energy efficient', 'green building', 'IGBC', 'LEED', 'solar control'], isFeatured: true, specs: { uValue: '1.8 W/m²K', shgc: '0.19-0.28', vlt: '60-72%' }, image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80' },
  { name: 'Acoustic Laminated Glass', glassType: 'Acoustic', category: 'glass', thickness: [10.38, 12.38, 15.38], process: ['Acoustic PVB', 'Laminated', 'Asymmetric Glazing'], application: ['Office', 'Hospital', 'Studio', 'Hotel', 'Partition'], minSize: '600×900 mm', maxSize: '3300×6000 mm', description: 'Specially formulated acoustic PVB interlayer provides superior sound insulation. Achieves 38-44 dB Rw. Ideal for boardrooms, hospitals, and home theatres.', tags: ['acoustic', 'soundproof', 'office', 'noise reduction', 'studio', 'hospital'], isFeatured: false, specs: { soundReduction: '38-44 dB Rw' }, image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80' },
  { name: 'Back-Painted Glass (Lacobel Style)', glassType: 'Back-Painted/Lacquered', category: 'glass', thickness: [4, 5, 6], process: ['UV Painted', 'Lacquered', 'Toughened After Painting'], application: ['Kitchen', 'Wardrobe', 'Interior', 'Wall Cladding', 'Furniture'], minSize: '300×600 mm', maxSize: '3200×2600 mm', description: 'Vibrantly colored back-painted glass for interior applications. Available in 50+ RAL colors. Scratch-resistant lacquer on reverse side. Popular for kitchen splashbacks and wardrobe shutters.', tags: ['back painted', 'colored glass', 'kitchen splashback', 'interior', 'lacobel', 'colorful'], isFeatured: true, image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80' },
  { name: 'Ceramic Screen Printed Glass', glassType: 'Ceramic Printed', category: 'glass', thickness: [6, 8, 10], process: ['Screen Printed', 'Ceramic Frit', 'Toughened After'], application: ['Facade', 'Spandrel', 'Decorative', 'Commercial'], minSize: '600×900 mm', maxSize: '2400×4000 mm', description: 'Permanent ceramic ink baked into the glass during tempering. Used for spandrel panels, sun shading patterns on facades, and custom decorative projects.', tags: ['ceramic print', 'screen print', 'facade', 'spandrel', 'decorative', 'frit'], isFeatured: false, image: 'https://images.unsplash.com/photo-1541813636734-754687d65691?w=800&q=80' },
  { name: 'PDLC Switchable Smart Glass', glassType: 'Switchable/Smart', category: 'glass', thickness: [8, 10, 12], process: ['PDLC Film', 'Laminated', 'Electrically Dimmable'], application: ['Office', 'Conference Room', 'Hotel', 'Hospital', 'Partition'], minSize: '600×900 mm', maxSize: '2000×4000 mm', description: 'Polymer Dispersed Liquid Crystal (PDLC) glass switches from frosted to clear with a switch. Instant privacy on demand. Eliminates need for blinds. 220V AC powered.', tags: ['smart glass', 'switchable', 'PDLC', 'privacy', 'electric', 'smart office'], isFeatured: true, specs: { safetyRating: 'Laminated Safety Glass' }, image: 'https://images.unsplash.com/photo-1518112111874-9febb3ca5078?w=800&q=80' },
  { name: 'Bulletproof Security Glass', glassType: 'Bulletproof', category: 'glass', thickness: [22, 25, 32, 40], process: ['Multi-layer Laminated', 'Polycarbonate Core', 'Class BR2-BR6'], application: ['Bank', 'ATM', 'Government', 'Luxury Residential', 'Embassy'], minSize: '300×300 mm', maxSize: '2400×3600 mm', description: 'Ballistic-resistant glass combining multiple glass and polycarbonate layers. Available in protection levels BR2-BR6. Used in banks, ATMs, embassies, and VIP vehicles.', tags: ['bulletproof', 'ballistic', 'security', 'bank', 'government', 'safe'], isFeatured: false, image: 'https://images.unsplash.com/photo-1506842792842-88ec0c5ac045?w=800&q=80' },
  { name: 'Bent / Curved Tempered Glass', glassType: 'Bent/Curved', category: 'glass', thickness: [6, 8, 10, 12], process: ['Heat Bent', 'Cold Bent', 'Curved Toughened'], application: ['Facade', 'Railing', 'Furniture', 'Display', 'Architectural'], minSize: '400×600 mm', maxSize: '2400×4000 mm', description: 'Custom bent or curved glass for architectural applications. Manufactured by heating flat glass to softening point and bending over a mold. Each piece is custom made.', tags: ['bent', 'curved', 'architectural', 'custom', 'radius', 'facade'], isFeatured: false, image: 'https://images.unsplash.com/photo-1551817926-cdbdda1b72e5?w=800&q=80' },
  { name: 'Blue Reflective Coated Glass', glassType: 'Reflective', category: 'glass', thickness: [6, 8], process: ['Online Coated', 'High Reflectivity'], application: ['Commercial Facade', 'IT Park', 'Airport', 'Mall'], minSize: '600×900 mm', maxSize: '3300×2440 mm', description: 'Cool blue reflective coating on float glass. Offers 25% solar reflection and striking blue appearance for commercial facades. Popular in IT parks and business districts.', tags: ['reflective', 'blue', 'solar control', 'IT park', 'commercial'], isFeatured: false, image: 'https://images.unsplash.com/photo-1428366890462-dd4baecf492b?w=800&q=80' },
];

// ---- ALLIED PRODUCTS ----
const alliedProducts = [
  { name: 'Frameless Shower Hardware Kit', glassType: 'Allied Product', category: 'allied', alliedCategory: 'Hardware', description: 'Complete hardware set for frameless shower glass: SS304 hinges, wall brackets, handle, towel bar. For 8-12mm glass.', tags: ['shower', 'hardware', 'frameless', 'hinges', 'bathroom'], isFeatured: true, image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80' },
  { name: 'Structural Silicone Sealant', glassType: 'Allied Product', category: 'allied', alliedCategory: 'Sealants', description: 'Neutral cure, high-modulus structural silicone. UV resistant. For bonding glass to aluminium frames in structural glazing systems.', tags: ['silicone', 'sealant', 'structural', 'bonding', 'weatherproofing'], isFeatured: true, image: 'https://images.unsplash.com/photo-1581093196277-9f60897351c4?w=800&q=80' },
  { name: 'Spider Fitting Set (4-point)', glassType: 'Allied Product', category: 'allied', alliedCategory: 'Hardware', description: 'SS316 spider fittings for structural glass facades. 4-point or 2-point. Supports glass panels up to 19mm. Marine grade stainless.', tags: ['spider fitting', 'structural glazing', 'facade', 'point fixed', 'SS316'], isFeatured: false, image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&q=80' },
  { name: 'Glass U-Channel (Aluminium)', glassType: 'Allied Product', category: 'allied', alliedCategory: 'Hardware', description: 'Anodized aluminium U-channel for glass railing base. Available in silver, gold, and black. Fits 10-12mm tempered glass.', tags: ['u-channel', 'railing', 'aluminium', 'base', 'channel'], isFeatured: false, image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80' },
  { name: 'Patch Fitting Hinge Set', glassType: 'Allied Product', category: 'allied', alliedCategory: 'Hardware', description: 'Floor spring + top pivot patch fitting set for frameless toughened glass doors. Supports doors up to 100kg. SS304 finish.', tags: ['patch fitting', 'glass door', 'floor spring', 'frameless', 'hinge'], isFeatured: true, image: 'https://images.unsplash.com/photo-1588691512402-45eac63889bc?w=800&q=80' },
  { name: 'Weather Silicone (Neutral Cure)', glassType: 'Allied Product', category: 'allied', alliedCategory: 'Sealants', description: 'Neutral cure weather sealant for perimeter joints around glass in windows and facades. Paintable. Available in white, grey, black.', tags: ['weather sealant', 'perimeter', 'window', 'neutral cure', 'weatherproofing'], isFeatured: false, image: 'https://images.unsplash.com/photo-1580983546571-0ae9c0a6b7cb?w=800&q=80' },
  { name: 'UPVC Window Profile (5-Chamber)', glassType: 'Allied Product', category: 'allied', alliedCategory: 'Frames', description: '5-chamber UPVC profile for sliding and casement windows. UV resistant, thermal break. Accepts 24-28mm IGU. RAL 9016 white.', tags: ['UPVC', 'window', 'profile', 'frame', '5 chamber', 'thermal break'], isFeatured: true, image: 'https://images.unsplash.com/photo-1534104278455-8d83dbbd9465?w=800&q=80' },
  { name: 'Aluminium Slim Frame System', glassType: 'Allied Product', category: 'allied', alliedCategory: 'Frames', description: 'Powder-coated aluminium slim profiles for glass partitions. 45mm face width. For 10-15mm glass. Ceiling track + floor channel system.', tags: ['aluminium', 'slim frame', 'partition', 'office', 'profile'], isFeatured: false, image: 'https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?w=800&q=80' },
  { name: 'Glass Suction Cup (Vacuum)', glassType: 'Allied Product', category: 'allied', alliedCategory: 'Tools', description: 'Heavy-duty vacuum suction cups for moving and lifting glass panels. Single cup: 150kg capacity. Safety release valve. Essential for installation.', tags: ['suction cup', 'glass lifting', 'installation tool', 'vacuum', 'moving glass'], isFeatured: false, image: 'https://images.unsplash.com/photo-1542171458-7ae3dbb60c41?w=800&q=80' },
  { name: 'PDLC Controller & Power Supply', glassType: 'Allied Product', category: 'allied', alliedCategory: 'Smart Systems', description: 'Dimmer controller and transformer for PDLC switchable glass. Input 220V AC, output 65V AC. Remote + wall switch compatible.', tags: ['PDLC controller', 'smart glass', 'switchable', 'power supply', 'transformer'], isFeatured: false, image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80' },
  { name: 'ACP Cladding Panel (3mm)', glassType: 'Allied Product', category: 'allied', alliedCategory: 'Cladding', description: 'Aluminium Composite Panel, 3mm, PVDF coating, used alongside glass facades for cladding and infill panels. FR grade available.', tags: ['ACP', 'cladding', 'aluminium composite', 'facade', 'infill panel'], isFeatured: false, image: 'https://images.unsplash.com/photo-1505322022379-7c3353ee6291?w=800&q=80' },
  { name: 'Glass Edge Polish Kit', glassType: 'Allied Product', category: 'allied', alliedCategory: 'Tools', description: 'Diamond polishing wheels + cerium oxide compound for on-site glass edge finishing. For tempered and annealed glass up to 19mm.', tags: ['edge polish', 'diamond wheel', 'glass finishing', 'tool', 'cerium oxide'], isFeatured: false, image: 'https://images.unsplash.com/photo-1508215885820-4585e56135c8?w=800&q=80' },
];

// ---- DAILY RATES (10 glass types, 7 days history) ----
const generateRates = () => {
  const baseRates = [
    { glassType: 'Clear Float', base: 55, thickness: '6mm' },
    { glassType: 'Toughened/Tempered', base: 110, thickness: '8mm' },
    { glassType: 'Laminated', base: 145, thickness: '8.38mm' },
    { glassType: 'Insulated (IGU/DGU)', base: 310, thickness: '6+12+6mm' },
    { glassType: 'Reflective', base: 125, thickness: '6mm' },
    { glassType: 'Frosted/Etched', base: 90, thickness: '6mm' },
    { glassType: 'Mirror', base: 70, thickness: '5mm' },
    { glassType: 'Low-E', base: 220, thickness: '6mm' },
    { glassType: 'Acoustic', base: 185, thickness: '10.38mm' },
    { glassType: 'Back-Painted/Lacquered', base: 105, thickness: '6mm' },
  ];

  const rates = [];
  for (let day = 6; day >= 0; day--) {
    const date = new Date();
    date.setDate(date.getDate() - day);
    date.setHours(9, 0, 0, 0);

    baseRates.forEach(r => {
      const fluctuation = (Math.random() - 0.5) * 0.06; // ±3% daily change
      const price = Math.round(r.base * (1 + fluctuation));
      const changePercent = parseFloat((fluctuation * 100).toFixed(2));
      rates.push({ glassType: r.glassType, pricePerSqFt: price, changePercent, date, thickness: r.thickness });
    });
  }
  return rates;
};

// ---- SERVICE PARTNERS ----
const servicePartners = [
  { name: 'Rajesh Glass Installations', specialization: 'Installation', city: 'Mumbai', state: 'Maharashtra', phone: '+91-98201-11111', rating: 4.8, totalReviews: 156, experience: 15, bio: '15 years experience in structural glazing, shower enclosures, and glass railings. ISO certified installation team.', priceRange: '₹80-150/sqft', isVerified: true, certifications: ['ISO 9001', 'GGFI Certified'] },
  { name: 'Priya Measurement Services', specialization: 'Measurement', city: 'Mumbai', state: 'Maharashtra', phone: '+91-98202-22222', rating: 4.6, totalReviews: 89, experience: 8, bio: 'Precision site measurement using laser measurement tools. Specializes in complex curved and floor-to-ceiling installations.', priceRange: '₹2,500/visit', isVerified: true },
  { name: 'Amit Sharma Glazing Works', specialization: 'Installation', city: 'Delhi', state: 'Delhi', phone: '+91-98103-33333', rating: 4.5, totalReviews: 204, experience: 12, bio: 'Full-service glass installation — windows, facades, partitions, and shower enclosures. Delhi NCR coverage.', priceRange: '₹60-120/sqft', isVerified: true },
  { name: 'Chennai Structural Glazing Co', specialization: 'Structural Glazing', city: 'Chennai', state: 'Tamil Nadu', phone: '+91-98404-44444', rating: 4.7, totalReviews: 67, experience: 10, bio: 'Specialists in structural silicone glazing, spider fittings, and curtain wall installation for commercial projects.', priceRange: '₹150-280/sqft', isVerified: true, certifications: ['Dow Corning Certified'] },
  { name: 'Vikram AMC Services', specialization: 'AMC', city: 'Bangalore', state: 'Karnataka', phone: '+91-98505-55555', rating: 4.3, totalReviews: 43, experience: 7, bio: 'Annual maintenance contracts for glass facades, skylights, and structural glazing. Re-siliconing, cleaning, inspection.', priceRange: '₹15-25/sqft/year', isVerified: false },
  { name: 'Hyderabad Glass Fabricators', specialization: 'Fabrication', city: 'Hyderabad', state: 'Telangana', phone: '+91-98606-66666', rating: 4.9, totalReviews: 112, experience: 18, bio: 'In-house fabrication: CNC cutting, edge grinding, drilling, tempered + laminated processing. 2-3 day turnaround.', priceRange: '₹25-60/sqft processing', isVerified: true, certifications: ['BIS 2553'] },
  { name: 'Pooja Site Measurement & Survey', specialization: 'Site Survey', city: 'Ahmedabad', state: 'Gujarat', phone: '+91-98707-77777', rating: 4.4, totalReviews: 58, experience: 6, bio: 'Detailed site survey, AutoCAD drawings, and shop drawings for glass projects. Architect-coordinated measurement service.', priceRange: '₹3,500-8,000/project', isVerified: false },
  { name: 'Kapil Shower & Mirror Installations', specialization: 'Installation', city: 'Pune', state: 'Maharashtra', phone: '+91-98808-88888', rating: 4.6, totalReviews: 178, experience: 9, bio: 'Premium shower enclosure and mirror installation specialist. Works with all major glass brands. Warranty on workmanship.', priceRange: '₹5,000-15,000/installation', isVerified: true },
];

// ---- USERS ----
const seedUsers = [
  { name: 'Arjun Mehta', email: 'homeowner@demo.com', password: 'demo1234', role: 'homeowner', city: 'Mumbai', phone: '+91-98200-00001' },
  { name: 'Priya Sharma', email: 'architect@demo.com', password: 'demo1234', role: 'architect', company: 'Sharma & Associates', city: 'Delhi', phone: '+91-98100-00002' },
  { name: 'Ravi Builder', email: 'builder@demo.com', password: 'demo1234', role: 'builder', company: 'Ravi Constructions Pvt Ltd', city: 'Hyderabad', phone: '+91-98400-00003' },
];

// ---- MAIN SEED FUNCTION ----
const seed = async () => {
  await connectDB();

  console.log('🧹 Clearing existing data...');
  await Promise.all([
    Product.deleteMany({}),
    Vendor.deleteMany({}),
    DailyRate.deleteMany({}),
    ServicePartner.deleteMany({}),
    User.deleteMany({}),
  ]);

  console.log('🏭 Seeding vendors...');
  const savedVendors = await Vendor.insertMany(vendors);

  // Attach vendor listings to glass products
  const vendorListingsMap = {
    'Clear Float': [
      { vendorId: savedVendors[0]._id, vendorName: savedVendors[0].name, pricePerSqFt: 52, minOrderSqFt: 50, deliveryDays: 7, location: 'Ahmedabad', rating: 4.7, inStock: true },
      { vendorId: savedVendors[2]._id, vendorName: savedVendors[2].name, pricePerSqFt: 58, minOrderSqFt: 30, deliveryDays: 5, location: 'Delhi', rating: 4.3, inStock: true },
    ],
    'Toughened/Tempered': [
      { vendorId: savedVendors[0]._id, vendorName: savedVendors[0].name, pricePerSqFt: 108, minOrderSqFt: 20, deliveryDays: 10, location: 'Ahmedabad', rating: 4.7, inStock: true },
      { vendorId: savedVendors[1]._id, vendorName: savedVendors[1].name, pricePerSqFt: 115, minOrderSqFt: 15, deliveryDays: 7, location: 'Mumbai', rating: 4.5, inStock: true },
      { vendorId: savedVendors[3]._id, vendorName: savedVendors[3].name, pricePerSqFt: 105, minOrderSqFt: 25, deliveryDays: 12, location: 'Hyderabad', rating: 4.6, inStock: true },
    ],
    'Laminated': [
      { vendorId: savedVendors[0]._id, vendorName: savedVendors[0].name, pricePerSqFt: 142, minOrderSqFt: 20, deliveryDays: 14, location: 'Ahmedabad', rating: 4.7, inStock: true },
      { vendorId: savedVendors[3]._id, vendorName: savedVendors[3].name, pricePerSqFt: 155, minOrderSqFt: 15, deliveryDays: 10, location: 'Hyderabad', rating: 4.6, inStock: true },
    ],
    'Insulated (IGU/DGU)': [
      { vendorId: savedVendors[1]._id, vendorName: savedVendors[1].name, pricePerSqFt: 305, minOrderSqFt: 30, deliveryDays: 15, location: 'Mumbai', rating: 4.5, inStock: true },
      { vendorId: savedVendors[3]._id, vendorName: savedVendors[3].name, pricePerSqFt: 320, minOrderSqFt: 20, deliveryDays: 12, location: 'Hyderabad', rating: 4.6, inStock: true },
    ],
    'Low-E': [
      { vendorId: savedVendors[1]._id, vendorName: savedVendors[1].name, pricePerSqFt: 215, minOrderSqFt: 30, deliveryDays: 12, location: 'Mumbai', rating: 4.5, inStock: true },
      { vendorId: savedVendors[3]._id, vendorName: savedVendors[3].name, pricePerSqFt: 225, minOrderSqFt: 25, deliveryDays: 10, location: 'Hyderabad', rating: 4.6, inStock: true },
    ],
    'Reflective': [
      { vendorId: savedVendors[1]._id, vendorName: savedVendors[1].name, pricePerSqFt: 122, minOrderSqFt: 50, deliveryDays: 10, location: 'Mumbai', rating: 4.5, inStock: true },
      { vendorId: savedVendors[3]._id, vendorName: savedVendors[3].name, pricePerSqFt: 118, minOrderSqFt: 40, deliveryDays: 12, location: 'Hyderabad', rating: 4.6, inStock: true },
    ],
    'Frosted/Etched': [
      { vendorId: savedVendors[2]._id, vendorName: savedVendors[2].name, pricePerSqFt: 88, minOrderSqFt: 20, deliveryDays: 7, location: 'Delhi', rating: 4.3, inStock: true },
      { vendorId: savedVendors[0]._id, vendorName: savedVendors[0].name, pricePerSqFt: 92, minOrderSqFt: 15, deliveryDays: 10, location: 'Ahmedabad', rating: 4.7, inStock: true },
    ],
    'Mirror': [
      { vendorId: savedVendors[2]._id, vendorName: savedVendors[2].name, pricePerSqFt: 68, minOrderSqFt: 10, deliveryDays: 5, location: 'Delhi', rating: 4.3, inStock: true },
      { vendorId: savedVendors[0]._id, vendorName: savedVendors[0].name, pricePerSqFt: 72, minOrderSqFt: 10, deliveryDays: 7, location: 'Ahmedabad', rating: 4.7, inStock: true },
    ],
    'Acoustic': [
      { vendorId: savedVendors[4]._id, vendorName: savedVendors[4].name, pricePerSqFt: 182, minOrderSqFt: 20, deliveryDays: 15, location: 'Chennai', rating: 4.4, inStock: true },
      { vendorId: savedVendors[1]._id, vendorName: savedVendors[1].name, pricePerSqFt: 190, minOrderSqFt: 15, deliveryDays: 12, location: 'Mumbai', rating: 4.5, inStock: true },
    ],
    'Back-Painted/Lacquered': [
      { vendorId: savedVendors[2]._id, vendorName: savedVendors[2].name, pricePerSqFt: 102, minOrderSqFt: 10, deliveryDays: 7, location: 'Delhi', rating: 4.3, inStock: true },
      { vendorId: savedVendors[0]._id, vendorName: savedVendors[0].name, pricePerSqFt: 108, minOrderSqFt: 10, deliveryDays: 10, location: 'Ahmedabad', rating: 4.7, inStock: true },
    ],
    'Switchable/Smart': [
      { vendorId: savedVendors[4]._id, vendorName: savedVendors[4].name, pricePerSqFt: 980, minOrderSqFt: 10, deliveryDays: 21, location: 'Chennai', rating: 4.4, inStock: true },
    ],
  };

  const productsWithVendors = [...glassProducts, ...alliedProducts].map(p => ({
    ...p,
    vendorListings: vendorListingsMap[p.glassType] || [],
  }));

  console.log('📦 Seeding products...');
  await Product.insertMany(productsWithVendors);

  console.log('📈 Seeding daily rates...');
  await DailyRate.insertMany(generateRates());

  console.log('🔧 Seeding service partners...');
  await ServicePartner.insertMany(servicePartners);

  console.log('👤 Seeding users...');
  for (const u of seedUsers) {
    await User.create(u);
  }

  console.log('✅ Seeding complete!');
  console.log(`   → ${productsWithVendors.length} products (${glassProducts.length} glass + ${alliedProducts.length} allied)`);
  console.log(`   → ${vendors.length} vendors`);
  console.log(`   → ${servicePartners.length} service partners`);
  console.log(`   → ${seedUsers.length} demo users`);
  console.log('   → Demo credentials: homeowner@demo.com / demo1234');
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
