// script.js
const BOOKMARKS = {
  'list-1': [
    { title: 'Noahpinion (Noah Smith)', url: 'https://www.noahpinion.blog/', desc: 'Economics-first blog with tech/geopolitics detours.' },
    { title: 'Mongabay India', url: 'https://india.mongabay.com/', desc: 'Environmental reporting and analysis focused on India.' },
    { title: 'naked capitalism', url: 'https://www.nakedcapitalism.com/', desc: 'Sharp commentary on finance, economics, politics, power.' },
    {title: 'EconLife',url:'https://econlife.com/',desc:'Accessible stories linking economics to everyday life.'},
    {title: 'Stanford Encyclopedia of Philosophy',url:'https://plato.stanford.edu/index.html',desc:'Peer-reviewed, continually updated philosophy ref.'},
    {title: 'हाकारा । hākārā',url:'https://hakara.in/',desc:'Bilingual journal for creative/critical expression.'},
    {title: 'FiftyTwo',url:'https://fiftytwo.in/',desc:'Weekly essays from the subcontinent. (Hiatus)'},
    {title:'UbuWeb',url:'https://ubuweb.com/',desc:'Avant-garde film, sound, ephemera.'},
    {title:'Nassim Taleb',url:'https://nassimtaleb.org/',desc:'On uncertainty, risk, decision-making.'},
    {title:'As We May Think',url:'https://worrydream.com/refs/Bush%20-%20As%20We%20Think%20(Life%20Magazine%209-10-1945).pdf',desc:'Proto-internet memex + trails.'},
  ],
  'list-2': [
    { title: 'Hammock', url: 'https://www.hammockmag.com/', desc: 'Fiction & narrative non-fiction.' },
    { title: 'Mumbai Paused', url: 'https://mumbaipaused.substack.com/', desc: 'Street-level observations.' },
    { title: 'The Swaddle', url: 'https://www.theswaddle.com/', desc: 'Society and culture; publication + studio'},
    {title: 'Sentiers',url:'https://sentiers.media/',desc:'Signals of change; tech/society/culture.'},
    {title: 'kottke dot org',url:'https://kottke.org/',desc:'OG blog of culture & miscellany.'},
    { title: 'The India Forum',url:'https://www.theindiaforum.in/',desc:'Independent journal on contemporary issues.'},
    { title: 'The Heritage Lab',url:'https://www.theheritagelab.in/',desc:'Museums, art, heritage stories.'},
    { title: 'Putanumonit',url:'https://putanumonit.com/',desc:'Numbers + rationalist thinking.'},
    { title: 'The Public Domain Review',url:'https://publicdomainreview.org/',desc:'Curiosities from the commons.'},
    {title:'Villani: Math is Poetry',url:'https://archive.org/details/cedric-villani.-mathematics-is-the-poetry-of-science/mode/2up',desc:'Playful talk on math & poetry.'},
    {title:'Ways of Seeing',url:'https://www.ways-of-seeing.com/',desc:'Companion to John Berger’s series.'},
  ],
  'list-3': [
    { title:'LessWrong', url:'https://www.lesswrong.com/', desc:'Better reasoning community.'},
    {title: 'Astral Codex Ten',url:'https://www.astralcodexten.com/',desc:'Science, ethics, AI, psychiatry.'},
    {title: 'The Last Psychiatrist',url:'https://thelastpsychiatrist.com/',desc:'Cultural critique via psychiatry.'},
    {title: 'Nemology',url:'https://www.nemology.org/',desc:'Curious investigations.'},
    {title: 'Interfluidity',url:'https://www.interfluidity.com/',desc:'Steve Randy Waldman on econ/policy.'},
    {title: 'Stumbling and Mumbling',url:'https://stumblingandmumbling.typepad.com/',desc:'Macro, policy, commentary.'},
    {title: 'The Grumpy Economist',url:'https://www.grumpy-economist.com/',desc:'Free-market flavored takes.'},
    {title: 'XKDR Forum',url:'https://xkdr.substack.com/',desc:'Cross-disciplinary research + data.'},
    {title:'Strange Loop Canon',url:'https://www.strangeloopcanon.com/',desc:'Innovation’s hidden loops.'},
    {title:'GeoCities Gallery',url:'https://geocities.restorativland.org/',desc:'Surf the restored old web.'},
    {title:'Benjamin: Work of Art…',url:'https://web.mit.edu/allanmc/www/benjamin.pdf',desc:'Aura, reproduction, politics.'},
  ],
  'list-4': [
    { title:'The Leap Blog', url:'https://blog.theleapjournal.org/#gsc.tab=0', desc:'Law, econ, policy originals.' },
    {title: 'Jay Hoffmann',url:'https://jayhoffmann.com/',desc:'Web history & ideas.'},
    {title: 'Jim Nielsen',url:'https://www.jim-nielsen.com/',desc:'Humane web dev notes.'},
    {title: 'Manuel Moreale',url:'https://manuelmoreale.com/',desc:'Life, design, the web.'},
    {title: 'Bruno Simon',url:'https://bruno-simon.com/',desc:'Immersive 3D portfolio.'},
    {title: 'Laurel Schwulst',url:'https://laurelschwulst.com/home/',desc:'Writing, design, projects.'},
    {title: 'Nicky Case',url:'https://ncase.me/',desc:'Interactive, playful learning.'},
    {title: 'Timo Arnall',url:'https://www.elasticspace.com/',desc:'Infra of technology.'},
    {title:'Spinal Catastrophism (annotated)',url:'https://docs.google.com/document/d/10BgWgKKPqXGowoA16sAwnxKyvB2hgEUWpVcgnI1tw1g/edit?tab=t.0',desc:'Skeptical guide.'},
    {title:'Raqs Media Collective',url:'https://works.raqsmediacollective.net/',desc:'Archive of works & writings.'},
  ],
  'list-5': [
    { title:'Jacky Alciné', url:'https://www.jacky.wtf/', desc:'Weeknotes, links, projects.' },
    {title: 'Gwern',url:'https://gwern.net/',desc:'Deep research, longform.'},
    {title: 'Quanta Magazine',url:'https://www.quantamagazine.org/',desc:'Math, physics, CS, life sciences.'},
    {title: 'e-flux',url:'https://www.e-flux.com/',desc:'Essays & exhibitions.'},
    {title: 'XXIIVV',url:'https://wiki.xxiivv.com/site/about.html',desc:'Living memex wiki.'},
    {title: 'Mostly Economics',url:'https://mostlyeconomics.wordpress.com/',desc:'India-focused econ research.'},
    {title: 'Nous Network',url:'https://www.nousnetwork.org/',desc:'Rights, development, culture.'},
    {title: 'Article 14',url:'https://article-14.com/',desc:'Law, justice, constitution.'},
    {title:'Cyclonopedia (scan)',url:'https://ciudadtecnicolor.wordpress.com/wp-content/uploads/2011/01/cyclonopedia.pdf',desc:'Theory-fiction, oil & myth.'},
    {title:'Library of Babel',url:'https://libraryofbabel.info/',desc:'Combinatorial library.'},
    {title:'The Machine Stops',url:'https://www.ele.uri.edu/faculty/vetter/Other-stuff/The-Machine-Stops.pdf',desc:'Screen-bound civilization tale.'},
  ],
  'list-6': [
    { title:'Countercurrents', url:'https://countercurrents.org/', desc:'Environment, development, democracy.' },
    {title: 'Maktoob Media',url:'https://maktoobmedia.com/#',desc:'Rights-centered independent news.'},
    {title: 'PARI',url:'https://ruralindiaonline.org/',desc:'India’s rural lives & issues.'},
    {title: 'Aeon',url:'https://aeon.co/',desc:'Magazine of ideas.'},
    {title: 'Arts & Letters Daily',url:'https://www.aldaily.com/',desc:'Curated ideas portal.'},
    {title: 'Slime Mold Time Mold',url:'https://slimemoldtimemold.com/',desc:'Mad science, crowd experiments.'},
    {title: 'Wait But Why',url:'https://waitbutwhy.com/',desc:'Life & tech longform.'},
    {title: 'Bartosz Ciechanowski',url:'https://ciechanow.ski/',desc:'Interactive illustrated explainers.'},
    {title:'Anna’s Archive',url:'https://annas-archive.org/',desc:'Meta-index for books & papers.'},
    {title:'Good Strategy/Bad Strategy (talk)',url:'https://www.youtube.com/watch?v=4uWKEG0s9Kc',desc:'Rumelt overview.'},
  ],
  'list-7': [
    {title:"Dilip D'Souza: Death Ends Fun", url:'https://deathendsfun.stck.me/', desc:'Sharp, humane essays.' },
    {title: 'Jabberwock',url:'https://jaiarjun.blogspot.com/',desc:'Films, books, culture.'},
    {title: 'Rajesh Jain',url:'https://rajeshjain.com/',desc:'Marketing & entrepreneurship.'},
    {title: 'The Honest Broker',url:'https://www.honest-broker.com/',desc:'Music, books, culture.'},
    {title: '3 Quarks Daily',url:'https://3quarksdaily.com/',desc:'Original + curated essays.'},
    {title: 'Hot Chips',url:'https://www.thehotchips.com/',desc:'Culture × business/data.'},
    {title: 'Unapologetically Human',url:'https://singhaaditya.substack.com/',desc:'Psychology/culture riffs.'},
    {title: 'How Things Work',url:'https://www.hamiltonnolan.com/',desc:'Labor, politics, power.'},
    {title:'Monoskop',url:'https://monoskop.org/Monoskop',desc:'Arts & media studies wiki.'},
    {title:'Tractatus Logico-Philosophicus',url:'https://people.umass.edu/klement/tlp/tlp.html#bodytext',desc:'On language & limits.'},
  ],
  'list-8': [
    {title:"Useful Fictions", url:'https://usefulfictions.substack.com/', desc:'Mental models & agency.' },
    {title: 'The CMO Journal',url:'https://thecmojournal.substack.com/',desc:'Better marketing practice.'},
    {title: 'Heart Wired',url:'https://heartwired.substack.com/',desc:'Contemplation + comedy.'},
    {title: 'After EOD',url:'https://aftereod.substack.com/',desc:'India-centric music subcultures.'},
    {title: 'womaning',url:'https://womaning.substack.com/',desc:'On gender roles.'},
    {title: 'Dusted Off',url:'https://madhulikaliddle.com/',desc:'Old cinema, history, nostalgia.'},
    {title: 'The Bant Singh Project',url:'https://wordsoundpower.bandcamp.com/album/the-bant-singh-project',desc:'Revolutionary folk × dub.'},
    {title: 'Out of Print',url:'https://www.outofprintmagazine.co.in/',desc:'Short-fiction journal.'},
    {title:'Andy Matuschak',url:'https://andymatuschak.org/',desc:'Notes & experiments.'},
    {title:'GEB (lectures playlist)',url:'https://www.youtube.com/playlist?list=PLf8rnbsH7oxtuZs56-ErvFRZ9DREjbgx6',desc:'On Hofstadter’s classic.'},
  ]
};
const THOUGHTS = [
  "smells of rain + petrol = wes anderson + Guru Dutt",
  "abundance scarcity from the wrong angle",
  "Kafka's cat won't fetch",
  "Every defeated idealist is pessimist.converted pessimism in to passion. Idealism feels like Utopia.",
  "no plot, only commentary",
  "badmtn wrist loose WRIST LOOSE",
  "“I can’t go on, I’ll go on.”",
];
function renderList(ulId, items) {
  const ul = document.getElementById(ulId);
  if (!ul || !Array.isArray(items)) return;
  ul.innerHTML = items.map(({title, url, desc}) => `
    <li>
      <a href="${url}" target="_blank" rel="noopener noreferrer"
         class="font-medium underline decoration-gray-300 hover:decoration-gray-900 text-sm">
        ${title}
      </a>
      ${desc ? `<p class="text-xs text-gray-600">${desc}</p>` : ''}
    </li>
  `).join('');
}
function setupThoughtTicker() {
  const ticker = document.getElementById('thought-ticker');
  if (!ticker) return;
  const thoughtsContent = THOUGHTS.map(thought =>
    `<p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">${thought}</p>`
  ).join('');
  ticker.innerHTML = thoughtsContent + thoughtsContent; // seamless loop
}
document.addEventListener('DOMContentLoaded', () => {
  const backToTopButton = document.getElementById('back-to-top-button');
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('aside nav a');
  const onScroll = () => {
    // Back-to-top button visibility
    if (window.scrollY > 300) {
      backToTopButton.classList.remove('opacity-0', 'pointer-events-none');
      backToTopButton.classList.add('opacity-100');
    } else {
      backToTopButton.classList.remove('opacity-100');
      backToTopButton.classList.add('opacity-0', 'pointer-events-none');
    }
    // ToC highlighting logic
    const scrollPosition = window.scrollY + 150;
    let currentSectionId = '';
    sections.forEach(section => {
      if (section.offsetTop <= scrollPosition) {
        currentSectionId = section.getAttribute('id');
      }
    });
    // Update the classes on the navigation links
    navLinks.forEach(link => {
      const target = link.getAttribute('href').substring(1);
      if (target === currentSectionId) {
        link.classList.add('text-gray-900', 'font-semibold');
        link.classList.remove('text-gray-500', 'font-medium');
      } else {
        link.classList.remove('text-gray-900', 'font-semibold');
        link.classList.add('text-gray-500', 'font-medium');
      }
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  // Run on document load to set the initial state correctly
  onScroll();

  // Theme toggle
  const btn = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-icon');
  if (btn) {
    function setIcon(){
      const isDark = document.documentElement.classList.contains('dark');
      icon.textContent = isDark ? '☀️' : '🌙';
    }
    btn.addEventListener('click', () => {
      const el = document.documentElement;
      const isDark = el.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      setIcon();
    });
    setIcon();
  }

  // Current year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Render bookmarks and thoughts
  Object.entries(BOOKMARKS).forEach(([ulId, items]) => renderList(ulId, items));
  setupThoughtTicker();
});