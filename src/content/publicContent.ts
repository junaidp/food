import type { Language } from '../lib/translations';

// Copy for the public, indexable pages (landing excluded — its strings live in translations.ts).
// Keep English and Urdu in sync: both versions are pre-rendered and linked with hreflang.

export type PublicPage = 'home' | 'howItWorks' | 'faq' | 'about' | 'foodSafety' | 'forBusinesses' | 'blog';

export interface PageText {
  navLabel: string;
  title: string;
  description: string;
}

export interface ContentSection {
  heading: string;
  paragraphs?: string[];
  items?: { title?: string; text: string }[];
  ordered?: boolean;
}

export interface ContentPageText {
  h1: string;
  intro: string;
  sections: ContentSection[];
}

export interface FaqItem {
  q: string;
  a: string;
}

export const pageText: Record<PublicPage, Record<Language, PageText>> = {
  home: {
    en: {
      navLabel: 'Home',
      title: 'FoodShare – Share Free Home-Cooked Food With Your Neighbours',
      description:
        'Cooked too much? Share a plate with someone nearby for free. FoodShare shows free home-cooked food near you on a map. Request it, pick it up with a code, waste less.',
    },
    ur: {
      navLabel: 'ہوم',
      title: 'فوڈ شیئر – اپنے پڑوسیوں کے ساتھ گھر کا بنا کھانا مفت بانٹیں',
      description:
        'کھانا زیادہ بن گیا؟ ایک پلیٹ کسی قریبی شخص کے ساتھ مفت بانٹیں۔ فوڈ شیئر نقشے پر آپ کے قریب مفت کھانا دکھاتا ہے۔ درخواست کریں، کوڈ کے ساتھ وصول کریں، ضیاع کم کریں۔',
    },
  },
  howItWorks: {
    en: {
      navLabel: 'How it works',
      title: 'How FoodShare Works – Share or Pick Up Free Food Near You',
      description:
        'Post spare food in a minute, or find free food near you on a live map. See every step of sharing and picking up food on FoodShare, from posting to the 6-digit pickup code.',
    },
    ur: {
      navLabel: 'یہ کیسے کام کرتا ہے',
      title: 'فوڈ شیئر کیسے کام کرتا ہے – اپنے قریب مفت کھانا بانٹیں یا حاصل کریں',
      description:
        'ایک منٹ میں اضافی کھانا پوسٹ کریں، یا لائیو نقشے پر اپنے قریب مفت کھانا تلاش کریں۔ پوسٹ کرنے سے لے کر 6 ہندسوں کے پک اپ کوڈ تک ہر مرحلہ دیکھیں۔',
    },
  },
  faq: {
    en: {
      navLabel: 'FAQ',
      title: 'FoodShare FAQ – Free Food Sharing Questions Answered',
      description:
        'Is FoodShare really free? Who can share or pick up food? How do pickup codes work, and is it safe? Answers to the most common questions about sharing food with people nearby.',
    },
    ur: {
      navLabel: 'عام سوالات',
      title: 'فوڈ شیئر – عام سوالات اور جوابات',
      description:
        'کیا فوڈ شیئر واقعی مفت ہے؟ کون کھانا بانٹ یا لے سکتا ہے؟ پک اپ کوڈ کیسے کام کرتا ہے اور کیا یہ محفوظ ہے؟ قریبی لوگوں کے ساتھ کھانا بانٹنے کے بارے میں عام سوالات کے جواب۔',
    },
  },
  about: {
    en: {
      navLabel: 'About',
      title: 'About FoodShare – Neighbours Sharing Food, Reducing Food Waste',
      description:
        'FoodShare is a free community app where anyone can share spare home-cooked food with people nearby. Our mission: less food in the bin, more people fed, with dignity.',
    },
    ur: {
      navLabel: 'ہمارے بارے میں',
      title: 'فوڈ شیئر کے بارے میں – پڑوسی کھانا بانٹیں، ضیاع کم کریں',
      description:
        'فوڈ شیئر ایک مفت کمیونٹی ایپ ہے جہاں کوئی بھی اپنا اضافی گھر کا کھانا قریبی لوگوں کے ساتھ بانٹ سکتا ہے۔ ہمارا مقصد: کم کھانا ضائع ہو، زیادہ لوگ عزت سے کھائیں۔',
    },
  },
  foodSafety: {
    en: {
      navLabel: 'Food safety',
      title: 'Food Safety Tips for Sharing Home-Cooked Food | FoodShare',
      description:
        'How to share and pick up food safely: what to share, how to pack and label it, how long cooked food keeps, allergy notes and safe pickups. Simple tips for everyone.',
    },
    ur: {
      navLabel: 'کھانے کی حفاظت',
      title: 'گھر کا کھانا محفوظ طریقے سے بانٹنے کی تجاویز | فوڈ شیئر',
      description:
        'کھانا محفوظ طریقے سے کیسے بانٹیں اور وصول کریں: کیا بانٹیں، کیسے پیک اور لیبل کریں، پکا ہوا کھانا کب تک ٹھیک رہتا ہے، الرجی اور محفوظ پک اپ کی آسان تجاویز۔',
    },
  },
  forBusinesses: {
    en: {
      navLabel: 'For businesses',
      title: 'Share Surplus Food From Your Restaurant, Café or Event | FoodShare',
      description:
        'Restaurants, bakeries, caterers and event venues: give surplus food to people nearby for free instead of throwing it away. Post in a minute, hand over with a pickup code.',
    },
    ur: {
      navLabel: 'کاروبار کے لیے',
      title: 'اپنے ریسٹورنٹ، بیکری یا تقریب کا اضافی کھانا بانٹیں | فوڈ شیئر',
      description:
        'ریسٹورنٹ، بیکری، کیٹرر اور شادی ہال: اضافی کھانا پھینکنے کے بجائے قریبی لوگوں کو مفت دیں۔ ایک منٹ میں پوسٹ کریں اور پک اپ کوڈ کے ساتھ حوالے کریں۔',
    },
  },
  blog: {
    en: {
      navLabel: 'Blog',
      title: 'FoodShare Blog – Food Sharing, Leftovers and Reducing Food Waste',
      description:
        'Guides and ideas on sharing food with neighbours, finding free food near you, using leftovers and reducing food waste at home, from the FoodShare team.',
    },
    ur: {
      navLabel: 'بلاگ',
      title: 'فوڈ شیئر بلاگ – کھانا بانٹنا، بچا ہوا کھانا اور ضیاع میں کمی',
      description:
        'پڑوسیوں کے ساتھ کھانا بانٹنے، اپنے قریب مفت کھانا تلاش کرنے، بچے ہوئے کھانے کے استعمال اور ضیاع کم کرنے کے بارے میں رہنمائی اور خیالات۔',
    },
  },
};

export const howItWorksContent: Record<Language, ContentPageText> = {
  en: {
    h1: 'How FoodShare works',
    intro:
      'FoodShare connects people who have a little extra food with people nearby who would like it. There are no fees and no payments — just neighbours sharing food. Here is how it works on each side.',
    sections: [
      {
        heading: 'Sharing food',
        ordered: true,
        items: [
          { title: 'Create a free account', text: 'Sign up with your phone number and choose to share food.' },
          {
            title: 'Post what you have',
            text: 'Say what the food is, how many people it serves and how long it is available. Pin your pickup spot on the map — your door, your building entrance or a nearby landmark.',
          },
          {
            title: 'Accept a request',
            text: 'People nearby can request a serving. You get a notification and decide whether to accept. Servings left update automatically as requests are accepted.',
          },
          {
            title: 'Hand it over',
            text: 'When they arrive, ask for their 6-digit pickup code and confirm it in the app. That is one plate shared instead of thrown away.',
          },
        ],
      },
      {
        heading: 'Picking up free food',
        ordered: true,
        items: [
          { title: 'Create a free account', text: 'Sign up with your phone number and choose to find food.' },
          {
            title: 'Open the map',
            text: 'See free food shared near you, how many servings are left and how long each one is available.',
          },
          {
            title: 'Request a serving',
            text: 'Tap to request. When the person sharing accepts, you receive a unique 6-digit pickup code and have one hour to collect.',
          },
          {
            title: 'Pick it up',
            text: 'Follow the directions to the pickup spot, let the sharer know you have arrived and show your code. Afterwards you can rate the pickup.',
          },
        ],
      },
      {
        heading: 'Built for trust',
        items: [
          { text: 'Unique pickup codes make sure food goes to the person who requested it.' },
          { text: 'One serving per person, so more people get a share.' },
          { text: 'Ratings after every pickup help good sharers stand out.' },
          { text: 'Anyone can be reported or blocked, and reports are reviewed by our team.' },
        ],
      },
    ],
  },
  ur: {
    h1: 'فوڈ شیئر کیسے کام کرتا ہے',
    intro:
      'فوڈ شیئر ان لوگوں کو جن کے پاس تھوڑا اضافی کھانا ہو، ان قریبی لوگوں سے جوڑتا ہے جو اسے لینا چاہیں۔ کوئی فیس یا ادائیگی نہیں — بس پڑوسی آپس میں کھانا بانٹتے ہیں۔ دونوں طرف سے یہ ایسے کام کرتا ہے۔',
    sections: [
      {
        heading: 'کھانا بانٹنا',
        ordered: true,
        items: [
          { title: 'مفت اکاؤنٹ بنائیں', text: 'اپنے فون نمبر سے سائن اپ کریں اور کھانا بانٹنے کا انتخاب کریں۔' },
          {
            title: 'جو ہے وہ پوسٹ کریں',
            text: 'بتائیں کہ کھانا کیا ہے، کتنے لوگوں کے لیے ہے اور کب تک دستیاب ہے۔ نقشے پر پک اپ کی جگہ لگائیں — آپ کا دروازہ، عمارت کا داخلی راستہ یا قریبی نشانی۔',
          },
          {
            title: 'درخواست قبول کریں',
            text: 'قریبی لوگ ایک حصے کی درخواست کر سکتے ہیں۔ آپ کو اطلاع ملتی ہے اور آپ فیصلہ کرتے ہیں کہ قبول کرنا ہے یا نہیں۔ باقی حصے خود بخود اپ ڈیٹ ہوتے ہیں۔',
          },
          {
            title: 'کھانا حوالے کریں',
            text: 'جب وہ پہنچیں تو ان کا 6 ہندسوں کا پک اپ کوڈ پوچھیں اور ایپ میں تصدیق کریں۔ ایک پلیٹ ضائع ہونے کے بجائے بانٹ دی گئی۔',
          },
        ],
      },
      {
        heading: 'مفت کھانا حاصل کرنا',
        ordered: true,
        items: [
          { title: 'مفت اکاؤنٹ بنائیں', text: 'اپنے فون نمبر سے سائن اپ کریں اور کھانا تلاش کرنے کا انتخاب کریں۔' },
          {
            title: 'نقشہ کھولیں',
            text: 'اپنے قریب بانٹا گیا مفت کھانا دیکھیں، کتنے حصے باقی ہیں اور ہر ایک کب تک دستیاب ہے۔',
          },
          {
            title: 'ایک حصے کی درخواست کریں',
            text: 'درخواست کے لیے ٹیپ کریں۔ جب بانٹنے والا قبول کرے گا تو آپ کو 6 ہندسوں کا منفرد پک اپ کوڈ ملے گا اور وصولی کے لیے ایک گھنٹہ ہوگا۔',
          },
          {
            title: 'کھانا وصول کریں',
            text: 'پک اپ کی جگہ تک راستہ دیکھیں، بانٹنے والے کو پہنچنے کی اطلاع دیں اور اپنا کوڈ دکھائیں۔ بعد میں آپ درجہ بندی کر سکتے ہیں۔',
          },
        ],
      },
      {
        heading: 'اعتماد کے لیے بنایا گیا',
        items: [
          { text: 'منفرد پک اپ کوڈ یقینی بناتے ہیں کہ کھانا اسی شخص کو ملے جس نے درخواست کی۔' },
          { text: 'ہر شخص کے لیے ایک حصہ، تاکہ زیادہ لوگوں کو حصہ ملے۔' },
          { text: 'ہر پک اپ کے بعد درجہ بندی اچھے بانٹنے والوں کو نمایاں کرتی ہے۔' },
          { text: 'کسی کو بھی رپورٹ یا بلاک کیا جا سکتا ہے، اور ہماری ٹیم رپورٹس کا جائزہ لیتی ہے۔' },
        ],
      },
    ],
  },
};

export const aboutContent: Record<Language, ContentPageText> = {
  en: {
    h1: 'About FoodShare',
    intro:
      'Every day, good food is thrown away while someone a few streets away would have been glad to eat it. FoodShare exists to close that gap, one plate at a time.',
    sections: [
      {
        heading: 'The idea',
        paragraphs: [
          'If you cook pasta tonight and one plate is left over, you should not have to throw it away. Put it in a box, post it on FoodShare, and someone around you can come and pick it up. That is the whole idea — simple, local and free.',
          'Anyone can share and anyone can pick up. No money changes hands and nobody is asked why they want the food.',
        ],
      },
      {
        heading: 'Why it matters',
        paragraphs: [
          'According to the UN Environment Programme’s Food Waste Index Report 2024, more than a billion tonnes of food were wasted in 2022, and households were responsible for the largest share. Much of that is perfectly good food — the extra portion, the leftover pot, the bread that will not be finished in time.',
          'Food in the bin wastes the water, energy and money that went into it, and creates greenhouse gases as it rots. Sharing it with a neighbour does the opposite: someone eats, and nothing is wasted.',
        ],
      },
      {
        heading: 'What we believe',
        items: [
          { title: 'Always free', text: 'Food on FoodShare is shared, never sold.' },
          { title: 'Dignity first', text: 'Pickups use a private code. No questions, no explanations.' },
          { title: 'Local by design', text: 'The map shows food close to you, so sharing takes minutes, not hours.' },
          { title: 'Safe for everyone', text: 'Pickup codes, ratings, reporting and review keep the community trustworthy.' },
        ],
      },
    ],
  },
  ur: {
    h1: 'فوڈ شیئر کے بارے میں',
    intro:
      'ہر روز اچھا کھانا پھینک دیا جاتا ہے جبکہ چند گلیاں دور کوئی اسے خوشی سے کھا لیتا۔ فوڈ شیئر اسی فاصلے کو ختم کرنے کے لیے ہے، ایک وقت میں ایک پلیٹ۔',
    sections: [
      {
        heading: 'خیال',
        paragraphs: [
          'اگر آج آپ نے پاستا بنایا اور ایک پلیٹ بچ گئی تو اسے پھینکنے کی ضرورت نہیں۔ اسے ڈبے میں رکھیں، فوڈ شیئر پر پوسٹ کریں، اور آپ کے آس پاس کوئی آ کر لے جائے۔ بس یہی خیال ہے — آسان، مقامی اور مفت۔',
          'کوئی بھی بانٹ سکتا ہے اور کوئی بھی لے سکتا ہے۔ کوئی پیسہ نہیں لیا جاتا اور کسی سے نہیں پوچھا جاتا کہ اسے کھانا کیوں چاہیے۔',
        ],
      },
      {
        heading: 'یہ کیوں اہم ہے',
        paragraphs: [
          'اقوام متحدہ کے ماحولیاتی پروگرام کی فوڈ ویسٹ انڈیکس رپورٹ 2024 کے مطابق 2022 میں ایک ارب ٹن سے زیادہ کھانا ضائع ہوا، اور سب سے بڑا حصہ گھروں سے تھا۔ اس میں بہت سا بالکل اچھا کھانا ہوتا ہے — اضافی حصہ، بچا ہوا سالن، وہ روٹی جو وقت پر ختم نہ ہو سکی۔',
          'کوڑے میں جانے والا کھانا اس پر لگے پانی، توانائی اور پیسے کو ضائع کرتا ہے اور سڑنے پر گرین ہاؤس گیسیں پیدا کرتا ہے۔ پڑوسی کے ساتھ بانٹنا اس کے برعکس ہے: کوئی کھاتا ہے اور کچھ ضائع نہیں ہوتا۔',
        ],
      },
      {
        heading: 'ہمارے اصول',
        items: [
          { title: 'ہمیشہ مفت', text: 'فوڈ شیئر پر کھانا بانٹا جاتا ہے، بیچا نہیں جاتا۔' },
          { title: 'عزت سب سے پہلے', text: 'وصولی ایک نجی کوڈ سے ہوتی ہے۔ نہ سوال، نہ وضاحت۔' },
          { title: 'مقامی', text: 'نقشہ آپ کے قریب کھانا دکھاتا ہے، اس لیے بانٹنے میں گھنٹے نہیں، منٹ لگتے ہیں۔' },
          { title: 'سب کے لیے محفوظ', text: 'پک اپ کوڈ، درجہ بندی، رپورٹنگ اور جائزہ کمیونٹی کو قابل اعتماد رکھتے ہیں۔' },
        ],
      },
    ],
  },
};

export const foodSafetyContent: Record<Language, ContentPageText> = {
  en: {
    h1: 'Food safety tips for sharing food',
    intro:
      'Sharing food is a kindness, and sharing it safely keeps it that way. These simple guidelines apply whether you are sharing a plate or picking one up.',
    sections: [
      {
        heading: 'Good food to share',
        items: [
          { text: 'Meals cooked the same day and kept covered.' },
          { text: 'Extra rice, curry, daal, pasta or soup from a pot nobody has eaten from.' },
          { text: 'Bread, roti and baked goods.' },
          { text: 'Whole fruit and vegetables.' },
          { text: 'Sealed packaged food before its use-by date.' },
        ],
      },
      {
        heading: 'Please do not share',
        items: [
          { text: 'Cooked food left at room temperature for more than 2 hours (1 hour in hot weather above 32°C / 90°F).' },
          { text: 'Food from a plate someone has already eaten from.' },
          { text: 'Anything that smells, looks or tastes off.' },
          { text: 'Packaged food past its use-by date.' },
        ],
      },
      {
        heading: 'Packing and labelling',
        items: [
          { text: 'Use a clean container with a lid, or wrap the food well.' },
          { text: 'Write the name of the dish and when it was cooked.' },
          { text: 'Mention common allergens such as nuts, dairy, eggs, gluten or seafood in your post.' },
          { text: 'Keep hot food hot, or cool it quickly and keep it in the fridge until pickup.' },
        ],
      },
      {
        heading: 'After you pick up',
        items: [
          { text: 'Check that the food looks and smells right. If in doubt, leave it out.' },
          { text: 'Eat it soon, or refrigerate it within 2 hours.' },
          { text: 'Reheat cooked food until it is steaming hot all the way through (75°C / 165°F).' },
          { text: 'Eat shared cooked food within 24 hours.' },
        ],
      },
      {
        heading: 'Safe pickups',
        items: [
          { text: 'Choose a pickup spot you are comfortable with, such as your door or a building entrance.' },
          { text: 'Always confirm the 6-digit pickup code in the app.' },
          { text: 'Report anything that does not feel right — our team reviews every report.' },
        ],
      },
      {
        heading: 'A note',
        paragraphs: ['These tips are general guidance. Please also follow any food safety rules where you live.'],
      },
    ],
  },
  ur: {
    h1: 'کھانا محفوظ طریقے سے بانٹنے کی تجاویز',
    intro:
      'کھانا بانٹنا ایک نیکی ہے، اور محفوظ طریقے سے بانٹنا اسے نیکی ہی رہنے دیتا ہے۔ یہ آسان ہدایات بانٹنے اور لینے والے دونوں کے لیے ہیں۔',
    sections: [
      {
        heading: 'بانٹنے کے لیے اچھا کھانا',
        items: [
          { text: 'اسی دن پکا ہوا اور ڈھکا ہوا کھانا۔' },
          { text: 'ایسی دیگچی سے اضافی چاول، سالن، دال، پاستا یا سوپ جس سے کسی نے کھایا نہ ہو۔' },
          { text: 'روٹی، نان اور بیکری کی اشیاء۔' },
          { text: 'ثابت پھل اور سبزیاں۔' },
          { text: 'میعاد ختم ہونے سے پہلے کا بند پیکٹ والا کھانا۔' },
        ],
      },
      {
        heading: 'براہ کرم یہ نہ بانٹیں',
        items: [
          { text: 'پکا ہوا کھانا جو 2 گھنٹے سے زیادہ کمرے کے درجہ حرارت پر رہا ہو (32°C سے زیادہ گرمی میں 1 گھنٹہ)۔' },
          { text: 'ایسی پلیٹ کا کھانا جس سے کوئی پہلے کھا چکا ہو۔' },
          { text: 'کوئی بھی چیز جس کی بو، شکل یا ذائقہ خراب ہو۔' },
          { text: 'میعاد ختم ہونے کے بعد کا پیکٹ والا کھانا۔' },
        ],
      },
      {
        heading: 'پیکنگ اور لیبل',
        items: [
          { text: 'ڈھکن والا صاف ڈبہ استعمال کریں یا کھانا اچھی طرح لپیٹیں۔' },
          { text: 'کھانے کا نام اور پکانے کا وقت لکھیں۔' },
          { text: 'اپنی پوسٹ میں عام الرجی والی چیزیں جیسے میوے، دودھ، انڈے، گندم یا سمندری غذا بتائیں۔' },
          { text: 'گرم کھانا گرم رکھیں، یا جلدی ٹھنڈا کر کے پک اپ تک فریج میں رکھیں۔' },
        ],
      },
      {
        heading: 'وصول کرنے کے بعد',
        items: [
          { text: 'دیکھیں کہ کھانے کی شکل اور بو ٹھیک ہے۔ شک ہو تو نہ کھائیں۔' },
          { text: 'جلدی کھائیں، یا 2 گھنٹے کے اندر فریج میں رکھیں۔' },
          { text: 'پکے ہوئے کھانے کو اچھی طرح بھاپ نکلنے تک گرم کریں (75°C)۔' },
          { text: 'بانٹا ہوا پکا کھانا 24 گھنٹے کے اندر کھا لیں۔' },
        ],
      },
      {
        heading: 'محفوظ پک اپ',
        items: [
          { text: 'ایسی جگہ چنیں جہاں آپ مطمئن ہوں، جیسے آپ کا دروازہ یا عمارت کا داخلی راستہ۔' },
          { text: 'ہمیشہ ایپ میں 6 ہندسوں کے پک اپ کوڈ کی تصدیق کریں۔' },
          { text: 'جو بھی ٹھیک نہ لگے اسے رپورٹ کریں — ہماری ٹیم ہر رپورٹ کا جائزہ لیتی ہے۔' },
        ],
      },
      {
        heading: 'نوٹ',
        paragraphs: ['یہ تجاویز عمومی رہنمائی ہیں۔ براہ کرم اپنے علاقے کے کھانے کی حفاظت کے قوانین پر بھی عمل کریں۔'],
      },
    ],
  },
};

export const forBusinessesContent: Record<Language, ContentPageText> = {
  en: {
    h1: 'Share surplus food from your restaurant, café or event',
    intro:
      'Restaurants, bakeries, caterers, hotels and event venues end most days with good food that will not be sold. FoodShare lets you give it to people nearby for free in a minute, instead of putting it in the bin.',
    sections: [
      {
        heading: 'Why share your surplus',
        items: [
          { title: 'Less waste', text: 'Unsold food is eaten instead of thrown away, which also means fewer bags in your bins.' },
          { title: 'Good for your community', text: 'Your neighbours eat well and remember who shared with them.' },
          { title: 'No cost, no paperwork', text: 'FoodShare is free. There are no fees, contracts or collection schedules.' },
          { title: 'You stay in control', text: 'Share when you have surplus, accept the requests you want and stop at any time.' },
        ],
      },
      {
        heading: 'What businesses share',
        items: [
          { text: 'Unsold bread, naan, cakes and pastries at closing time.' },
          { text: 'Prepared meals and trays that never reached the counter or buffet.' },
          { text: 'Untouched surplus from weddings, conferences and catered events.' },
          { text: 'Sealed packaged food and drinks before their use-by date.' },
        ],
      },
      {
        heading: 'How it works',
        ordered: true,
        items: [
          { title: 'Create a free sharing account', text: 'Sign up with your phone number and choose to share food.' },
          { title: 'Post your surplus', text: 'Say what it is, how many servings you have and the pickup window. Pin your shop or venue on the map.' },
          { title: 'Accept requests', text: 'People nearby request servings. Servings left update automatically as you accept.' },
          { title: 'Hand over at the counter', text: 'Each person shows a 6-digit pickup code, which you confirm in the app.' },
        ],
      },
      {
        heading: 'Tips for businesses',
        items: [
          { text: 'Post 30 to 60 minutes before closing so people have time to arrive.' },
          { text: 'Pack food in single portions so it is quick to hand over.' },
          { text: 'Label dishes and mention common allergens.' },
          { text: 'Follow the food safety rules that apply to your business, and our food safety tips.' },
        ],
      },
    ],
  },
  ur: {
    h1: 'اپنے ریسٹورنٹ، بیکری یا تقریب کا اضافی کھانا بانٹیں',
    intro:
      'ریسٹورنٹ، بیکری، کیٹرر، ہوٹل اور شادی ہال اکثر دن کے آخر میں ایسا اچھا کھانا رکھتے ہیں جو بکے گا نہیں۔ فوڈ شیئر کے ذریعے آپ اسے کوڑے میں ڈالنے کے بجائے ایک منٹ میں قریبی لوگوں کو مفت دے سکتے ہیں۔',
    sections: [
      {
        heading: 'اضافی کھانا کیوں بانٹیں',
        items: [
          { title: 'کم ضیاع', text: 'نہ بکنے والا کھانا پھینکنے کے بجائے کھایا جاتا ہے۔' },
          { title: 'کمیونٹی کے لیے اچھا', text: 'آپ کے پڑوسی اچھا کھاتے ہیں اور یاد رکھتے ہیں کہ کس نے بانٹا۔' },
          { title: 'کوئی خرچ یا کاغذی کارروائی نہیں', text: 'فوڈ شیئر مفت ہے۔ نہ فیس، نہ معاہدہ، نہ وصولی کا شیڈول۔' },
          { title: 'اختیار آپ کے پاس', text: 'جب اضافی ہو تب بانٹیں، جو درخواست چاہیں قبول کریں اور جب چاہیں روک دیں۔' },
        ],
      },
      {
        heading: 'کاروبار کیا بانٹتے ہیں',
        items: [
          { text: 'بند ہونے کے وقت نہ بکنے والی روٹی، نان، کیک اور پیسٹری۔' },
          { text: 'تیار کھانا اور ٹرے جو کاؤنٹر یا بوفے تک نہیں پہنچیں۔' },
          { text: 'شادیوں، کانفرنسوں اور تقریبات کا اچھوتا اضافی کھانا۔' },
          { text: 'میعاد ختم ہونے سے پہلے کا بند پیکٹ والا کھانا اور مشروبات۔' },
        ],
      },
      {
        heading: 'یہ کیسے کام کرتا ہے',
        ordered: true,
        items: [
          { title: 'مفت اکاؤنٹ بنائیں', text: 'اپنے فون نمبر سے سائن اپ کریں اور کھانا بانٹنے کا انتخاب کریں۔' },
          { title: 'اضافی کھانا پوسٹ کریں', text: 'بتائیں کیا ہے، کتنے حصے ہیں اور کب تک لیا جا سکتا ہے۔ نقشے پر اپنی دکان یا ہال لگائیں۔' },
          { title: 'درخواستیں قبول کریں', text: 'قریبی لوگ حصوں کی درخواست کرتے ہیں۔ باقی حصے خود بخود اپ ڈیٹ ہوتے ہیں۔' },
          { title: 'کاؤنٹر پر حوالے کریں', text: 'ہر شخص 6 ہندسوں کا پک اپ کوڈ دکھاتا ہے جس کی آپ ایپ میں تصدیق کرتے ہیں۔' },
        ],
      },
      {
        heading: 'کاروبار کے لیے تجاویز',
        items: [
          { text: 'بند ہونے سے 30 سے 60 منٹ پہلے پوسٹ کریں تاکہ لوگ وقت پر پہنچ سکیں۔' },
          { text: 'کھانا ایک ایک حصے میں پیک کریں تاکہ جلدی حوالے ہو۔' },
          { text: 'کھانوں پر لیبل لگائیں اور عام الرجی والی چیزیں بتائیں۔' },
          { text: 'اپنے کاروبار پر لاگو کھانے کی حفاظت کے قوانین اور ہماری تجاویز پر عمل کریں۔' },
        ],
      },
    ],
  },
};

export const blogIntro: Record<
  Language,
  { h1: string; intro: string; minRead: string; published: string; related: string; latest: string; allPosts: string }
> = {
  en: {
    h1: 'The FoodShare blog',
    intro: 'Ideas and guides on sharing food with neighbours, using leftovers well and wasting less.',
    minRead: 'min read',
    published: 'Published',
    related: 'More from the blog',
    latest: 'From the blog',
    allPosts: 'All posts',
  },
  ur: {
    h1: 'فوڈ شیئر بلاگ',
    intro: 'پڑوسیوں کے ساتھ کھانا بانٹنے، بچے ہوئے کھانے کے اچھے استعمال اور کم ضیاع کے بارے میں خیالات اور رہنمائی۔',
    minRead: 'منٹ کا مطالعہ',
    published: 'شائع شدہ',
    related: 'بلاگ سے مزید',
    latest: 'بلاگ سے',
    allPosts: 'تمام تحریریں',
  },
};

export const faqIntro: Record<Language, { h1: string; intro: string }> = {
  en: {
    h1: 'Frequently asked questions',
    intro: 'Everything you need to know about sharing and picking up free food on FoodShare.',
  },
  ur: {
    h1: 'عام سوالات',
    intro: 'فوڈ شیئر پر مفت کھانا بانٹنے اور حاصل کرنے کے بارے میں ضروری معلومات۔',
  },
};

export const faqItems: Record<Language, FaqItem[]> = {
  en: [
    {
      q: 'Is FoodShare free?',
      a: 'Yes. FoodShare is free to use, and food shared on FoodShare is always given away for free. There are no fees for sharing or picking up.',
    },
    {
      q: 'Who can share food?',
      a: 'Anyone with good food to spare — home cooks, families, students, or a café or caterer with extra portions at the end of the day.',
    },
    {
      q: 'Who can pick up food?',
      a: 'Anyone nearby who would like it. You never have to explain why you are requesting food.',
    },
    {
      q: 'What kind of food can I share?',
      a: 'Freshly cooked meals, extra rice, curry or pasta, bread, fruit and sealed packaged food. Do not share food that has been left out for hours, has been eaten from, or that you would not eat yourself. See our food safety tips for details.',
    },
    {
      q: 'How do I find free food near me?',
      a: 'Create a free account, choose to find food and allow location access. The map shows food being shared around you, with how many servings are left.',
    },
    {
      q: 'How does the pickup code work?',
      a: 'When the person sharing accepts your request, you receive a unique 6-digit code. Show it at pickup and they confirm it in the app, so the food always goes to the person who requested it.',
    },
    {
      q: 'How long do I have to collect food?',
      a: 'One hour after your request is accepted. If you cannot make it, cancel the request so someone else can have the food.',
    },
    {
      q: 'Do I have to share my home address?',
      a: 'No. You choose the pickup spot you pin on the map. It can be your door, your building entrance or a nearby landmark.',
    },
    {
      q: 'Is FoodShare safe?',
      a: 'Every pickup is confirmed with a unique code, pickups can be rated, and anyone can be reported or blocked. Reports are reviewed by our team. Follow our food safety tips and choose a pickup spot you are comfortable with.',
    },
    {
      q: 'Can I use FoodShare in Urdu?',
      a: 'Yes. FoodShare is available in English and Urdu. Switch the language at any time from the language menu.',
    },
    {
      q: 'Can I install FoodShare on my phone?',
      a: 'Yes. FoodShare works in your browser and can be installed on your home screen like an app on Android, iPhone and desktop. No app store download is needed.',
    },
  ],
  ur: [
    {
      q: 'کیا فوڈ شیئر مفت ہے؟',
      a: 'جی ہاں۔ فوڈ شیئر استعمال کرنا مفت ہے، اور اس پر بانٹا گیا کھانا ہمیشہ مفت دیا جاتا ہے۔ بانٹنے یا لینے کی کوئی فیس نہیں۔',
    },
    {
      q: 'کون کھانا بانٹ سکتا ہے؟',
      a: 'جس کے پاس بھی اچھا اضافی کھانا ہو — گھر میں کھانا بنانے والے، خاندان، طلبہ، یا دن کے آخر میں اضافی کھانا رکھنے والا کیفے یا کیٹرر۔',
    },
    {
      q: 'کون کھانا لے سکتا ہے؟',
      a: 'کوئی بھی قریبی شخص جو اسے لینا چاہے۔ آپ کو کبھی وضاحت نہیں کرنی پڑتی کہ آپ کھانا کیوں مانگ رہے ہیں۔',
    },
    {
      q: 'میں کس قسم کا کھانا بانٹ سکتا ہوں؟',
      a: 'تازہ پکا کھانا، اضافی چاول، سالن یا پاستا، روٹی، پھل اور بند پیکٹ والا کھانا۔ ایسا کھانا نہ بانٹیں جو گھنٹوں باہر پڑا رہا ہو، جس سے کھایا گیا ہو، یا جو آپ خود نہ کھائیں۔ تفصیل کے لیے کھانے کی حفاظت کی تجاویز دیکھیں۔',
    },
    {
      q: 'میں اپنے قریب مفت کھانا کیسے تلاش کروں؟',
      a: 'مفت اکاؤنٹ بنائیں، کھانا تلاش کرنے کا انتخاب کریں اور مقام کی اجازت دیں۔ نقشہ آپ کے آس پاس بانٹا جا رہا کھانا اور باقی حصے دکھاتا ہے۔',
    },
    {
      q: 'پک اپ کوڈ کیسے کام کرتا ہے؟',
      a: 'جب بانٹنے والا آپ کی درخواست قبول کرتا ہے تو آپ کو 6 ہندسوں کا منفرد کوڈ ملتا ہے۔ وصولی پر اسے دکھائیں اور وہ ایپ میں تصدیق کرے گا، تاکہ کھانا ہمیشہ درخواست کرنے والے کو ہی ملے۔',
    },
    {
      q: 'کھانا وصول کرنے کے لیے کتنا وقت ہوتا ہے؟',
      a: 'درخواست قبول ہونے کے بعد ایک گھنٹہ۔ اگر آپ نہ پہنچ سکیں تو درخواست منسوخ کر دیں تاکہ کھانا کسی اور کو مل سکے۔',
    },
    {
      q: 'کیا مجھے اپنے گھر کا پتہ بتانا ہوگا؟',
      a: 'نہیں۔ نقشے پر پک اپ کی جگہ آپ خود چنتے ہیں۔ یہ آپ کا دروازہ، عمارت کا داخلی راستہ یا قریبی نشانی ہو سکتی ہے۔',
    },
    {
      q: 'کیا فوڈ شیئر محفوظ ہے؟',
      a: 'ہر وصولی کی تصدیق ایک منفرد کوڈ سے ہوتی ہے، درجہ بندی کی جا سکتی ہے، اور کسی کو بھی رپورٹ یا بلاک کیا جا سکتا ہے۔ ہماری ٹیم رپورٹس کا جائزہ لیتی ہے۔ کھانے کی حفاظت کی تجاویز پر عمل کریں اور ایسی پک اپ جگہ چنیں جہاں آپ مطمئن ہوں۔',
    },
    {
      q: 'کیا میں فوڈ شیئر اردو میں استعمال کر سکتا ہوں؟',
      a: 'جی ہاں۔ فوڈ شیئر انگریزی اور اردو میں دستیاب ہے۔ زبان کے مینو سے کسی بھی وقت زبان بدلیں۔',
    },
    {
      q: 'کیا میں فوڈ شیئر اپنے فون پر انسٹال کر سکتا ہوں؟',
      a: 'جی ہاں۔ فوڈ شیئر براؤزر میں چلتا ہے اور اینڈرائیڈ، آئی فون اور کمپیوٹر پر ایپ کی طرح ہوم اسکرین پر انسٹال ہو سکتا ہے۔ ایپ اسٹور سے ڈاؤن لوڈ کی ضرورت نہیں۔',
    },
  ],
};

// Shared chrome for public pages
export const publicChrome: Record<
  Language,
  { tagline: string; footerAbout: string; languageLinkLabel: string; ctaTitle: string; ctaText: string; ctaShare: string; ctaFind: string; notFoundTitle: string; notFoundText: string; notFoundHome: string }
> = {
  en: {
    tagline: 'Share food, share love',
    footerAbout: 'FoodShare is a free app for sharing spare home-cooked food with people nearby.',
    languageLinkLabel: 'اردو میں پڑھیں',
    ctaTitle: 'Got a plate to spare? Someone nearby would love it.',
    ctaText: 'Join FoodShare for free and start sharing food with your neighbours today.',
    ctaShare: 'Share food',
    ctaFind: 'Find free food near me',
    notFoundTitle: 'Page not found',
    notFoundText: 'The page you are looking for does not exist or has moved.',
    notFoundHome: 'Go to the home page',
  },
  ur: {
    tagline: 'کھانا بانٹیں، پیار بانٹیں',
    footerAbout: 'فوڈ شیئر قریبی لوگوں کے ساتھ اضافی گھر کا کھانا بانٹنے کی ایک مفت ایپ ہے۔',
    languageLinkLabel: 'Read in English',
    ctaTitle: 'ایک پلیٹ اضافی ہے؟ قریب کوئی اسے خوشی سے لے گا۔',
    ctaText: 'فوڈ شیئر میں مفت شامل ہوں اور آج ہی اپنے پڑوسیوں کے ساتھ کھانا بانٹنا شروع کریں۔',
    ctaShare: 'کھانا بانٹیں',
    ctaFind: 'اپنے قریب مفت کھانا تلاش کریں',
    notFoundTitle: 'صفحہ نہیں ملا',
    notFoundText: 'آپ جو صفحہ تلاش کر رہے ہیں وہ موجود نہیں یا منتقل ہو چکا ہے۔',
    notFoundHome: 'ہوم پیج پر جائیں',
  },
};
