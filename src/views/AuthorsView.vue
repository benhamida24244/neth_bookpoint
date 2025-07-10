<script setup lang="ts">
import AuthorsList from '../components/Author/AuthorsPage/AuthorsList.vue';
const authors = [
  {
    id: 1,
    name: 'Stephen King',
    url: 'https://www.barnesandnoble.com/b/contributor/stephen-king/_/N-2k9Z8q8',
    img: 'https://prodimage.images-bn.com/pimages/9781501142970_p0_v1_s600x595.jpg',
    nmbBook: 87
  },
  {
    id: 2,
    name: 'J.K. Rowling',
    url: 'https://www.barnesandnoble.com/b/contributor/j-k-rowling/_/N-2k9Z8q8Z1z141yl',
    img: 'https://prodimage.images-bn.com/pimages/9781338878929_p0_v1_s600x595.jpg',
    nmbBook: 24
  },
  {
    id: 3,
    name: 'Colleen Hoover',
    url: 'https://www.barnesandnoble.com/b/contributor/colleen-hoover/_/N-2k9Z8q8Z1z141yc',
    img: 'https://prodimage.images-bn.com/pimages/9781501110344_p0_v1_s600x595.jpg',
    nmbBook: 22
  },
  {
    id: 4,
    name: 'James Patterson',
    url: 'https://www.barnesandnoble.com/b/contributor/james-patterson/_/N-2k9Z8q8Z1z141yo',
    img: 'https://prodimage.images-bn.com/pimages/9780316407090_p0_v1_s600x595.jpg',
    nmbBook: 350
  },
  {
    id: 5,
    name: 'Agatha Christie',
    url: 'https://www.barnesandnoble.com/b/contributor/agatha-christie/_/N-2k9Z8q8Z1z141y9',
    img: 'https://prodimage.images-bn.com/pimages/9780062073488_p0_v2_s600x595.jpg',
    nmbBook: 80
  },
  {
    id: 6,
    name: 'George R. R. Martin',
    url: 'https://www.barnesandnoble.com/b/contributor/george-r-r-martin/_/N-2k9Z8q8Z1z141yt',
    img: 'https://prodimage.images-bn.com/pimages/9780553573404_p0_v2_s600x595.jpg',
    nmbBook: 34
  },
  {
    id: 7,
    name: 'Brandon Sanderson',
    url: 'https://www.barnesandnoble.com/b/contributor/brandon-sanderson/_/N-2k9Z8q8Z1z141xe',
    img: 'https://prodimage.images-bn.com/pimages/9780765376671_p0_v3_s600x595.jpg',
    nmbBook: 58
  },
  {
    id: 8,
    name: 'Margaret Atwood',
    url: 'https://www.barnesandnoble.com/b/contributor/margaret-atwood/_/N-2k9Z8q8Z1z141yx',
    img: 'https://prodimage.images-bn.com/pimages/9780385490818_p0_v2_s600x595.jpg',
    nmbBook: 65
  }
];
</script>

<template>
  <AuthorsList :authors="authors"/>
</template>
