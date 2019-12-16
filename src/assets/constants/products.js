import loripsum from './loripsum';

export default products = [
  {
    id: 1,
    title: "Simpanan Harian",
    desc: "Produk simpanan harian untuk kebutuhan transaksi bisnis perorangan maupun perusahaan dengan prinsip syariah.",
    image: require('../images/model-syariah1.jpg'),
    manfaat: [
      {
        title: '1. Aman dan Terjamin.'
      },
      {
        title: '2. Kemudahan dalam penyaluran zakat, infaq dan sedekah.'
      },
    ],
    fitur: [
      {
        title: '1. Buku Simpanan Syariah.'
      },
      {
        title: '2. Setoran awal minimum Rp. 250.000,-'
      },
      {
        title: '3. Biaya administrasi bulanan Rp. 10.000,-'
      },
    ],
  },
  {
    id: 2,
    title: "Simpanan Berjangka",
    desc: "Merupakan simpanan berjangka dalam waktu tertentu yang dikelola dengan prinsip mudharabah.",
    image: require('../images/model-syariah.jpg'),
    manfaat: [
      {
        title: '1. Gratis biaya administrasi dan biaya transfer (SKN & BCA) via counter.'
      },
      {
        title: '3. Kemudahan dalam penyaluran zakat, infaq, dan sedekah.'
      },
      {
        title: '4. Fasilitas Pemindahan Dana.'
      },
    ],
    fitur: [
      {
        title: '1. E-Statement.'
      },
      {
        title: '2. Setoran awal minimum Rp. 1.000.000,-'
      },
      {
        title: '3. Biaya administrasi bulanan Rp. 10.000,-'
      },
    ],
  },
  {
    id: 3,
    title: "Emas",
    desc: loripsum,
    image: require('../images/inves-emas.jpg')
  }
]