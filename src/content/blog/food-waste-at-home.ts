import type { BlogPost } from './types';

const post: BlogPost = {
  slug: 'food-waste-at-home',
  lang: 'en',
  title: 'Food waste at home: why it matters and how sharing helps',
  metaTitle: 'Food Waste at Home: Why It Matters and How to Reduce It',
  description:
    'Households waste more food than restaurants and shops combined. Learn why household food waste matters for money and climate, and simple ways to reduce it, including sharing food nearby.',
  excerpt:
    'Most wasted food is thrown away at home, not in restaurants. The good news: that also means it is the easiest place to make a difference.',
  datePublished: '2026-10-15',
  intro: [
    'When people think about food waste, they often picture restaurants and supermarkets throwing out unsold food. The biggest share actually comes from our own kitchens.',
  ],
  sections: [
    {
      heading: 'How much food is wasted?',
      paragraphs: [
        'According to the UN Environment Programme’s Food Waste Index Report 2024, around 1.05 billion tonnes of food were wasted worldwide in 2022, roughly a fifth of all food available to consumers. Households were responsible for about 60% of it, more than restaurants, canteens and shops combined.',
        'That works out to around 79 kg of food per person, per year, wasted at home. And this happens while hundreds of millions of people face hunger.',
      ],
    },
    {
      heading: 'Why it matters',
      list: [
        'Money: every plate thrown away is money spent on ingredients, gas and time.',
        'Climate: UNEP estimates that food loss and waste generate 8 to 10% of global greenhouse gas emissions. Food rotting in landfill releases methane.',
        'Resources: the water, land and energy used to grow and transport the food are wasted too.',
        'People: good food in the bin is food that could have fed someone nearby.',
      ],
    },
    {
      heading: 'Where household waste comes from',
      paragraphs: [
        'Most of it is not spoiled food. It is perfectly good food that was simply too much: the extra portion, the leftover pot, the bread that will not be finished in time, fruit bought in bulk.',
      ],
    },
    {
      heading: 'Simple ways to waste less',
      list: [
        'Plan meals and shop with a list.',
        'Store leftovers quickly in shallow, covered containers.',
        'Freeze portions you will not eat in the next day or two.',
        'Cook a little less of the dishes that always leave leftovers.',
        'Share what you cannot use with someone nearby.',
      ],
      paragraphs: ['Need ideas? Read [what to do with leftover food](/blog/what-to-do-with-leftover-food).'],
    },
    {
      heading: 'Sharing: the easiest win',
      paragraphs: [
        'Storing, freezing and planning all help, but sometimes you simply have more than your household will eat. That is exactly what [Itaam](/) is for. Post the spare plate, and someone a few streets away picks it up for free. Nothing is wasted, and someone eats well.',
        '[Start sharing for free](/register?role=donor), or read more [about our mission](/about).',
      ],
    },
  ],
};

export default post;
