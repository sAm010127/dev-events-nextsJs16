// Exports a list of realistic upcoming or popular developer events.
// Each event includes at minimum `title` and `image` so it can be used
// directly with the existing `EventCard` component which expects those props.

export type Event = {
  id: string;
  title: string;
  date?: string; // ISO date (or human-readable) when available
  location?: string;
  description?: string;
  url?: string;
  image: string; // path under /public, e.g. /images/event1.png
  tags?: string[];
};

export const events: Event[] = [
  {
    id: 'react-summit-2026',
    title: 'React Summit 2026',
    date: '2026-09-15',
    location: 'Amsterdam, Netherlands',
    description:
      'Europe\'s largest React conference with talks, workshops and community events covering the React ecosystem and adjacent tooling.',
    url: 'https://reactsummit.com',
    image: '/images/event1.png',
    tags: ['react', 'frontend', 'javascript'],
  },

  {
    id: 'jsconf-eu-2026',
    title: 'JSConf EU 2026',
    date: '2026-06-25',
    location: 'Berlin, Germany',
    description:
      'Independent, community-run JavaScript conference with talks on language evolution, tooling and web platform APIs.',
    url: 'https://jsconf.eu',
    image: '/images/event2.png',
    tags: ['javascript', 'web', 'standards'],
  },

  {
    id: 'google-io-2026',
    title: 'Google I/O 2026',
    date: '2026-05-12',
    location: 'Mountain View, CA, USA (and online)',
    description:
      'Google\'s annual developer conference with product announcements, deep dives and hands-on sessions across Android, Web, Cloud and ML.',
    url: 'https://events.google.com/io',
    image: '/images/event3.png',
    tags: ['android', 'cloud', 'ml'],
  },

  {
    id: 'nextjs-conf-2026',
    title: 'Next.js Conf 2026',
    date: '2026-11-02',
    location: 'Online & San Francisco, CA',
    description:
      'Official Next.js conference with core team talks, community showcases and roadmap sessions for the framework.',
    url: 'https://nextjs.org/conf',
    image: '/images/event4.png',
    tags: ['nextjs', 'react', 'frameworks'],
  },

  {
    id: 'ethglobal-2026',
    title: 'ETHGlobal - Hackathon Series 2026',
    date: '2026-08-07',
    location: 'Various / Online',
    description:
      'A global series of hackathons focused on blockchain, web3 and decentralized applications. Great for teams building fast and showcasing prototypes.',
    url: 'https://ethglobal.co',
    image: '/images/event5.png',
    tags: ['blockchain', 'hackathon', 'web3'],
  },

  {
    id: 'mlh-global-hack-2026',
    title: 'MLH Global Hackathon 2026',
    date: '2026-07-10',
    location: 'Online',
    description:
      'Major League Hacking\'s large community hackathon series open to students and professionals building projects across many tracks.',
    url: 'https://mlh.io',
    image: '/images/event6.png',
    tags: ['hackathon', 'students', 'community'],
  },

  {
    id: 'design-systems-summit-2026',
    title: 'Design Systems Summit 2026',
    date: '2026-10-05',
    location: 'London, UK',
    description:
      'A focused meetup and conference for engineers and designers working on scalable UI systems, tokens, and component libraries.',
    url: 'https://designsystemssummit.com',
    image: '/images/event-full.png',
    tags: ['design-systems', 'ux', 'frontend'],
  },
];

export default events;

