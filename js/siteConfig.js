/* ============================================================
   YOGA HUB — Central Business Configuration
   Change values ONCE here. No business data is hardcoded
   in components; everything reads from window.YH_CONFIG.
   ============================================================ */
window.YH_CONFIG = {
  brandName: "Yoga Hub",
  tagline: "Transform Your Body, Transform Your Life",
  established: "Since 2016",
  experienceYears: 10,
  membersCount: 1000,
  trainer: "Ganesh Sharma",
  rating: { value: "5.0", count: 4, source: "directory reviews" },
  location: {
    area: "Malad East",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    addressLine: "Shop No. 1, Mithailal Compound, Kurar Village, Opp. Jyoti Hotel, Malad East, Mumbai 400097",
    landmark: "Opp. Jyoti Hotel · Opp. Axis Bank ATM · Kurar Village",
    pincode: "400097",
    nearStation: "Borivli station ≈ 4 km · Azad Nagar Metro ≈ 4.2 km",
    geo: { lat: 19.1827215, lng: 72.8637847 },
    mapsQuery: "Yoga Hub, Mithailal Compound, Kurar Village, Malad East, Mumbai 400097",
    get mapsLink() {
      return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(this.mapsQuery);
    },
    get mapsEmbed() {
      // Exact studio pin from the official listing coordinates
      if (this.geo) return "https://www.google.com/maps?q=" + this.geo.lat + "," + this.geo.lng + "&z=16&output=embed";
      return "https://www.google.com/maps?q=" + encodeURIComponent(this.mapsQuery) + "&output=embed";
    }
  },
  contact: {
    // Real business number from the official listing (Yappe directory)
    phoneDisplay: "+91 99202 33085",
    phoneHref: "+919920233085",
    whatsappNumber: "919920233085",
    email: "hello@yogahub.in",
    hours: [
      { days: "Mon – Sun", time: "6:00 AM – 11:00 AM (open all 7 days)" },
      { days: "Evening / Online", time: "Batches on enquiry — call or WhatsApp" }
    ]
  },
  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    youtube: "https://youtube.com/"
  },
  classSchedule: [
    { slot: "Morning Batches", time: "6:00 AM – 11:00 AM", days: "Mon – Sun", level: "All levels" },
    { slot: "Kids Yoga (5–13 yrs)", time: "On enquiry", days: "Mon – Sun", level: "Beginner friendly" },
    { slot: "Online via Zoom", time: "On enquiry", days: "Mon – Sun", level: "All levels" },
    { slot: "Therapy / Personal", time: "By appointment", days: "Mon – Sun", level: "1-on-1" }
  ],
  pricing: [
    { plan: "Free Trial", price: "₹0", duration: "1 session", features: ["1 group trial session", "Posture & goal check", "Program recommendation"], cta: "Book Free Trial", href: "#/free-trial", tag: "Start here" },
    { plan: "Monthly", price: "₹1,200", duration: "per month", features: ["Group batches (Mon–Sat)", "Hatha + Power + Mobility", "Small batch attention", "Progress check-ins"], cta: "Enquire Now", href: "#/free-trial" },
    { plan: "Quarterly", price: "₹3,000", duration: "per 3 months", features: ["Everything in Monthly", "Personalised routine", "Diet & habit guidance", "Priority batch choice"], cta: "Enquire Now", href: "#/free-trial", tag: "Most popular" },
    { plan: "Personal Yoga", price: "On enquiry", duration: "1-on-1", features: ["Fully personalised plan", "Home / studio / online", "Therapy-oriented support", "Flexible timings"], cta: "Book Consultation", href: "#/contact" },
    { plan: "TTC 200 Hours", price: "On enquiry", duration: "Certification course", features: ["Asana · Pranayama · Anatomy", "Philosophy · Teaching practice", "Assessment & certification"], cta: "Explore TTC", href: "#/ttc-200-hours" }
  ],
  whatsappMessages: {
    trial: "Hi Yoga Hub, I would like to book a free trial session.",
    classes: "Hi Yoga Hub, I have a question about yoga classes.",
    ttc: "Hi Yoga Hub, I want details about the Yoga Teacher Training course.",
    corporate: "Hi Yoga Hub, I want a corporate yoga session enquiry."
  },
  analytics: { gaId: "", metaPixelId: "" }, // fill to activate; tracking stays dormant until set
  seo: {
    siteUrl: "https://www.yogahub.in",
    defaultTitle: "Yoga Hub Malad East | Yoga Classes in Malad East, Mumbai Since 2016",
    defaultDescription: "Professional yoga classes in Malad East, Mumbai since 2016. Strength, flexibility, back-pain support, weight management, senior fitness & teacher training. Book a FREE trial."
  }
};
window.YH_WHATSAPP = function (messageKeyOrText) {
  var cfg = window.YH_CONFIG;
  var msg = cfg.whatsappMessages[messageKeyOrText] || messageKeyOrText;
  return "https://wa.me/" + cfg.contact.whatsappNumber + "?text=" + encodeURIComponent(msg);
};
