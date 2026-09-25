// Shared Lakhera Enterprise Verified Engineering Knowledge Engine
// Used by server.ts, Netlify Functions, and client-side fallbacks

export const SYSTEM_PROMPT = `You are "Ask Lakhera AI", the official engineering & customer consultation assistant for Lakhera Enterprise.
Lakhera Enterprise is a premier industrial fabrication, automation, and metal engineering firm based in Bhopal, Madhya Pradesh, India.

VERIFIED BUSINESS DETAILS:
- Company Name: Lakhera Enterprise
- Workshop / Office Address: Shop No. 15, Main Road, Near Raja Bhoj Arcade, Bagsewaniya, Bagmugaliya, Habib Ganj, Bhopal, MP - 462043
- Workshop Contact / WhatsApp: +91 82230 01415
- Official Email: contact@lakheraenterprises.com
- Service Region: Bhopal, Mandideep, Govindpura Industrial Area, Hoshangabad Road, Raisen, Sehore, and pan-Madhya Pradesh (with industrial shed delivery nationwide).
- Map Location: Direct Google Maps directions and live embed available without any Map API key.

OFFICIAL SERVICES PORTFOLIO:
1. Rolling Shutters & Maxwell Motors:
   - Commercial shopfronts, factory bays, motorized gear shutters, perforated & grill shutters, heavy-gauge galvanized steel slats.
2. Automatic Maxwell Motor Solutions:
   - Genuine high-torque Maxwell rolling shutter motors.
   - Center roll motors (150kg to 350kg lifting capacity) & Heavy-duty Industrial Side Motors (300kg to 1500kg).
   - Wireless RF remote controls, manual pull-chain override for power cuts, safety photo-cell obstacle sensors.
3. Dewas GI Door Frames / Chaukhat:
   - High-precision bent Galvanized Iron (GI) door frames (1.2mm, 1.6mm thickness).
   - 100% anti-termite, water-resistant, zero warping or shrinking unlike wooden chaukhats. Single and double rebate profiles.
4. CNC / Fiber Laser-Cut Luxury Main Gates:
   - Precision fiber laser cut luxury gates, contemporary geometric, floral, and royal architectural motifs.
   - Heavy structural MS box pipe framing (75x75mm, 100x50mm), brass or SS-304 gold accents, multi-coat zinc primer and electrostatic powder coating.
5. Pipe Doors & Designer Grills:
   - Heavy-duty safety grill gates, modern horizontal pipe doors, designer window security grills, balcony railings with safety lock boxes.
6. MS & SS Fabrication:
   - Structural Mild Steel fabrication and Stainless Steel (Grade 304 and 316) designer railings, laser-cut balustrades, staircase stringers, industrial mezzanine platforms.
7. Industrial Sheds:
   - Pre-Engineered Building (PEB) factory sheds, warehouse structures, heavy steel trusses, color-coated Galvalume corrugated roofing sheets, polycarbonate daylight panels, industrial gutter systems.
8. Custom Fabrication Work:
   - Bespoke structural engineering, heavy machinery covers, security cabins, architectural metal facades built exactly to architectural drawings/CAD blueprints.

CRITICAL GUARDRAILS (STRICT COMPLIANCE REQUIRED):
- NEVER invent, estimate, or hallucinate prices, per-square-foot rates (e.g., do NOT state '₹180/sq.ft' or any number), labor rates, or fake discounts.
- NEVER invent specifications that are not verified.
- If asked about prices, state clearly and politely: "Fabrication pricing depends strictly on site measurements, steel gauge/thickness, structural load, finish (powder coating/primer), and motor tonnage. Our engineering team provides an exact itemized quotation following an On-Site or Online Consultation."
- Help the user choose the right service for their building, home, or factory.
- If the user uploads an image/design (site photo, gate sketch, blue print), analyze its visual elements, note the architectural style (e.g. laser cut pattern, pipe structure, motor positioning), and advise on suitable materials (e.g. GI vs MS vs SS 304).
- Systematically gather customer requirements: project type, rough dimensions or opening size, location in Bhopal or nearby, preferred finish, and automation needs.
- Offer to Book a Consultation or submit a Get Quote form directly on the website, or direct them to WhatsApp at +91 82230 01415 with a pre-filled summary.
- Tone: Professional, courteous, technically knowledgeable, trustworthy industrial engineer.`;

export function generateRefId(prefix: string): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${new Date().getFullYear()}-${randomNum}`;
}

export function generateVerifiedEngineeringResponse(query: string, hasImage?: boolean): string {
  const q = (query || '').toLowerCase().trim();

  // Image analysis query
  if (hasImage) {
    return `Thank you for sharing your design drawing / site photo! 

Our engineering team at Lakhera Enterprise in Bhopal has reviewed your upload. Here is our technical analysis:
• Structural Framework: For this architectural profile, we recommend heavy MS box sections (minimum 75x75mm or 100x50mm, 2.0mm–2.5mm wall thickness) to prevent sagging and ensure long-term structural integrity.
• Sheet Gauge & Infill: If this involves CNC laser-cut panels, we suggest 3mm to 4mm HR/CR sheets for clean burr-free cuts without fluttering during heavy winds.
• Surface Finish: For weather resistance in Bhopal's monsoon and summer climate, we recommend multi-stage zinc chromate primer followed by dual-coat electrostatic thermosetting architectural powder coating.
• Automation Compatibility: This design can be integrated with genuine high-torque Maxwell motor automation (Center roll or heavy-duty side gear motor) with RF wireless remote control.

📋 Next Steps: To give you an exact itemized bill of materials and schedule, you can click "Book Site Consultation" for a free measurement visit in Bhopal, or click "Get Formal Quote" to specify opening dimensions.`;
  }

  // Price / Cost / Rate queries
  if (q.includes('price') || q.includes('cost') || q.includes('rate') || q.includes('how much') || q.includes('quotation') || q.includes('charges') || q.includes('budget') || q.includes('sq ft') || q.includes('sqft')) {
    return `At Lakhera Enterprise, fabrication pricing is calculated strictly on verified engineering specifications rather than flat rough estimates. 

Key factors determining your exact cost include:
1. Opening Dimensions: Total square footage (Width × Height) of the shutter, gate, or shed structure.
2. Material Gauge & Steel Grade: Sheet thickness (1.2mm / 1.6mm for Dewas GI Chaukhat; 3mm–5mm for CNC laser cut sheets; heavy MS or SS-304 for railings).
3. Motor & Automation Rating: Genuine Maxwell motor capacity (150kg to 1500kg) based on dead weight calculation, wireless RF remotes, and photocell safety sensors.
4. Protective Finish: Heavy zinc primer, electrostatic powder coating, or PU polyurethane finish.

👉 How to get an exact quotation:
• Click "Book Site Consultation" below to have our Bhopal engineering team measure your opening on-site.
• Or click "Get Formal Quote" to submit your dimensions and receive an itemized quote within 24 hours.
• You can also chat directly with our workshop engineers on WhatsApp at +91 82230 01415.`;
  }

  // Rolling Shutters & Maxwell Motors sizing & tonnage
  if (q.includes('shutter') || q.includes('maxwell') || q.includes('motor') || q.includes('tonnage') || q.includes('capacity') || q.includes('center motor') || q.includes('side motor')) {
    let capacityAdvice = '';
    if (q.includes('14x10') || q.includes('14 x 10') || q.includes('14*10') || q.includes('140')) {
      capacityAdvice = `For a 14 ft × 10 ft shutter (140 sq.ft), the total dead weight with 18/20 gauge galvanized steel slats is approximately 160–180 kg. We recommend the Maxwell 350 kg Heavy-Duty Center Motor or a 400 kg Industrial Side Motor for smooth daily cycles with 100% safety buffer.`;
    } else if (q.includes('10x10') || q.includes('10 x 10') || q.includes('100')) {
      capacityAdvice = `For a 10 ft × 10 ft shutter (100 sq.ft), weight is approximately 110–130 kg. The Maxwell 150 kg to 350 kg Center Motor provides ideal torque, whisper-quiet operation, and long gearbox life.`;
    } else if (q.includes('20x') || q.includes('heavy') || q.includes('industrial') || q.includes('factory')) {
      capacityAdvice = `For wide industrial warehouse shutters (over 200 sq.ft), we engineer heavy-duty Maxwell Industrial Side Motors (capacities available: 600 kg, 1000 kg, and 1500 kg) with built-in manual chain hoist mechanisms for power cuts.`;
    } else {
      capacityAdvice = `We install genuine Maxwell Rolling Shutter Motors ranging from 150 kg to 1500 kg lifting capacity. Sizing is calculated as: Shutter Area (Width × Height) × Gauge Weight Factor × 1.5 Safety Factor.`;
    }

    return `⚙️ Maxwell Rolling Shutter & Motor Specifications (Lakhera Enterprise):

${capacityAdvice}

Key Engineering Highlights:
• Motor Options: Genuine Maxwell Center Roll Motors (150kg–350kg) for retail shopfronts, and Heavy-Duty Industrial Side Motors (300kg–1500kg) for large commercial bays.
• Emergency Override: Heavy-duty manual pull-chain or release lever ensures complete manual operation during power cuts.
• Wireless Automation: High-frequency RF wireless remotes with rolling code security (range up to 40 meters) plus wall push-button station.
• Safety Sensors: Optional infrared photo-cell obstacle detection sensors that halt or reverse the shutter if an obstruction is detected.

Would you like to book a site measurement visit in Bhopal or get a formal quote for your shutter opening?`;
  }

  // Dewas GI Door Frames / Chaukhat
  if (q.includes('dewas') || q.includes('chaukhat') || q.includes('frame') || q.includes('door frame') || q.includes('gi frame') || q.includes('timber') || q.includes('wood')) {
    return `🚪 Dewas GI Door Frames (Chaukhat) — Precision Engineering by Lakhera Enterprise:

Why Dewas GI Chaukhat outperforms Traditional Timber (Wood):
1. 100% Termite & Borer Proof: Wood in Bhopal's soil and humid monsoon is prone to severe termite attacks. Galvanized Iron is completely immune to termites and insects.
2. Zero Warping or Swelling: Wooden frames expand during monsoon and shrink in summer, causing doors to jam. Dewas GI chaukhat retains exact millimeter tolerances year-round.
3. Fire & Moisture Resistant: Non-combustible GI sheet metal with zinc protective coating.
4. Solid Cement Mortar Infill: During brick masonry, the hollow GI cavity is filled solid with 1:3 cement mortar, creating an ultra-rigid monolithic frame.

Technical Specifications:
• Sheet Thickness: 1.2 mm (standard residential) and 1.6 mm (heavy commercial).
• Rebate Profiles: Single Rebate (single door leaf) and Double Rebate (main door + wire mesh mosquito fly net door).
• Hardware Fittings: Welded stainless steel heavy butt hinges, mortise lock receiver cutouts, and rubber buffer silencers for silent closing.

Available for immediate fabrication and delivery across Bhopal and Madhya Pradesh.`;
  }

  // CNC / Fiber Laser-Cut Luxury Main Gates
  if (q.includes('gate') || q.includes('laser') || q.includes('cnc') || q.includes('luxury gate') || q.includes('main gate')) {
    return `✨ CNC / Fiber Laser-Cut Luxury Main Gates by Lakhera Enterprise:

Our luxury entrance gates combine heavy structural security with bespoke architectural aesthetics:
• Structural Foundation: Outer frame constructed from heavy MS box pipes (75x75mm or 100x50mm, 2.5mm–3.0mm wall thickness) to guarantee zero sagging over decades.
• Fiber Laser Cutting: Intricate CNC cut panels in 3.0mm to 5.0mm sheet thickness with ultra-smooth burr-free edges. Geometric, royal floral, parametric, or minimalist louver patterns.
• Premium Accents: Optional brushed brass strips, Stainless Steel (Grade 304) PVD gold trims, or integrated warm LED backlighting channels.
• Protective Finishing: Seven-tank surface degreasing and phosphating, followed by zinc-rich epoxy primer and dual-coat electrostatic thermosetting architectural powder coating (matte black, charcoal grey, royal bronze, antique copper).
• Automation Ready: Pre-engineered brackets for automatic remote-controlled swing arm actuators or heavy-duty underground/sliding gear motors.

You can upload your architect's CAD drawing or gate photo here, or book an on-site consultation to choose from our luxury catalog!`;
  }

  // Pipe Doors & Designer Grills
  if (q.includes('pipe door') || q.includes('grill') || q.includes('window grill') || q.includes('safety door') || q.includes('railing') || q.includes('balcony')) {
    return `🛡️ Pipe Doors & Designer Security Grills (Lakhera Enterprise):

• Modern Pipe Doors: Fabricated with high-grade MS hollow square and rectangular sections (40x20mm, 50x25mm), integrated with internal mosquito mesh and reinforced safety deadbolt lock boxes.
• Window Security Grills: Laser-cut or modern horizontal tube grill designs that provide maximum anti-theft security while maintaining expansive outdoor visibility.
• Balcony & Staircase Railings: Modern MS horizontal pipes, glass-integrated balustrades, or SS-304 railings with concealed anchor bolting.
• Finish: Anti-rust zinc phosphate primer with premium satin or textured powder coating.

We manufacture exact customized dimensions for residential homes, apartment complexes, and commercial towers across Bhopal.`;
  }

  // MS & SS Fabrication
  if (q.includes('fabrication') || q.includes('ms') || q.includes('ss') || q.includes('stainless steel') || q.includes('steel') || q.includes('structure')) {
    return `🏗️ Professional MS & Stainless Steel (SS) Fabrication:

Lakhera Enterprise operates a fully equipped fabrication workshop in Bhopal with certified welders, hydraulic press benders, and fiber laser cutting machinery:
• Mild Steel (MS) Structural Work: Heavy columns, beams, staircase stringers, mezzanine floors, canopy structures, and machinery enclosures.
• Stainless Steel (SS) Work: Grade 304 and Grade 316 architectural fabrication, luxury staircase handrails, laser-cut screens, and designer entry facades.
• Welding Standards: High-penetration MIG/MAG and TIG welding for seamless joints, ground flush and polished to architectural standards.

Share your requirements or schedule a workshop consultation to review your structural drawings.`;
  }

  // Industrial Sheds & PEB Warehouses
  if (q.includes('shed') || q.includes('peb') || q.includes('industrial shed') || q.includes('warehouse') || q.includes('factory') || q.includes('godown') || q.includes('truss')) {
    return `🏭 Industrial Sheds & Pre-Engineered Buildings (PEB) — Bhopal & Pan-MP:

We design, fabricate, and erect turnkey industrial PEB sheds for manufacturing plants, warehouses, and godowns (active in Mandideep, Govindpura Industrial Area, Hoshangabad Road, and surrounding regions):
• Primary Structure: High-tensile structural steel built-up I-beams and heavy tubular roof trusses designed for wind loads and earthquake safety.
• Secondary Framing: Cold-formed Galvanized Z and C purlins.
• Roof & Wall Cladding: Premium 0.45mm–0.50mm color-coated Galvalume corrugated profile sheets with high anti-corrosion zinc-aluminum alloy coating.
• Natural Illumination & Ventilation: High-impact polycarbonate daylight skylight sheets (100% natural lighting during day shifts) and industrial turbo ventilators.
• Rainwater Management: Heavy-gauge seamless eaves gutters and downspout piping.

Contact our workshop at +91 82230 01415 or book an on-site consultation to discuss span length, clear height, and column spacing.`;
  }

  // Workshop Contact, Bhopal Location, Map & Timings
  if (q.includes('bhopal') || q.includes('address') || q.includes('location') || q.includes('where') || q.includes('shop') || q.includes('workshop') || q.includes('visit') || q.includes('contact') || q.includes('phone') || q.includes('whatsapp') || q.includes('timing')) {
    return `📍 Lakhera Enterprise — Bhopal Workshop & Office Details:

• Physical Address: Shop No. 15, Main Road, Near Raja Bhoj Arcade, Bagsewaniya, Bagmugaliya, Habib Ganj, Bhopal, MP - 462043.
• Direct Phone / WhatsApp: +91 82230 01415
• Official Email: contact@lakheraenterprises.com
• Working Hours: Monday to Saturday, 9:00 AM to 8:30 PM (Sunday by appointment).
• Service Coverage: All areas of Bhopal (Bagsewaniya, MP Nagar, Arera Colony, Kolar Road, Hoshangabad Road, Govindpura, Mandideep, Ayodhya Bypass, Bairagarh) and industrial projects across MP.

You can get direct Google Maps navigation from the "Workshop Location" section below (no Map API key required), or book a free on-site survey right here!`;
  }

  // Consultation / Booking queries
  if (q.includes('consultation') || q.includes('book') || q.includes('survey') || q.includes('appointment') || q.includes('meeting')) {
    return `📅 Book an Engineering Consultation with Lakhera Enterprise:

We offer two flexible consultation formats:
1. On-Site Consultation (Bhopal & nearby): Our structural fabrication engineer visits your site with laser measurement equipment, inspects structural lintels/columns, and reviews requirements.
2. Online Consultation: Send us your floor plan or architect's drawings via WhatsApp or our portal for a virtual video/call review.

To schedule your slot, click the "Book Site Consultation" button below, choose your preferred date and time, and our team will confirm immediately!`;
  }

  // Default intelligent greeting & capability overview
  return `Namaste! I am Ask Lakhera AI, your dedicated engineering assistant for Lakhera Enterprise in Bhopal.

Here is how I can assist with your project:
1. Rolling Shutters & Maxwell Motors: Sizing calculations (150kg to 1500kg), remote automation, and manual override safety.
2. Dewas GI Door Frames (Chaukhat): 1.2mm/1.6mm thickness, single/double rebate profiles, termite-proof comparisons vs wood.
3. CNC Fiber Laser-Cut Luxury Main Gates: Structural MS framing, intricate designs, powder coating, and automatic motor actuators.
4. Industrial PEB Sheds & Warehouses: Trusses, Galvalume roofing, and Mandideep/Govindpura factory fabrication.
5. Pipe Doors & Security Grills: Heavy-duty entrance security doors and window grills.
6. Design Analysis: You can attach a photo or CAD sketch using the image button for instant material & fabrication recommendations.

Please type your requirement, dimensions, or questions above, or click "Book Site Consultation" to schedule a site visit in Bhopal!`;
}
