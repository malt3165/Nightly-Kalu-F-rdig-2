export interface Club {
  id: string;
  name: string;
  type: string;
  rating: number;
  reviews: number;
  distance?: string;
  address: string;
  description: string;
  checkedIn: number;
  latitude: number;
  longitude: number;
  image: string;
  events: Event[];
  checkedInUsers: User[];
  openingHours: string;
  priceRange: string;
  trustpilotRating: number;
  trustpilotReviews: number;
  city: string;
}

export interface Event {
  date: string;
  title: string;
  time: string;
  price: string;
}

export interface User {
  name: string;
  avatar: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

// Real Danish clubs with actual locations and Trustpilot-style reviews
export const danishClubs: Club[] = [
  // København (8 klubber)
  {
    id: '1',
    name: 'Rustik',
    type: 'Natklub',
    rating: 4.5,
    reviews: 892,
    address: 'Gothersgade 8B, 1123 København K',
    description: 'Eksklusiv natklub i hjertet af København med elektronisk musik og VIP-områder.',
    checkedIn: 0,
    latitude: 55.6823,
    longitude: 12.5721,
    image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800',
    events: [
      { date: '2025-01-25', title: 'Electronic Night', time: '23:00', price: '200 kr' },
      { date: '2025-01-26', title: 'VIP Sessions', time: '22:30', price: '250 kr' },
    ],
    checkedInUsers: [
      { name: 'Anna', avatar: '👩' },
      { name: 'Lars', avatar: '👨' },
    ],
    openingHours: 'Åbent til 06:00',
    priceRange: '150-300 kr',
    trustpilotRating: 4.5,
    trustpilotReviews: 456,
    city: 'København',
  },
  {
    id: '2',
    name: 'Heidis Bier Bar',
    type: 'Bar & Natklub',
    rating: 4.3,
    reviews: 1234,
    address: 'Vestergade 2D, 1456 København K',
    description: 'Populær bar og natklub med øl, cocktails og god stemning til sent på natten.',
    checkedIn: 0,
    latitude: 55.6761,
    longitude: 12.5683,
    image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800',
    events: [
      { date: '2025-01-25', title: 'Øl & Fest', time: '21:00', price: '120 kr' },
      { date: '2025-01-27', title: 'Weekend Party', time: '22:00', price: '150 kr' },
    ],
    checkedInUsers: [
      { name: 'Emma', avatar: '👩' },
      { name: 'Mikkel', avatar: '👨' },
    ],
    openingHours: 'Åbent til 05:00',
    priceRange: '100-200 kr',
    trustpilotRating: 4.3,
    trustpilotReviews: 678,
    city: 'København',
  },
  {
    id: '3',
    name: 'Lola Club',
    type: 'Natklub',
    rating: 4.4,
    reviews: 756,
    address: 'Knabrostraede 3, 1210 København K',
    description: 'Trendy natklub med elektronisk musik og moderne atmosfære i centrum af København.',
    checkedIn: 0,
    latitude: 55.6794,
    longitude: 12.5803,
    image: 'https://images.pexels.com/photos/274192/pexels-photo-274192.jpeg?auto=compress&cs=tinysrgb&w=800',
    events: [
      { date: '2025-01-25', title: 'Electronic Vibes', time: '23:00', price: '180 kr' },
      { date: '2025-01-26', title: 'House Party', time: '22:00', price: '160 kr' },
    ],
    checkedInUsers: [
      { name: 'Sofia', avatar: '👧' },
      { name: 'Oliver', avatar: '👦' },
    ],
    openingHours: 'Åbent til 05:00',
    priceRange: '140-220 kr',
    trustpilotRating: 4.4,
    trustpilotReviews: 389,
    city: 'København',
  },
  {
    id: '4',
    name: 'Søpavillonen',
    type: 'Bar & Natklub',
    rating: 4.2,
    reviews: 567,
    address: 'Søpavillonen, Sortedams Sø, 2200 København N',
    description: 'Unik natklub ved søen med fantastisk udsigt og hyggelig atmosfære.',
    checkedIn: 0,
    latitude: 55.6889,
    longitude: 12.5531,
    image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800',
    events: [
      { date: '2025-01-25', title: 'Lakeside Party', time: '21:30', price: '140 kr' },
      { date: '2025-01-26', title: 'Sunset Vibes', time: '20:00', price: '120 kr' },
    ],
    checkedInUsers: [
      { name: 'Viktor', avatar: '👨' },
      { name: 'Isabella', avatar: '👩' },
    ],
    openingHours: 'Åbent til 03:00',
    priceRange: '100-180 kr',
    trustpilotRating: 4.2,
    trustpilotReviews: 234,
    city: 'København',
  },
  {
    id: '5',
    name: 'Rumors',
    type: 'Natklub',
    rating: 4.1,
    reviews: 445,
    address: 'Studiestræde 31, 1455 København K',
    description: 'Populær natklub med elektronisk musik og energisk dansegulv.',
    checkedIn: 0,
    latitude: 55.6761,
    longitude: 12.5683,
    image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800',
    events: [
      { date: '2025-01-25', title: 'Electronic Night', time: '23:00', price: '150 kr' },
      { date: '2025-01-26', title: 'Dance Floor', time: '22:30', price: '130 kr' },
    ],
    checkedInUsers: [
      { name: 'Kasper', avatar: '👨' },
      { name: 'Line', avatar: '👩' },
    ],
    openingHours: 'Åbent til 05:00',
    priceRange: '110-180 kr',
    trustpilotRating: 4.1,
    trustpilotReviews: 298,
    city: 'København',
  },
  {
    id: '6',
    name: 'Arch',
    type: 'Natklub',
    rating: 4.6,
    reviews: 678,
    address: 'Nyhavn 31, 1051 København K',
    description: 'Eksklusiv natklub med arkitektonisk design og premium oplevelse.',
    checkedIn: 0,
    latitude: 55.6794,
    longitude: 12.5912,
    image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800',
    events: [
      { date: '2025-01-26', title: 'Exclusive Night', time: '22:00', price: '250 kr' },
      { date: '2025-01-27', title: 'Premium Experience', time: '23:00', price: '300 kr' },
    ],
    checkedInUsers: [
      { name: 'Caroline', avatar: '👩' },
      { name: 'Magnus', avatar: '👨' },
    ],
    openingHours: 'Åbent til 06:00',
    priceRange: '200-400 kr',
    trustpilotRating: 4.6,
    trustpilotReviews: 445,
    city: 'København',
  },
  {
    id: '7',
    name: 'Dorsia',
    type: 'Natklub',
    rating: 4.7,
    reviews: 892,
    address: 'Warwicks Vej 5, 2000 Frederiksberg',
    description: 'Ultra-eksklusiv natklub med streng dørmand og A-list gæster.',
    checkedIn: 0,
    latitude: 55.6761,
    longitude: 12.5329,
    image: 'https://images.pexels.com/photos/274192/pexels-photo-274192.jpeg?auto=compress&cs=tinysrgb&w=800',
    events: [
      { date: '2025-01-26', title: 'Elite Night', time: '23:00', price: '400 kr' },
      { date: '2025-01-27', title: 'VIP Experience', time: '22:00', price: '500 kr' },
    ],
    checkedInUsers: [
      { name: 'Alexander', avatar: '👨' },
      { name: 'Victoria', avatar: '👩' },
    ],
    openingHours: 'Åbent til 06:00',
    priceRange: '300-600 kr',
    trustpilotRating: 4.7,
    trustpilotReviews: 567,
    city: 'København',
  },
  {
    id: '8',
    name: 'Hive',
    type: 'Natklub',
    rating: 4.3,
    reviews: 534,
    address: 'Krystalgade 16, 1172 København K',
    description: 'Underground natklub med rå atmosfære og elektronisk musik.',
    checkedIn: 0,
    latitude: 55.6823,
    longitude: 12.5721,
    image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800',
    events: [
      { date: '2025-01-25', title: 'Underground Night', time: '23:30', price: '160 kr' },
      { date: '2025-01-27', title: 'Electronic Hive', time: '24:00', price: '180 kr' },
    ],
    checkedInUsers: [
      { name: 'Tobias', avatar: '👨' },
      { name: 'Camilla', avatar: '👩' },
    ],
    openingHours: 'Åbent til 07:00',
    priceRange: '130-220 kr',
    trustpilotRating: 4.3,
    trustpilotReviews: 298,
    city: 'København',
  },

  // Aarhus (5 klubber)
  {
    id: '9',
    name: 'Voxhall',
    type: 'Koncertsal & Natklub',
    rating: 4.4,
    reviews: 567,
    address: 'Voxhallgade 4, 8000 Aarhus C',
    description: 'Ikonisk venue med live koncerter og natklub. Aarhus\' bedste musikoplevelse.',
    checkedIn: 0,
    latitude: 56.1572,
    longitude: 10.2107,
    image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800',
    events: [
      { date: '2025-01-25', title: 'Live Rock Night', time: '21:00', price: '180 kr' },
      { date: '2025-01-26', title: 'Electronic After', time: '23:00', price: '150 kr' },
    ],
    checkedInUsers: [
      { name: 'Mathias', avatar: '👨' },
      { name: 'Julie', avatar: '👩' },
    ],
    openingHours: 'Åbent til 05:00',
    priceRange: '120-250 kr',
    trustpilotRating: 4.4,
    trustpilotReviews: 389,
    city: 'Aarhus',
  },
  {
    id: '10',
    name: 'Train Natklub',
    type: 'Natklub',
    rating: 4.2,
    reviews: 445,
    address: 'Toldbodgade 6, 8000 Aarhus C',
    description: 'Aarhus\' største natklub med flere dansegulve og varieret musik.',
    checkedIn: 0,
    latitude: 56.1629,
    longitude: 10.2134,
    image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800',
    events: [
      { date: '2025-01-25', title: 'Weekend Party', time: '22:00', price: '120 kr' },
      { date: '2025-01-27', title: 'Student Night', time: '21:30', price: '80 kr' },
    ],
    checkedInUsers: [
      { name: 'Andreas', avatar: '👨' },
      { name: 'Ida', avatar: '👩' },
    ],
    openingHours: 'Åbent til 06:00',
    priceRange: '80-180 kr',
    trustpilotRating: 4.2,
    trustpilotReviews: 298,
    city: 'Aarhus',
  },
  {
    id: '11',
    name: 'Studenterhuset',
    type: 'Bar & Natklub',
    rating: 4.0,
    reviews: 334,
    address: 'Nordre Ringgade 3, 8000 Aarhus C',
    description: 'Populær studenterbar med billige drinks og god stemning.',
    checkedIn: 0,
    latitude: 56.1677,
    longitude: 10.2039,
    image: 'https://images.pexels.com/photos/274192/pexels-photo-274192.jpeg?auto=compress&cs=tinysrgb&w=800',
    events: [
      { date: '2025-01-25', title: 'Student Friday', time: '20:00', price: '60 kr' },
      { date: '2025-01-26', title: 'Live Band', time: '21:00', price: '80 kr' },
    ],
    checkedInUsers: [
      { name: 'Morten', avatar: '👨' },
      { name: 'Signe', avatar: '👩' },
    ],
    openingHours: 'Åbent til 02:00',
    priceRange: '40-120 kr',
    trustpilotRating: 4.0,
    trustpilotReviews: 234,
    city: 'Aarhus',
  },
  {
    id: '12',
    name: 'Musikcaféen',
    type: 'Bar & Natklub',
    rating: 4.1,
    reviews: 289,
    address: 'Mejlgade 53, 8000 Aarhus C',
    description: 'Hyggelig musikcafé med live musik og natklub i kælderen.',
    checkedIn: 0,
    latitude: 56.1598,
    longitude: 10.2026,
    image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800',
    events: [
      { date: '2025-01-25', title: 'Acoustic Night', time: '20:30', price: '100 kr' },
      { date: '2025-01-26', title: 'DJ Set', time: '22:00', price: '120 kr' },
    ],
    checkedInUsers: [
      { name: 'Rasmus', avatar: '👨' },
      { name: 'Nanna', avatar: '👩' },
    ],
    openingHours: 'Åbent til 03:00',
    priceRange: '80-150 kr',
    trustpilotRating: 4.1,
    trustpilotReviews: 198,
    city: 'Aarhus',
  },
  {
    id: '13',
    name: 'Radar',
    type: 'Natklub',
    rating: 4.3,
    reviews: 412,
    address: 'Nørre Allé 66, 8000 Aarhus C',
    description: 'Elektronisk natklub med fokus på techno og house musik.',
    checkedIn: 0,
    latitude: 56.1634,
    longitude: 10.1987,
    image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800',
    events: [
      { date: '2025-01-25', title: 'Techno Night', time: '23:00', price: '150 kr' },
      { date: '2025-01-27', title: 'House Session', time: '22:30', price: '130 kr' },
    ],
    checkedInUsers: [
      { name: 'Viktor', avatar: '👨' },
      { name: 'Astrid', avatar: '👩' },
    ],
    openingHours: 'Åbent til 06:00',
    priceRange: '100-200 kr',
    trustpilotRating: 4.3,
    trustpilotReviews: 267,
    city: 'Aarhus',
  },

  // Odense (4 klubber)
  {
    id: '14',
    name: 'Dexter',
    type: 'Natklub',
    rating: 4.2,
    reviews: 523,
    address: 'Vindegade 76, 5000 Odense C',
    description: 'Odenses største natklub med flere barer og dansegulve.',
    checkedIn: 0,
    latitude: 55.4038,
    longitude: 10.4024,
    image: 'https://images.pexels.com/photos/274192/pexels-photo-274192.jpeg?auto=compress&cs=tinysrgb&w=800',
    events: [
      { date: '2025-01-25', title: 'Saturday Night', time: '22:00', price: '120 kr' },
      { date: '2025-01-26', title: 'Student Night', time: '21:00', price: '80 kr' },
    ],
    checkedInUsers: [
      { name: 'Nikolaj', avatar: '👨' },
      { name: 'Katrine', avatar: '👩' },
    ],
    openingHours: 'Åbent til 05:00',
    priceRange: '80-180 kr',
    trustpilotRating: 4.2,
    trustpilotReviews: 345,
    city: 'Odense',
  },
  {
    id: '15',
    name: 'Boogie Dance Café',
    type: 'Bar & Natklub',
    rating: 4.0,
    reviews: 298,
    address: 'Brandts Passage 37, 5000 Odense C',
    description: 'Hyggelig bar med live musik og dans til de små timer.',
    checkedIn: 0,
    latitude: 55.4015,
    longitude: 10.3885,
    image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800',
    events: [
      { date: '2025-01-25', title: 'Live Jazz', time: '21:00', price: '100 kr' },
      { date: '2025-01-26', title: 'Dance Night', time: '22:30', price: '90 kr' },
    ],
    checkedInUsers: [
      { name: 'Benjamin', avatar: '👨' },
      { name: 'Freja', avatar: '👩' },
    ],
    openingHours: 'Åbent til 03:00',
    priceRange: '70-140 kr',
    trustpilotRating: 4.0,
    trustpilotReviews: 189,
    city: 'Odense',
  },
  {
    id: '16',
    name: 'Storms Pakhus',
    type: 'Bar & Natklub',
    rating: 4.1,
    reviews: 367,
    address: 'Overgade 58, 5000 Odense C',
    description: 'Rustik bar i gammelt pakhus med unik atmosfære.',
    checkedIn: 0,
    latitude: 55.3959,
    longitude: 10.3883,
    image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800',
    events: [
      { date: '2025-01-25', title: 'Warehouse Party', time: '21:30', price: '110 kr' },
      { date: '2025-01-27', title: 'Vintage Night', time: '20:00', price: '95 kr' },
    ],
    checkedInUsers: [
      { name: 'Christian', avatar: '👨' },
      { name: 'Malou', avatar: '👩' },
    ],
    openingHours: 'Åbent til 04:00',
    priceRange: '80-160 kr',
    trustpilotRating: 4.1,
    trustpilotReviews: 223,
    city: 'Odense',
  },
  {
    id: '17',
    name: 'Rytmeposten',
    type: 'Natklub',
    rating: 3.9,
    reviews: 234,
    address: 'Østre Stationsvej 27, 5000 Odense C',
    description: 'Elektronisk natklub med fokus på underground musik.',
    checkedIn: 0,
    latitude: 55.4089,
    longitude: 10.4156,
    image: 'https://images.pexels.com/photos/274192/pexels-photo-274192.jpeg?auto=compress&cs=tinysrgb&w=800',
    events: [
      { date: '2025-01-25', title: 'Underground Night', time: '23:00', price: '130 kr' },
      { date: '2025-01-26', title: 'Electronic Vibes', time: '22:00', price: '120 kr' },
    ],
    checkedInUsers: [
      { name: 'Lucas', avatar: '👨' },
      { name: 'Simone', avatar: '👩' },
    ],
    openingHours: 'Åbent til 06:00',
    priceRange: '90-170 kr',
    trustpilotRating: 3.9,
    trustpilotReviews: 156,
    city: 'Odense',
  },
];

export const clubReviews: { [clubId: string]: Review[] } = {
  '1': [
    {
      id: '1',
      author: 'Mads K.',
      rating: 5,
      text: 'Fantastisk elektronisk musik og god stemning! De bedste DJs i København.',
      date: '2025-01-15',
    },
    {
      id: '2',
      author: 'Sarah L.',
      rating: 4,
      text: 'Rigtig fed klub, men kan være lidt dyrt. Musikken er dog i top.',
      date: '2025-01-10',
    },
    {
      id: '3',
      author: 'Thomas H.',
      rating: 4,
      text: 'Autentisk underground stemning. Perfekt for elektronisk musik elskere.',
      date: '2025-01-08',
    },
  ],
  '2': [
    {
      id: '1',
      author: 'Anna M.',
      rating: 5,
      text: 'Vega er simpelthen fantastisk! Både koncerter og natklub er i verdensklasse.',
      date: '2025-01-14',
    },
    {
      id: '2',
      author: 'Peter J.',
      rating: 4,
      text: 'Rigtig god venue med varieret musik. Lidt dyrt, men det er det værd.',
      date: '2025-01-12',
    },
  ],
  '3': [
    {
      id: '1',
      author: 'Maria S.',
      rating: 4,
      text: 'Fed stemning på Nørrebro! Hip hop musikken er spot on.',
      date: '2025-01-13',
    },
    {
      id: '2',
      author: 'Lars N.',
      rating: 5,
      text: 'Rust er det bedste sted for hip hop i København. Kommer altid tilbage!',
      date: '2025-01-11',
    },
  ],
};