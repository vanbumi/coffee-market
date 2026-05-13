import { ShippingMethod } from '@/types/order';
import { calculateShippingCost, calculateTotalWeight } from './helpers';
import { CartItem } from '@/types/cart';

export const shippingMethods: ShippingMethod[] = [
  {
    id: 'jne-reg',
    name: 'JNE Reguler',
    estimatedDays: '3-5 hari',
    pricePerKg: 20000,
    minPrice: 30000,
  },
  {
    id: 'jne-yes',
    name: 'JNE YES',
    estimatedDays: '1-2 hari',
    pricePerKg: 50000,
    minPrice: 50000,
  },
  {
    id: 'sicepat',
    name: 'SiCepat',
    estimatedDays: '2-4 hari',
    pricePerKg: 25000,
    minPrice: 35000,
  },
  {
    id: 'jnt',
    name: 'J&T',
    estimatedDays: '2-5 hari',
    pricePerKg: 18000,
    minPrice: 30000,
  },
];

export const provinces = [
  'Aceh',
  'Sumatera Utara',
  'Sumatera Barat',
  'Riau',
  'Jambi',
  'Sumatera Selatan',
  'Bengkulu',
  'Lampung',
  'Bangka Belitung',
  'Kepulauan Riau',
  'DKI Jakarta',
  'Jawa Barat',
  'Jawa Tengah',
  'DI Yogyakarta',
  'Jawa Timur',
  'Banten',
  'Bali',
  'Nusa Tenggara Barat',
  'Nusa Tenggara Timur',
  'Kalimantan Barat',
  'Kalimantan Tengah',
  'Kalimantan Selatan',
  'Kalimantan Timur',
  'Kalimantan Utara',
  'Sulawesi Utara',
  'Sulawesi Tengah',
  'Sulawesi Selatan',
  'Sulawesi Tenggara',
  'Gorontalo',
  'Sulawesi Barat',
  'Maluku',
  'Maluku Utara',
  'Papua Barat',
  'Papua',
  'Papua Tengah',
  'Papua Pegunungan',
  'Papua Selatan',
  'Papua Barat Daya',
];

export const cities: Record<string, string[]> = {
  Aceh: ['Banda Aceh', 'Sabang', 'Lhokseumawe', 'Langsa', 'Aceh Besar', 'Pidie', 'Aceh Utara', 'Aceh Timur', 'Aceh Tengah', 'Gayo Lues'],
  'Sumatera Utara': ['Medan', 'Binjai', 'Pematangsiantar', 'Tebing Tinggi', 'Sibolga', 'Tanjung Balai', 'Padang Sidempuan', 'Gunungsitoli', 'Deli Serdang', 'Karo', 'Simalungun', 'Tapanuli Utara', 'Tapanuli Selatan', 'Mandailing Natal'],
  'Sumatera Barat': ['Padang', 'Bukittinggi', 'Payakumbuh', 'Solok', 'Sawahlunto', 'Padang Panjang', 'Pariaman', 'Agam', 'Tanah Datar', 'Pasaman', 'Limapuluh Kota'],
  Riau: ['Pekanbaru', 'Dumai', 'Kampar', 'Indragiri Hulu', 'Indragiri Hilir', 'Pelalawan', 'Rokan Hulu', 'Rokan Hilir', 'Siak', 'Bengkalis'],
  Jambi: ['Jambi', 'Sungai Penuh', 'Kerinci', 'Merangin', 'Sarolangun', 'Batanghari', 'Muaro Jambi', 'Tanjung Jabung Barat', 'Tanjung Jabung Timur'],
  'Sumatera Selatan': ['Palembang', 'Prabumulih', 'Lubuklinggau', 'Pagar Alam', 'Banyuasin', 'Musi Banyuasin', 'Musi Rawas', 'Ogan Komering Ilir', 'Ogan Komering Ulu'],
  Bengkulu: ['Bengkulu', 'Rejang Lebong', 'Bengkulu Utara', 'Bengkulu Selatan', 'Kaur', 'Seluma', 'Muko-muko'],
  Lampung: ['Bandar Lampung', 'Metro', 'Lampung Selatan', 'Lampung Tengah', 'Lampung Utara', 'Lampung Barat', 'Lampung Timur', 'Way Kanan', 'Tanggamus', 'Pringsewu', 'Pesawaran', 'Mesuji'],
  'Bangka Belitung': ['Pangkal Pinang', 'Bangka', 'Bangka Barat', 'Bangka Selatan', 'Bangka Tengah', 'Belitung', 'Belitung Timur'],
  'Kepulauan Riau': ['Tanjung Pinang', 'Batam', 'Karimun', 'Bintan', 'Natuna', 'Lingga', 'Kepulauan Anambas'],
  'DKI Jakarta': ['Jakarta Pusat', 'Jakarta Utara', 'Jakarta Barat', 'Jakarta Selatan', 'Jakarta Timur', 'Kepulauan Seribu'],
  'Jawa Barat': ['Bandung', 'Bogor', 'Bekasi', 'Depok', 'Cimahi', 'Tasikmalaya', 'Banjar', 'Cirebon', 'Sukabumi', 'Karawang', 'Purwakarta', 'Subang', 'Indramayu', 'Majalengka', 'Sumedang', 'Garut', 'Tasikmalaya', 'Ciamis', 'Kuningan', 'Pangandaran', 'Bandung Barat'],
  'Jawa Tengah': ['Semarang', 'Surakarta', 'Salatiga', 'Pekalongan', 'Tegal', 'Magelang', 'Cilacap', 'Banyumas', 'Purbalingga', 'Banjarnegara', 'Kebumen', 'Purworejo', 'Wonosobo', 'Temanggung', 'Magelang', 'Boyolali', 'Klaten', 'Sukoharjo', 'Karanganyar', 'Sragen', 'Grobogan', 'Blora', 'Rembang', 'Pati', 'Kudus', 'Jepara', 'Demak', 'Semarang', 'Kendal', 'Batang', 'Pekalongan', 'Pemalang', 'Tegal', 'Brebes'],
  'DI Yogyakarta': ['Yogyakarta', 'Sleman', 'Bantul', 'Gunung Kidul', 'Kulon Progo'],
  'Jawa Timur': ['Surabaya', 'Malang', 'Madiun', 'Kediri', 'Blitar', 'Pasuruan', 'Probolinggo', 'Batu', 'Mojokerto', 'Jember', 'Banyuwangi', 'Bondowoso', 'Situbondo', 'Sumenep', 'Pamekasan', 'Sampang', 'Bangkalan', 'Gresik', 'Lamongan', 'Tuban', 'Bojonegoro', 'Ngawi', 'Magetan', 'Ponorogo', 'Trenggalek', 'Tulungagung', 'Blitar', 'Kediri', 'Nganjuk', 'Madiun', 'Jombang', 'Mojokerto', 'Sidoarjo', 'Pasuruan', 'Probolinggo', 'Lumajang', 'Malang', 'Batu'],
  Banten: ['Serang', 'Tangerang', 'Cilegon', 'Tangerang Selatan', 'Pandeglang', 'Lebak', 'Tangerang'],
  Bali: ['Denpasar', 'Badung', 'Bangli', 'Buleleng', 'Gianyar', 'Jembrana', 'Karangasem', 'Klungkung', 'Tabanan'],
  'Nusa Tenggara Barat': ['Mataram', 'Bima', 'Lombok Barat', 'Lombok Tengah', 'Lombok Timur', 'Lombok Utara', 'Sumbawa', 'Sumbawa Barat', 'Dompu', 'Bima'],
  'Nusa Tenggara Timur': ['Kupang', 'Ende', 'Maumere', 'Labuan Bajo', 'Sikka', 'Flores Timur', 'Ngada', 'Manggarai', 'Manggarai Barat', 'Manggarai Timur', 'Alor', 'Lembata', 'Belu', 'Malaka', 'Timor Tengah Utara', 'Timor Tengah Selatan', 'Kupang', 'Rote Ndao', 'Sabu Raijua', 'Sumba Barat', 'Sumba Timur', 'Sumba Tengah', 'Sumba Barat Daya'],
  'Kalimantan Barat': ['Pontianak', 'Singkawang', 'Sambas', 'Bengkayang', 'Landak', 'Mempawah', 'Sanggau', 'Ketapang', 'Sintang', 'Kapuas Hulu', 'Sekadau', 'Melawi', 'Kayong Utara', 'Kubu Raya'],
  'Kalimantan Tengah': ['Palangka Raya', 'Kotawaringin Barat', 'Kotawaringin Timur', 'Kapuas', 'Katingan', 'Seruyan', 'Sukamara', 'Lamandau', 'Gunung Mas', 'Pulang Pisau', 'Murung Raya', 'Barito Utara', 'Barito Selatan', 'Barito Timur'],
  'Kalimantan Selatan': ['Banjarmasin', 'Banjarbaru', 'Tanah Laut', 'Kotabaru', 'Banjar', 'Barito Kuala', 'Tapin', 'Hulu Sungai Selatan', 'Hulu Sungai Tengah', 'Hulu Sungai Utara', 'Tabalong', 'Balangan', 'Tanah Bumbu'],
  'Kalimantan Timur': ['Samarinda', 'Balikpapan', 'Bontang', 'Kutai Kartanegara', 'Kutai Timur', 'Kutai Barat', 'Berau', 'Penajam Paser Utara', 'Paser', 'Mahakam Ulu'],
  'Kalimantan Utara': ['Tarakan', 'Bulungan', 'Malinau', 'Nunukan', 'Tana Tidung'],
  'Sulawesi Utara': ['Manado', 'Bitung', 'Tomohon', 'Kotamobagu', 'Minahasa', 'Minahasa Selatan', 'Minahasa Tenggara', 'Minahasa Utara', 'Bolaang Mongondow', 'Bolaang Mongondow Selatan', 'Bolaang Mongondow Timur', 'Bolaang Mongondow Utara', 'Kepulauan Sangihe', 'Kepulauan Talaud', 'Kepulauan Siau Tagulandang Biaro'],
  'Sulawesi Tengah': ['Palu', 'Poso', 'Donggala', 'Buol', 'Toli-toli', 'Parigi Moutong', 'Tojo Una-una', 'Banggai', 'Banggai Laut', 'Banggai Kepulauan', 'Morowali', 'Morowali Utara', 'Sigi'],
  'Sulawesi Selatan': ['Makassar', 'Parepare', 'Palopo', 'Gowa', 'Maros', 'Pangkajene Kepulauan', 'Barru', 'Bone', 'Soppeng', 'Wajo', 'Sidenreng Rappang', 'Pinrang', 'Enrekang', 'Luwu', 'Luwu Timur', 'Luwu Utara', 'Tana Toraja', 'Toraja Utara', 'Jeneponto', 'Bantaeng', 'Bulukumba', 'Sinjai', 'Takalar', 'Kepulauan Selayar'],
  'Sulawesi Tenggara': ['Kendari', 'Baubau', 'Konawe', 'Konawe Utara', 'Konawe Selatan', 'Kolaka', 'Kolaka Utara', 'Kolaka Timur', 'Muna', 'Muna Barat', 'Buton', 'Buton Utara', 'Buton Tengah', 'Buton Selatan', 'Bombana', 'Wakatobi', 'Kepulauan Wowoni'],
  Gorontalo: ['Gorontalo', 'Gorontalo Utara', 'Gorontalo Selatan', 'Boalemo', 'Pohuwato', 'Bone Bolango'],
  'Sulawesi Barat': ['Mamuju', 'Mamasa', 'Majene', 'Polowali Mandar', 'Pasangkayu', 'Mamuju Tengah'],
  Maluku: ['Ambon', 'Tual', 'Maluku Tengah', 'Maluku Tenggara', 'Maluku Tenggara Barat', 'Seram Bagian Barat', 'Seram Bagian Timur', 'Buru', 'Buru Selatan', 'Kepulauan Aru', 'Maluku Barat Daya'],
  'Maluku Utara': ['Ternate', 'Tidore Kepulauan', 'Halmahera Barat', 'Halmahera Timur', 'Halmahera Tengah', 'Halmahera Utara', 'Halmahera Selatan', 'Kepulauan Sula', 'Pulau Morotai', 'Pulau Taliabu'],
  'Papua Barat': ['Manokwari', 'Sorong', 'Sorong Selatan', 'Raja Ampat', 'Teluk Bintuni', 'Teluk Wondama', 'Kaimana', 'Tambrauw', 'Maybrat'],
  Papua: ['Jayapura', 'Biak Numfor', 'Kepulauan Yapen', 'Mamberamo Raya', 'Sarmi', 'Keerom', 'Waropen', 'Supiori', 'Jayapura', 'Puncak Jaya', 'Nabire', 'Mimika', 'Yahukimo', 'Tolikara', 'Paniai', 'Dogiyai', 'Intan Jaya', 'Deiyai'],
  'Papua Tengah': ['Nabire', 'Mimika', 'Puncak Jaya', 'Puncak', 'Dogiyai', 'Intan Jaya', 'Deiyai'],
  'Papua Pegunungan': ['Jayawijaya', 'Lanny Jaya', 'Mamberamo Tengah', 'Nduga', 'Tolikara', 'Yahukimo', 'Yalimo', 'Pegunungan Bintang'],
  'Papua Selatan': ['Merauke', 'Mappi', 'Asmat', 'Bovendigoel'],
  'Papua Barat Daya': ['Sorong', 'Sorong Selatan', 'Raja Ampat', 'Tambrauw', 'Maybrat'],
};

export function getCitiesByProvince(province: string): string[] {
  return cities[province] || [];
}

export function getShippingCost(
  items: CartItem[],
  methodId: string
): number {
  const method = shippingMethods.find((m) => m.id === methodId);
  if (!method) return 0;
  const totalWeight = calculateTotalWeight(items);
  return calculateShippingCost(totalWeight, method.pricePerKg, method.minPrice);
}
