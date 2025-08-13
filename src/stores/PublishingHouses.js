import { defineStore } from "pinia";

export const usePublishingHouseStore = defineStore("publishingHouse", {
  state: () => ({
     publishingHouses: [
  {
    id: 1,
    name: 'Penguin Random House',
    url: 'https://www.penguinrandomhouse.com/',
    img: 'https://placehold.co/600x595/000000/ffffff?text=PRH',
    titlesPublishedAnnually: 15000,
    description: 'A global publishing leader formed in 2013, home to over 300 diverse and prestigious imprints. They publish bestselling fiction, non-fiction, and children\'s books.',
    annualRevenueMillions: 4200, // In USD
    imprintCount: 320,
    country: 'USA',
    email: 'contact@penguinrandomhouse.com',
    phone: '+1-212-782-9000',
    foundedYear: 2013,
    // Fixed: Added missing properties that were referenced in template
    ordersCount: 1250,
    spendMuch: 2850000,
    nmbBook: 45000
  },
  {
    id: 2,
    name: 'HarperCollins',
    url: 'https://www.harpercollins.com/',
    img: 'https://placehold.co/600x595/0055a3/ffffff?text=HC',
    titlesPublishedAnnually: 10000,
    description: 'One of the "Big Five" English-language publishing companies with a rich history stretching back to the early 19th century. Known for a wide range of genres.',
    annualRevenueMillions: 2200, // In USD
    imprintCount: 120,
    country: 'USA',
    email: 'info@harpercollins.com',
    phone: '+1-212-207-7000',
    foundedYear: 1817,
    ordersCount: 980,
    spendMuch: 1950000,
    nmbBook: 32000
  },
  {
    id: 3,
    name: 'Hachette Livre',
    url: 'https://www.hachette.com/en/',
    img: 'https://placehold.co/600x595/1f4d89/ffffff?text=Hachette',
    titlesPublishedAnnually: 20000,
    description: 'A major French publishing group and one of the largest in the world. They have a strong presence in educational and general literature markets globally.',
    annualRevenueMillions: 3100, // In Euros
    imprintCount: 150,
    country: 'France',
    email: 'communication@hachette-livre.fr',
    phone: '+33-1-43-92-30-00',
    foundedYear: 1826,
    ordersCount: 1450,
    spendMuch: 3200000,
    nmbBook: 58000
  },
  {
    id: 4,
    name: 'Scholastic Corporation',
    url: 'https://www.scholastic.com/',
    img: 'https://placehold.co/600x595/e6001a/ffffff?text=Scholastic',
    titlesPublishedAnnually: 750,
    description: 'The world\'s largest publisher and distributor of children\'s books, renowned for its book fairs, book clubs, and popular franchises like Harry Potter and The Hunger Games.',
    annualRevenueMillions: 1700, // In USD
    imprintCount: 25,
    country: 'USA',
    email: 'customercare@scholastic.com',
    phone: '+1-800-724-6527',
    foundedYear: 1920,
    ordersCount: 650,
    spendMuch: 1200000,
    nmbBook: 18000
  },
  {
    id: 5,
    name: 'Macmillan Publishers',
    url: 'https://us.macmillan.com/',
    img: 'https://placehold.co/600x595/003471/ffffff?text=Macmillan',
    titlesPublishedAnnually: 2500,
    description: 'A global trade publishing company with a reputation for award-winning literary fiction, non-fiction, and academic works. Part of the Holtzbrinck Publishing Group.',
    annualRevenueMillions: 1400, // In USD
    imprintCount: 45,
    country: 'USA',
    email: 'customerservice@macmillan.com',
    phone: '+1-646-307-5151',
    foundedYear: 1843,
    ordersCount: 420,
    spendMuch: 980000,
    nmbBook: 12500
  }
]
  }),
  actions: {
    addPublisher(publisher) {
      const newPublisher = {
        id: this.publishingHouses.length + 1,
        ...publisher
      };
      this.publishingHouses.push(newPublisher);
    }
  }
})
