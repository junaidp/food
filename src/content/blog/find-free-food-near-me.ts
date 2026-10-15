import type { BlogPost } from './types';

const post: BlogPost = {
  slug: 'find-free-food-near-me',
  lang: 'en',
  title: 'How to find free food near you',
  metaTitle: 'How to Find Free Food Near You: A Simple Guide',
  description:
    'Looking for free food near you? Here are practical ways to find free meals nearby, from neighbours sharing home-cooked food to community kitchens, and how to ask with confidence.',
  excerpt:
    'Free food is often closer than you think. Here are the most reliable places to look, and how to pick it up without any awkwardness.',
  datePublished: '2026-10-15',
  intro: [
    'Every evening, kitchens around you finish cooking with a little more than the family can eat. At the same time, plenty of people would be glad of a hot meal: students at the end of the month, someone between jobs, a parent on a long shift, or anyone who simply could not cook today.',
    'Finding free food near you is mostly about knowing where to look. This guide covers the options that work best, and how to use them with confidence.',
  ],
  sections: [
    {
      heading: '1. Neighbours sharing home-cooked food',
      paragraphs: [
        'The closest source of free food is usually the homes around you. Apps like [FoodShare](/) let people post a plate or two of spare home-cooked food, pin a pickup spot on a map, and hand it to someone nearby. You open the map, see what is available, request a serving and pick it up with a code.',
        'Because the food comes from a few streets away, it is fresh, it is often a proper home-cooked meal, and pickup takes minutes rather than an hour on a bus.',
      ],
    },
    {
      heading: '2. Community kitchens and free meal services',
      paragraphs: [
        'Many cities have community kitchens, langars, soup kitchens or charity dastarkhwans that serve free meals at set times. Places of worship, community centres and local welfare organisations usually know where these are. They are a good option when you need a full meal at a predictable time.',
      ],
    },
    {
      heading: '3. Food banks and pantries',
      paragraphs: [
        'Food banks hand out groceries rather than cooked meals. Some ask for a referral, others are open to anyone. If you need help with food for the whole week, they are worth a call.',
      ],
    },
    {
      heading: '4. Restaurants, bakeries and cafés at closing time',
      paragraphs: [
        'Bakeries and cafés often have unsold food at the end of the day. Some give it away to anyone who asks, others share it through apps. It never hurts to ask politely near closing time.',
      ],
    },
    {
      heading: 'How to pick up food with confidence',
      paragraphs: [
        'Many people feel shy about asking for free food. There is no need to. People who share food do it because they want it eaten, not thrown away. On FoodShare, nobody asks why you are requesting food, and the pickup is confirmed with a private code.',
      ],
      list: [
        'Only request what you will eat, so there is enough for others.',
        'Arrive within the pickup window, or cancel so someone else can have it.',
        'Bring a bag or container if you can.',
        'Say thank you and leave a rating. It encourages people to keep sharing.',
      ],
    },
    {
      heading: 'Stay safe',
      paragraphs: [
        'Check that food looks and smells right, refrigerate it if you are not eating it straight away, and reheat cooked food until it is steaming hot. Our [food safety tips](/food-safety) cover everything in one page.',
      ],
    },
    {
      heading: 'Start looking',
      paragraphs: [
        '[Create a free FoodShare account](/register?role=receiver), allow location access and open the map to see food being shared around you. New to it? Read [how FoodShare works](/how-it-works) first.',
      ],
    },
  ],
};

export default post;
