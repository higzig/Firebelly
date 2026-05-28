// =============================================================================
// Firebelly Minisite Template — Business Config
// Replace all values below to customise for a different food truck.
// =============================================================================

const FIREBELLY = {

  // ---------------------------------------------------------------------------
  // Business identity
  // ---------------------------------------------------------------------------
  business: {
    titleLine1: "Firebelly",      // first line of hero display title
    titleLine2: "Pizza",          // second line, rendered in italic accent
    tagline: "Neapolitan sourdough. 48-hour ferment. 90 seconds in the fire.",
    whatsapp: "353851234567",     // international format, no + or spaces
    instagram: {
      url: "https://instagram.com/firebellyPizza",
      handle: "@firebellyPizza"
    },
    facebook: {
      url: "https://facebook.com/FirebellyPizza",
      name: "Firebelly Pizza"
    }
  },

  // ---------------------------------------------------------------------------
  // Hero section
  // ---------------------------------------------------------------------------
  hero: {
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80"
  },

  // ---------------------------------------------------------------------------
  // Weekly schedule
  // day:       full English weekday name, matched automatically against today
  // isOpen:    set false to mark a cancellation without removing the entry
  // startTime: 24-hour "HH:MM" — used to determine open/not-yet-open/done states
  // endTime:   24-hour "HH:MM"
  // hours:     human-readable string shown in the UI
  // ---------------------------------------------------------------------------
  schedule: [
    {
      day: "Friday",
      isOpen: true,
      startTime: "16:30",
      endTime:   "20:30",
      venue: "The Anchor Bar",
      address: "Main St, Ballincollig",
      mapsUrl: "https://maps.google.com/?q=The+Anchor+Bar+Ballincollig",
      hours: "4:30pm – 8:30pm"
    },
    {
      day: "Sunday",
      isOpen: true,
      startTime: "10:00",
      endTime:   "14:00",
      venue: "Douglas Farmers Market",
      address: "Church Rd, Douglas",
      mapsUrl: "https://maps.google.com/?q=Douglas+Farmers+Market+Cork",
      hours: "10:00am – 2:00pm"
    },
    {
      day: "Wednesday",
      isOpen: true,
      startTime: "12:00",
      endTime:   "17:00",
      venue: "Kinsale Marina",
      address: "Pier Rd, Kinsale",
      mapsUrl: "https://maps.google.com/?q=Kinsale+Marina+Cork",
      hours: "12:00pm – 5:00pm"
    }
  ],

  // ---------------------------------------------------------------------------
  // Stats strip (shown below schedule)
  // ---------------------------------------------------------------------------
  stats: [
    { value: "48h",  label: "Dough ferment"    },
    { value: "90s",  label: "In the fire"      },
    { value: "450°", label: "Gozney oven"      },
    { value: "20yr", label: "Chef experience"  }
  ],

  // ---------------------------------------------------------------------------
  // Menu
  // tags: any combination of "popular" | "special" | "veg" | "spicy"
  // glutenFreeAvail: shows a GF badge; does not mean the item is GF by default
  // soldOut: disables Add button and dims item
  // ---------------------------------------------------------------------------
  menu: {
    categories: [
      { id: "classics", label: "Classics"       },
      { id: "specials", label: "This week"      },
      { id: "sides",    label: "Sides & drinks" }
    ],
    items: [
      // — Classics ——————————————————————————————————————————————————————————
      {
        category: "classics",
        id: "margherita",
        name: "Margherita",
        desc: "San Marzano, fior di latte, basil, EVOO",
        price: 13,
        image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=120&q=70",
        tags: ["popular", "veg"],
        glutenFreeAvail: true,
        allergens: "Gluten, dairy",
        soldOut: false
      },
      {
        category: "classics",
        id: "diavola",
        name: "Diavola",
        desc: "San Marzano, fior di latte, 'nduja, honey",
        price: 15,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=120&q=70",
        tags: ["popular", "spicy"],
        glutenFreeAvail: true,
        allergens: "Gluten, dairy",
        soldOut: false
      },
      {
        category: "classics",
        id: "funghi",
        name: "Funghi",
        desc: "Cream base, wild mushrooms, truffle, pecorino",
        price: 15,
        image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=120&q=70",
        tags: ["veg"],
        glutenFreeAvail: true,
        allergens: "Gluten, dairy",
        soldOut: false
      },
      {
        category: "classics",
        id: "prosciutto",
        name: "Prosciutto",
        desc: "San Marzano, San Daniele ham, rocket, parmesan",
        price: 16,
        image: "https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?w=120&q=70",
        tags: [],
        glutenFreeAvail: true,
        allergens: "Gluten, dairy",
        soldOut: false
      },
      {
        category: "classics",
        id: "bianca",
        name: "Bianca",
        desc: "Cream base, roasted garlic, courgette, lemon",
        price: 14,
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=120&q=70",
        tags: ["veg"],
        glutenFreeAvail: true,
        allergens: "Gluten, dairy",
        soldOut: false
      },
      {
        category: "classics",
        id: "quattro",
        name: "Quattro Formaggi",
        desc: "Gorgonzola, pecorino, scamorza, honey",
        price: 15,
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=120&q=70",
        tags: ["veg"],
        glutenFreeAvail: true,
        allergens: "Gluten, dairy",
        soldOut: false
      },
      // — Specials ———————————————————————————————————————————————————————————
      {
        category: "specials",
        id: "blackpudding",
        name: "Clonakilty Black Pudding",
        desc: "Cream base, black pudding, caramelised onion, apple chutney",
        price: 16,
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=120&q=70",
        tags: ["special"],
        glutenFreeAvail: false,
        allergens: "Gluten, dairy",
        soldOut: false
      },
      {
        category: "specials",
        id: "redpepper",
        name: "Roasted Red Pepper & Feta",
        desc: "San Marzano, slow-roasted pepper, whipped feta, pine nuts",
        price: 15,
        image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=120&q=70",
        tags: ["special", "veg"],
        glutenFreeAvail: true,
        allergens: "Gluten, dairy, nuts",
        soldOut: true
      },
      // — Sides & drinks ——————————————————————————————————————————————————————
      {
        category: "sides",
        id: "doughballs",
        name: "Dough balls (6)",
        desc: "Garlic butter, fresh herbs",
        price: 6,
        image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=120&q=70",
        tags: ["veg"],
        glutenFreeAvail: false,
        allergens: "Gluten, dairy",
        soldOut: false
      },
      {
        category: "sides",
        id: "arancini",
        name: "Arancini (3)",
        desc: "Saffron risotto, mozzarella, tomato dip",
        price: 7,
        image: "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=120&q=70",
        tags: ["veg"],
        glutenFreeAvail: false,
        allergens: "Gluten, dairy, eggs",
        soldOut: false
      },
      {
        category: "sides",
        id: "softdrink",
        name: "Soft drink",
        desc: "Coke, Coke Zero, Fanta, water",
        price: 2.5,
        image: "https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=120&q=70",
        tags: ["veg"],
        glutenFreeAvail: true,
        allergens: "",
        soldOut: false
      },
      {
        category: "sides",
        id: "lemonade",
        name: "Sparkling lemonade",
        desc: "House-made, fresh lemon & mint",
        price: 3.5,
        image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=120&q=70",
        tags: ["veg"],
        glutenFreeAvail: true,
        allergens: "",
        soldOut: false
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // Order / pickup time slots
  // Update these to match today's trading hours
  // ---------------------------------------------------------------------------
  pickupTimes: [
    "4:30pm", "5:00pm", "5:30pm",
    "6:00pm", "6:30pm", "7:00pm",
    "7:30pm", "8:00pm", "8:30pm"
  ],

  // ---------------------------------------------------------------------------
  // Private events section
  // ---------------------------------------------------------------------------
  events: {
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
    description:
      "We bring the horsebox, the oven, and twenty years of craft. You bring the crowd.",
    types: [
      "Weddings & civil ceremonies",
      "Birthday & garden parties",
      "Corporate evenings",
      "Markets & festival appearances"
    ],
    minGuests: 30,
    serviceArea: "Cork & surrounding counties",
    enquiryMessage:
      "Hi! I'd like to enquire about a private event with Firebelly Pizza.\n\nDate:\nLocation:\nGuest count:\nEvent type:\n\nThanks!"
  },

  // ---------------------------------------------------------------------------
  // Reviews
  // ---------------------------------------------------------------------------
  reviews: [
    {
      text: "Best pizza I've had in Cork. The dough is genuinely something else — light, blistered, nothing like the takeaway stuff.",
      author: "Siobhán M.",
      source: "Google Reviews",
      rating: 5
    },
    {
      text: "Hired Firebelly for our wedding. Guests are still talking about it six months later. Worth every cent.",
      author: "Ciarán & Aoife",
      source: "Private event",
      rating: 5
    },
    {
      text: "The Diavola with the 'nduja is addictive. I drove twenty minutes to Ballincollig just for it.",
      author: "Padraig K.",
      source: "Google Reviews",
      rating: 5
    }
  ],

  // ---------------------------------------------------------------------------
  // Instagram photo grid
  // ---------------------------------------------------------------------------
  instagramGrid: [
    { src: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&q=70", alt: "Pizza from the wood-fired oven"  },
    { src: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&q=70", alt: "Margherita with fresh basil"     },
    { src: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=200&q=70", alt: "Perfect blistered crust"          },
    { src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&q=70", alt: "Diavola with 'nduja"              },
    { src: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=200&q=70", alt: "Funghi with truffle"              },
    { src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&q=70",    alt: "Firebelly at a private event"    }
  ]

};
