// Rule-based NLP AI Matcher for glass product recommendations
// Maps plain-language queries to glass types, specs, and allied products

const glassRules = [
  {
    keywords: ['shower', 'bathroom', 'wet area', 'bath'],
    recommendation: {
      glassType: 'Toughened/Tempered',
      thickness: [8, 10],
      process: ['Tempered', 'Heat Soaked'],
      application: 'Shower',
      reason: 'Toughened glass is mandatory for wet areas under IS:2553. It shatters safely into small pellets, preventing injury.',
      priceRange: '₹85–₹130 per sq.ft',
      alliedProducts: ['Frameless Shower Hardware Kit', 'Structural Silicone Sealant', 'Patch Fittings'],
      tips: ['Minimum 8mm thickness for shower enclosures', 'Use heat-soaked glass to prevent spontaneous breakage', 'Frameless systems require patch fittings at hinges'],
    },
  },
  {
    keywords: ['partition', 'office', 'cabin', 'workspace', 'meeting room'],
    recommendation: {
      glassType: 'Laminated',
      thickness: [10, 12],
      process: ['Laminated', 'Tempered+Laminated'],
      application: 'Partition',
      reason: 'Laminated glass holds together when broken (PVB interlayer), ideal for office safety. Also provides sound insulation.',
      priceRange: '₹110–₹180 per sq.ft',
      alliedProducts: ['Slim Partition System', 'Aluminium Channels', 'Door Hardware'],
      tips: ['10mm laminated (5+5) for standard office partitions', '12mm for floor-to-ceiling systems', 'Add frosting for privacy zones'],
    },
  },
  {
    keywords: ['soundproof', 'noise', 'acoustic', 'sound insulation', 'studio', 'hospital'],
    recommendation: {
      glassType: 'Acoustic',
      thickness: [10, 12, 15],
      process: ['Acoustic Laminated'],
      application: 'Partition',
      reason: 'Acoustic glass uses a special PVB interlayer that dampens sound waves. Achieves 35–50dB reduction depending on thickness.',
      priceRange: '₹150–₹250 per sq.ft',
      alliedProducts: ['Acoustic Seals', 'Heavy-duty Aluminium Frame', 'Acoustic Door Bottom Seal'],
      tips: ['Use 6.8 PVB or 8.8 PVB interlayer for best results', 'Seal all gaps — glass alone won\'t suffice', 'Combine with double glazing for max performance'],
    },
  },
  {
    keywords: ['railing', 'balcony', 'terrace', 'staircase', 'pool', 'safety'],
    recommendation: {
      glassType: 'Toughened/Tempered',
      thickness: [12, 15],
      process: ['Tempered', 'Heat Soaked'],
      application: 'Railing',
      reason: 'Toughened 12mm is the industry standard for railings per NBC 2016. Heat soaking eliminates NiS inclusion risk.',
      priceRange: '₹120–₹185 per sq.ft',
      alliedProducts: ['U-Channel Base', 'Spigot Fittings', 'Glass Railing Clamps', 'Handrail (SS/Wood)'],
      tips: ['Minimum 12mm for railings above 1m height', 'Always specify heat-soaked for balcony railings', 'Cantilevered railings may need 15mm or laminated'],
    },
  },
  {
    keywords: ['facade', 'exterior', 'building', 'curtain wall', 'structural glazing', 'commercial'],
    recommendation: {
      glassType: 'Low-E',
      thickness: [6, 8],
      process: ['Double Glazed (IGU)', 'Low-E Coating', 'Structural Silicone Bond'],
      application: 'Facade',
      reason: 'Low-E coated insulated glass (IGU) reduces solar heat gain and interior heat loss, mandatory for green building ratings.',
      priceRange: '₹280–₹480 per sq.ft (IGU)',
      alliedProducts: ['Aluminium Mullion & Transom System', 'Structural Silicone', 'Spider Fittings', 'ACP Cladding'],
      tips: ['SHGC < 0.25 for hot climates', 'VLT > 60% for maximum daylight', 'Unitized systems for high-rises (>10 floors)'],
    },
  },
  {
    keywords: ['frosted', 'privacy', 'bedroom', 'frosting', 'etched', 'decorative'],
    recommendation: {
      glassType: 'Frosted/Etched',
      thickness: [5, 6, 8],
      process: ['Acid Etched', 'Sandblasted', 'Digitally Printed'],
      application: 'Interior',
      reason: 'Frosted or acid-etched glass diffuses light while maintaining privacy. Available in various opacity levels and patterns.',
      priceRange: '₹65–₹120 per sq.ft',
      alliedProducts: ['Aluminium Frame', 'Door Hinges', 'Edge Polish Kit'],
      tips: ['Acid etch for uniform frosting', 'Sandblast for custom patterns', 'Can be combined with clear glass for partial frosting'],
    },
  },
  {
    keywords: ['mirror', 'dressing', 'bathroom mirror', 'gym', 'dance'],
    recommendation: {
      glassType: 'Mirror',
      thickness: [4, 5, 6],
      process: ['Silver Coated', 'Copper-free', 'Antique'],
      application: 'Interior',
      reason: 'Float glass with silver reflective coating. Copper-free mirrors are moisture resistant — essential for bathrooms.',
      priceRange: '₹55–₹100 per sq.ft',
      alliedProducts: ['Mirror Clips', 'Mirror Adhesive', 'LED Mirror Light Frame'],
      tips: ['Always use copper-free mirror in wet areas', 'Safety back film prevents shattering', 'Float glass base ensures distortion-free reflection'],
    },
  },
  {
    keywords: ['skylight', 'roof', 'overhead', 'canopy', 'atrium', 'natural light'],
    recommendation: {
      glassType: 'Laminated',
      thickness: [10, 12],
      process: ['Laminated', 'Tempered+Laminated', 'Low-E Coated'],
      application: 'Skylight',
      reason: 'Overhead glass MUST be laminated so broken pieces stay bonded — standard IS code requirement for safety above occupants.',
      priceRange: '₹180–₹320 per sq.ft',
      alliedProducts: ['Aluminium Skylight Frame', 'Flashing Sealant', 'GRP Gaskets', 'Drainage Channel'],
      tips: ['Always use laminated overhead — tempered alone is not safe for overhead', 'Low-E coating reduces heat in summer', 'Slope at minimum 5° for water drainage'],
    },
  },
  {
    keywords: ['window', 'door', 'UPVC', 'aluminium', 'sliding', 'casement'],
    recommendation: {
      glassType: 'Insulated (IGU/DGU)',
      thickness: [5, 6],
      process: ['Double Glazed (DGU)', 'Argon Filled', 'Low-E'],
      application: 'Window',
      reason: 'Double glazed units (6+12+6) provide thermal insulation, noise reduction and condensation control for windows and doors.',
      priceRange: '₹220–₹380 per sq.ft',
      alliedProducts: ['UPVC Profiles', 'Aluminium Frame System', 'Warm Edge Spacer Bar', 'Weatherstripping'],
      tips: ['6+12+6 IGU is standard for residential', 'Argon fill improves U-value by 12%', 'Low-E coating on surface 2 or 3'],
    },
  },
  {
    keywords: ['smart', 'switchable', 'privacy glass', 'electrochromic', 'PDLC', 'office cabin'],
    recommendation: {
      glassType: 'Switchable/Smart',
      thickness: [8, 10],
      process: ['PDLC Film', 'Electrochromic', 'SPD Film'],
      application: 'Partition',
      reason: 'Smart glass switches from transparent to opaque on demand with a switch/remote. Eliminates need for blinds or curtains.',
      priceRange: '₹850–₹1,500 per sq.ft',
      alliedProducts: ['PDLC Controller', 'Power Supply Unit', 'Aluminium Frame with Wire Channel'],
      tips: ['PDLC film is most cost-effective smart option', 'Requires 220V AC power connection', 'Opaque when power is off (safety glass behavior)'],
    },
  },
];

const matchGlassRequirement = (query) => {
  const q = query.toLowerCase();
  let bestMatch = null;
  let maxScore = 0;

  for (const rule of glassRules) {
    const score = rule.keywords.filter(k => q.includes(k)).length;
    if (score > maxScore) {
      maxScore = score;
      bestMatch = rule;
    }
  }

  if (!bestMatch) {
    // Default fallback
    return {
      recommendation: {
        glassType: 'Clear Float',
        thickness: [5, 6, 8],
        process: ['Standard', 'Polished Edges'],
        application: 'General',
        reason: 'Clear float glass is the most versatile option. It can be used for most applications and processed further as needed.',
        priceRange: '₹45–₹75 per sq.ft',
        alliedProducts: ['Aluminium Frame', 'Silicone Sealant'],
        tips: ['Specify your application clearly to get a precise recommendation', 'Consider tempering for safety in most applications'],
      },
      confidence: 'low',
      query,
    };
  }

  return {
    recommendation: bestMatch.recommendation,
    confidence: maxScore >= 2 ? 'high' : 'medium',
    query,
    matchedKeywords: bestMatch.keywords.filter(k => q.includes(k)),
  };
};

module.exports = { matchGlassRequirement };
