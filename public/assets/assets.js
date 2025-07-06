import Ndole from './Ndolé.jpg';
import Kilishi from './Kilishi.webp';
import Eru from './Eru.jpg';
import Kpwem from './Kpwem.jpg';
import MbongoTchobi from './Mbongo Tchobi.jpg';
import Kanda from './Kanda.jpg';
import FufuAndOkraSoup from './Fufu and Okra Soup.jpg';
import LaBouillie from './La Bouillie.jpg';
import DjamaDjama from './Djama Djama.jpg';
import Kossam from './Kossam.webp';
import AchuAndYellowSoup from './Achu and Yellow Soup.jpg';
import CornFufuAndNjamaNjama from './Corn Fufu and Njama Njama.jpg';
import Koki from './Koki.jpg';
import TaroAndYellowSauce from './Taro and Yellow Sauce.jpg';
import Ekwang from './Ekwang.jpg';
import BongoChobi from './Bongo Chobi.jpg';
import EruAndWaterfufu from './EruandWaterfufu.jpg';
import KwacocoBible from './KwacocoBible.jpg';

import logo from './logo.png'
import hero_img from './hero_img.png'
import cart_icon from './cart_icon.png'
import bin_icon from './bin_icon.png'
import dropdown_icon from './dropdown_icon.png'
import exchange_icon from './exchange_icon.png'
import profile_icon from './profile_icon.png'
import quality_icon from './quality_icon.png'
import search_icon from './search_icon.png'
import star_dull_icon from './star_dull_icon.png'
import star_icon from './star_icon.png'
import support_img from './support_img.png'
import menu_icon from './menu_icon.png'
import about_img from './about_img.png'
import contact_img from './contact_img.png'
import razorpay_logo from './razorpay_logo.png'
import stripe_logo from './stripe_logo.png'
import cross_icon from './cross_icon.png'

export const assets = {
    logo,
    hero_img,
    cart_icon,
    dropdown_icon,
    exchange_icon,
    profile_icon,
    quality_icon,
    search_icon,
    star_dull_icon,
    star_icon,
    bin_icon,
    support_img,
    menu_icon,
    about_img,
    contact_img,
    razorpay_logo,
    stripe_logo,
    cross_icon
}

// Cameroon Regions, Tribes, and Traditional Meals
export const products = [
  // Adamawa Region
  {
    _id: "cm-adamawa-1",
    name: "Ndolé",
    description: "A rich stew made with bitter leaves, groundnuts, and meat or fish. Popular among the Gbaya and Duru tribes.",
    price: 2500, // FCFA
    image: [Ndole],
    category: "Adamawa",
    subCategory: "Gbaya, Duru",
    sizes: ["Plate"],
    date: "2024-06-19T00:00:00Z",
    bestseller: true
  },
  {
    _id: "cm-adamawa-2",
    name: "Kilishi",
    description: "Spicy dried meat snack, similar to beef jerky. Common among the Fulani.",
    price: 1500,
    image: [Kilishi],
    category: "Adamawa",
    subCategory: "Fulani",
    sizes: ["Pack"],
    date: "2024-06-19T00:00:00Z",
    bestseller: false
  },
  // Centre Region
  {
    _id: "cm-centre-1",
    name: "Eru",
    description: "A vegetable soup made with eru leaves, waterleaf, and assorted meats. Popular among the Ewondo and Bassa.",
    price: 2000,
    image: [Eru],
    category: "Centre",
    subCategory: "Ewondo, Bassa",
    sizes: ["Plate"],
    date: "2024-06-19T00:00:00Z",
    bestseller: true
  },
  {
    _id: "cm-centre-2",
    name: "Kpwem",
    description: "Cassava leaves stew, a delicacy of the Bafia tribe.",
    price: 1800,
    image: [Kpwem],
    category: "Centre",
    subCategory: "Bafia",
    sizes: ["Plate"],
    date: "2024-06-19T00:00:00Z",
    bestseller: false
  },
  // East Region
  {
    _id: "cm-east-1",
    name: "Mbongo Tchobi",
    description: "Spicy black stew made with fish and local spices. Popular among the Maka and Gbaya.",
    price: 2200,
    image: [MbongoTchobi],
    category: "East",
    subCategory: "Maka, Gbaya",
    sizes: ["Plate"],
    date: "2024-06-19T00:00:00Z",
    bestseller: true
  },
  {
    _id: "cm-east-2",
    name: "Kanda",
    description: "Meatballs made from groundnuts and spices, a Baka delicacy.",
    price: 1700,
    image: [Kanda],
    category: "East",
    subCategory: "Baka",
    sizes: ["Plate"],
    date: "2024-06-19T00:00:00Z",
    bestseller: false
  },
  // Far North Region
  {
    _id: "cm-far-north-1",
    name: "Fufu and Okra Soup",
    description: "Fufu served with okra soup, a staple among the Kotoko and Mandara.",
    price: 1600,
    image: [FufuAndOkraSoup],
    category: "Far North",
    subCategory: "Kotoko, Mandara",
    sizes: ["Plate"],
    date: "2024-06-19T00:00:00Z",
    bestseller: true
  },
  {
    _id: "cm-far-north-2",
    name: "La Bouillie",
    description: "Millet porridge, a breakfast favorite of the Fulani.",
    price: 800,
    image: [LaBouillie],
    category: "Far North",
    subCategory: "Fulani",
    sizes: ["Bowl"],
    date: "2024-06-19T00:00:00Z",
    bestseller: false
  },
  // Littoral Region
  {
    _id: "cm-littoral-1",
    name: "Ndolé",
    description: "Bitterleaf and groundnut stew, a signature dish of the Duala tribe.",
    price: 2500,
    image: [Ndole],
    category: "Littoral",
    subCategory: "Duala",
    sizes: ["Plate"],
    date: "2024-06-19T00:00:00Z",
    bestseller: true
  },
  {
    _id: "cm-littoral-2",
    name: "Mbongo Tchobi",
    description: "Black stew with fish, a favorite among the Bakoko.",
    price: 2200,
    image: [MbongoTchobi],
    category: "Littoral",
    subCategory: "Bakoko",
    sizes: ["Plate"],
    date: "2024-06-19T00:00:00Z",
    bestseller: false
  },
  // North Region
  {
    _id: "cm-north-1",
    name: "Kossam",
    description: "Fermented milk, a Fulani specialty.",
    price: 1000,
    image: [Kossam],
    category: "North",
    subCategory: "Fulani",
    sizes: ["Bottle"],
    date: "2024-06-19T00:00:00Z",
    bestseller: true
  },
  {
    _id: "cm-north-2",
    name: "Djama Djama",
    description: "Huckleberry leaves cooked with groundnut paste, enjoyed by the Toupouri.",
    price: 1500,
    image: [DjamaDjama],
    category: "North",
    subCategory: "Toupouri",
    sizes: ["Plate"],
    date: "2024-06-19T00:00:00Z",
    bestseller: false
  },
  // Northwest Region
  {
    _id: "cm-northwest-1",
    name: "Achu and Yellow Soup",
    description: "Pounded cocoyams with spicy yellow soup, a traditional meal of the Bamenda Grassfields tribes.",
    price: 3000,
    image: [AchuAndYellowSoup],
    category: "Northwest",
    subCategory: "Bamenda, Kom, Nso",
    sizes: ["Plate"],
    date: "2024-06-19T00:00:00Z",
    bestseller: true
  },
  {
    _id: "cm-northwest-2",
    name: "Corn Fufu and Njama Njama",
    description: "Corn fufu served with huckleberry leaves, a Kom and Nso favorite.",
    price: 1800,
    image: [CornFufuAndNjamaNjama],
    category: "Northwest",
    subCategory: "Kom, Nso",
    sizes: ["Plate"],
    date: "2024-06-19T00:00:00Z",
    bestseller: false
  },
  // West Region
  {
    _id: "cm-west-1",
    name: "Koki",
    description: "Steamed black-eyed pea pudding, a Bamileke delicacy.",
    price: 2000,
    image: [Koki],
    category: "West",
    subCategory: "Bamileke",
    sizes: ["Wrap"],
    date: "2024-06-19T00:00:00Z",
    bestseller: true
  },
  {
    _id: "cm-west-2",
    name: "Taro and Yellow Sauce",
    description: "Taro root served with spicy yellow sauce, a Bafut and Bamileke specialty.",
    price: 2500,
    image: [TaroAndYellowSauce],
    category: "West",
    subCategory: "Bafut, Bamileke",
    sizes: ["Plate"],
    date: "2024-06-19T00:00:00Z",
    bestseller: false
  },
  // South Region
  {
    _id: "cm-south-1",
    name: "Ekwang",
    description: "Grated cocoyams wrapped in leaves and cooked with palm oil, a Bulu and Fang delicacy.",
    price: 2200,
    image: [Ekwang],
    category: "South",
    subCategory: "Bulu, Fang",
    sizes: ["Plate"],
    date: "2024-06-19T00:00:00Z",
    bestseller: true
  },
  {
    _id: "cm-south-2",
    name: "Bongo Chobi",
    description: "Spicy black sauce with fish, a Beti favorite.",
    price: 2100,
    image: [BongoChobi],
    category: "South",
    subCategory: "Beti",
    sizes: ["Plate"],
    date: "2024-06-19T00:00:00Z",
    bestseller: false
  },
  // Southwest Region
  {
    _id: "cm-southwest-1",
    name: "Eru and Waterfufu",
    description: "Eru leaves cooked with waterleaf and served with waterfufu, a Bayangi and Bakweri specialty.",
    price: 2500,
    image: [EruAndWaterfufu],
    category: "Southwest",
    subCategory: "Bayangi, Bakweri",
    sizes: ["Plate"],
    date: "2024-06-19T00:00:00Z",
    bestseller: true
  },
  {
    _id: "cm-southwest-2",
    name: "Kwacoco Bible",
    description: "Grated cocoyam mixed with fish and spices, wrapped in leaves. Popular among the Bakweri.",
    price: 2000,
    image: [KwacocoBible],
    category: "Southwest",
    subCategory: "Bakweri",
    sizes: ["Wrap"],
    date: "2024-06-19T00:00:00Z",
    bestseller: false
  }
];