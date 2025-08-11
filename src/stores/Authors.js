import { defineStore } from "pinia";

export const useAuthorStore = defineStore("authors" ,{
  state:() => ({
    authors: [
      {
    id: 1,
    name: 'Stephen King',
    url: 'https://www.barnesandnoble.com/b/contributor/stephen-king/_/N-2k9Z8q8',
    img: 'https://prodimage.images-bn.com/pimages/9781501142970_p0_v1_s600x595.jpg',
    nmbBook: 87,
    description: 'An icon of horror, supernatural fiction, and suspense. Known as the "King of Horror," his captivating stories have terrified and thrilled readers for decades.',
    SpendMuch: 1500,
    Orders_count: 120,
    Country: 'American',
    email: 'stephen.king@example.com',
    phone: '+1-555-0101',
    Registration_date: '2020-01-15'
  },
  {
    id: 2,
    name: 'J.K. Rowling',
    url: 'https://www.barnesandnoble.com/b/contributor/j-k-rowling/_/N-2k9Z8q8Z1z141yl',
    img: 'https://prodimage.images-bn.com/pimages/9781338878929_p0_v1_s600x595.jpg',
    nmbBook: 24,
    description: 'The creative genius behind the enchanting world of Harry Potter. Her magical storytelling has inspired a global generation of readers and dreamers.',
    SpendMuch: 1500,
    Orders_count: 120,
    Country: 'British',
    email: 'jk.rowling@example.com',
    phone: '+44-555-0102',
    Registration_date: '2019-08-22'
  },
  {
    id: 3,
    name: 'Colleen Hoover',
    url: 'https://www.barnesandnoble.com/b/contributor/colleen-hoover/_/N-2k9Z8q8Z1z141yc',
    img: 'https://prodimage.images-bn.com/pimages/9781501110344_p0_v1_s600x595.jpg',
    nmbBook: 22,
    description: 'A powerhouse in contemporary romance and young adult fiction. Hoover is celebrated for her emotionally charged novels that explore love, heartbreak, and resilience.',
    SpendMuch: 2200,
    Orders_count: 89,
    Country: 'American',
    email: 'colleen.hoover@example.com',
    phone: '+1-555-0103',
    Registration_date: '2021-03-10'
  },
  {
    id: 4,
    name: 'James Patterson',
    url: 'https://www.barnesandnoble.com/b/contributor/james-patterson/_/N-2k9Z8q8Z1z141yo',
    img: 'https://prodimage.images-bn.com/pimages/9780316407090_p0_v1_s600x595.jpg',
    nmbBook: 350,
    description: 'One of the world\'s most prolific and bestselling authors. Patterson is a master of the thriller genre, known for his fast-paced plots and unforgettable characters.',
    SpendMuch: 3500,
    Orders_count: 156,
    Country: 'American',
    email: 'james.patterson@example.com',
    phone: '+1-555-0104',
    Registration_date: '2018-11-05'
  },
  {
    id: 5,
    name: 'Agatha Christie',
    url: 'https://www.barnesandnoble.com/b/contributor/agatha-christie/_/N-2k9Z8q8Z1z141y9',
    img: 'https://prodimage.images-bn.com/pimages/9780062073488_p0_v2_s600x595.jpg',
    nmbBook: 80,
    description: 'The undisputed "Queen of Crime." Christie penned timeless detective novels, creating iconic sleuths like Hercule Poirot and Miss Marple who continue to captivate.',
    SpendMuch: 1800,
    Orders_count: 95,
    Country: 'British',
    email: 'agatha.christie@example.com',
    phone: '+44-555-0105',
    Registration_date: '2017-06-12'
  },
  {
    id: 6,
    name: 'George R. R. Martin',
    url: 'https://www.barnesandnoble.com/b/contributor/george-r-r-martin/_/N-2k9Z8q8Z1z141yt',
    img: 'https://prodimage.images-bn.com/pimages/9780553573404_p0_v2_s600x595.jpg',
    nmbBook: 34,
    description: 'The architect of the epic fantasy saga "A Song of Ice and Fire." Martin is renowned for his intricate world-building and morally complex characters.',
    SpendMuch: 2800,
    Orders_count: 134,
    Country: 'American',
    email: 'george.martin@example.com',
    phone: '+1-555-0106',
    Registration_date: '2019-02-28'
  },
  {
    id: 7,
    name: 'Brandon Sanderson',
    url: 'https://www.barnesandnoble.com/b/contributor/brandon-sanderson/_/N-2k9Z8q8Z1z141xe',
    img: 'https://prodimage.images-bn.com/pimages/9780765376671_p0_v3_s600x595.jpg',
    nmbBook: 58,
    description: 'A master of modern fantasy, famous for his detailed magic systems and the interconnected "Cosmere" universe. Sanderson is a prolific and beloved storyteller.',
    SpendMuch: 2100,
    Orders_count: 98,
    Country: 'American',
    email: 'brandon.sanderson@example.com',
    phone: '+1-555-0107',
    Registration_date: '2020-09-14'
  },
  {
    id: 8,
    name: 'Margaret Atwood',
    url: 'https://www.barnesandnoble.com/b/contributor/margaret-atwood/_/N-2k9Z8q8Z1z141yx',
    img: 'https://prodimage.images-bn.com/pimages/9780385490818_p0_v2_s600x595.jpg',
    nmbBook: 65,
    description: 'A literary titan whose work spans speculative fiction, historical fiction, and poetry. Atwood is acclaimed for her sharp social commentary and visionary novels like "The Handmaid\'s Tale."',
    SpendMuch: 1900,
    Orders_count: 87,
    Country: 'Canadian',
    email: 'margaret.atwood@example.com',
    phone: '+1-555-0108',
    Registration_date: '2018-04-03'
  }
    ]
  }),
  
}
)
