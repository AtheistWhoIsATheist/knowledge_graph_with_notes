/**
 * NIHILTHEISM — Philosophical Knowledge Graph / N-KGAP v2
 * Comprehensive Seed Corpus & Canon (Journal314, REN, and Epistemic Ontologies)
 */

import {
  GraphNode,
  GraphEdge,
  ResearchNote,
  ArgumentItem,
  DefenseItem,
  LibraryDocument,
  GovernanceRecord,
  SpotCheckRecord,
  SavedView,
} from '../types';
import { CANONICAL_JOURNAL314_NODES, CANONICAL_JOURNAL314_EDGES } from './canonicalJournal314';

export const INITIAL_NODES: GraphNode[] = CANONICAL_JOURNAL314_NODES;
export const INITIAL_EDGES: GraphEdge[] = CANONICAL_JOURNAL314_EDGES;

const LEGACY_NODES: GraphNode[] = [
  // --- CANONICAL THINKERS (52 FIGURES) ---
  {
    id: 'thinker-nietzsche',
    label: 'Friedrich Nietzsche',
    type: 'thinker',
    epistemicTier: 'CANONICAL_PROJECT_DEFINITION',
    status: 'CANONICAL',
    description: 'Prophet of the Death of God, eternal recurrence, and the active overcomes of nihilism through transvaluation.',
    tradition: 'German Philosophy / Existentialism',
    period: '1844–1900',
    keyWorks: ['Thus Spoke Zarathustra', 'The Gay Science', 'The Will to Power', 'On the Genealogy of Morality'],
    confidence: 0.98,
    sourceReference: 'Journal314 Part I, Sec. 4; The Gay Science §125',
    tags: ['Death of God', 'Nihilism', 'Active Nihilism', 'Amor Fati'],
    lens: 'Ontology of Collapse',
    provenance: {
      origin: 'canonical_corpus',
      creator: 'N-KGAP Seed Authority',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-08-20T12:00:00Z',
      verificationHash: 'sha256-nietzsche-c48f2b',
      externalAnchor: 'anchor-001-canon',
      epistemicJustification: 'Canonical anchor for the diagnostic formulation of European nihilism.'
    }
  },
  {
    id: 'thinker-heidegger',
    label: 'Martin Heidegger',
    type: 'thinker',
    epistemicTier: 'CANONICAL_PROJECT_DEFINITION',
    status: 'CANONICAL',
    description: 'Formulator of the ontological difference (Being vs. beings), Seinsvergessenheit, and the das Nichts revealing Being.',
    tradition: 'Phenomenology / Fundamental Ontology',
    period: '1889–1976',
    keyWorks: ['Being and Time', 'What is Metaphysics?', 'Contributions to Philosophy', 'The Question Concerning Technology'],
    confidence: 0.96,
    sourceReference: 'Journal314 Part I, Sec. 12; What is Metaphysics? (1929)',
    tags: ['Das Nichts', 'Ontological Difference', 'Gelassenheit', 'Ereignis'],
    lens: 'Phenomenology of the Void',
    provenance: {
      origin: 'canonical_corpus',
      creator: 'N-KGAP Seed Authority',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-08-20T12:00:00Z',
      verificationHash: 'sha256-heidegger-891d4e',
      externalAnchor: 'anchor-001-canon'
    }
  },
  {
    id: 'thinker-cioran',
    label: 'Emil Cioran',
    type: 'thinker',
    epistemicTier: 'SOURCE_TEXT',
    status: 'CANONICAL',
    description: 'Master of aphoristic despair, the heights of despair, decay, and the ecstasy of lucid groundlessness.',
    tradition: 'Romanian/French Pessimism',
    period: '1911–1995',
    keyWorks: ['On the Heights of Despair', 'The Trouble with Being Born', 'A Short History of Decay', 'Tears and Saints'],
    confidence: 0.94,
    sourceReference: 'Journal314 Part II, Sec. 3; Trouble with Being Born',
    tags: ['Despair', 'Insomnia', 'Decreation', 'Lucidity'],
    lens: 'Phenomenology of Despair',
    provenance: {
      origin: 'canonical_corpus',
      creator: 'N-KGAP Seed Authority',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-08-20T12:00:00Z',
      verificationHash: 'sha256-cioran-fa7731',
      externalAnchor: 'anchor-001-canon'
    }
  },
  {
    id: 'thinker-nishitani',
    label: 'Keiji Nishitani',
    type: 'thinker',
    epistemicTier: 'CANONICAL_PROJECT_DEFINITION',
    status: 'CANONICAL',
    description: 'Synthesizer of Western existential nihilism with Mahayana Sunyata (absolute emptiness), turning nihil into the field of Emptiness.',
    tradition: 'Kyoto School',
    period: '1900–1990',
    keyWorks: ['Religion and Nothingness', 'The Self-Overcoming of Nihilism', 'On Buddhism'],
    confidence: 0.99,
    sourceReference: 'Journal314 Part III, Sec. 1; Religion and Nothingness (1961)',
    tags: ['Sunyata', 'Field of Emptiness', 'Samsara/Nirvana', 'Overcoming Nihilism'],
    lens: 'Kyoto Metaphysics',
    provenance: {
      origin: 'canonical_corpus',
      creator: 'N-KGAP Seed Authority',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-08-20T12:00:00Z',
      verificationHash: 'sha256-nishitani-991c33',
      externalAnchor: 'anchor-001-canon',
      epistemicJustification: 'Primary structural foundation for turning Western nihilism into sacred kenosis.'
    }
  },
  {
    id: 'thinker-nishida',
    label: 'Kitaro Nishida',
    type: 'thinker',
    epistemicTier: 'TEXTUAL_CLAIM',
    status: 'CANONICAL',
    description: 'Founder of the Kyoto School, philosopher of pure experience and the logic of Basho (Place of Absolute Nothingness).',
    tradition: 'Kyoto School',
    period: '1870–1945',
    keyWorks: ['An Inquiry into the Good', 'From the Acting to the Seeing', 'The Logic of Place'],
    confidence: 0.93,
    sourceReference: 'Journal314 Part III, Sec. 2; Logic of Basho',
    tags: ['Basho', 'Absolute Nothingness', 'Pure Experience'],
    lens: 'Kyoto Metaphysics',
    provenance: {
      origin: 'canonical_corpus',
      creator: 'N-KGAP Seed Authority',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-08-20T12:00:00Z'
    }
  },
  {
    id: 'thinker-eckhart',
    label: 'Meister Eckhart',
    type: 'thinker',
    epistemicTier: 'CANONICAL_PROJECT_DEFINITION',
    status: 'CANONICAL',
    description: 'Mystic who distinguished the Personal God (Gott) from the abyssal Godhead (Gottheit / Ungrund) through radical detachment (Gelassenheit).',
    tradition: 'Rhineland Mysticism / Negative Theology',
    period: '1260–1328',
    keyWorks: ['German Sermons', 'Latin Treatises', 'The Book of Divine Consolation'],
    confidence: 0.97,
    sourceReference: 'Journal314 Part IV, Sec. 1; Sermon 52 (Beati pauperes spiritu)',
    tags: ['Gottheit', 'Ungrund', 'Gelassenheit', 'Apophatic', 'Abgeschiedenheit'],
    lens: 'Apophatic Theology',
    provenance: {
      origin: 'canonical_corpus',
      creator: 'N-KGAP Seed Authority',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-08-20T12:00:00Z',
      verificationHash: 'sha256-eckhart-5b12da',
      externalAnchor: 'anchor-001-canon'
    }
  },
  {
    id: 'thinker-pseudo-dionysius',
    label: 'Pseudo-Dionysius',
    type: 'thinker',
    epistemicTier: 'SOURCE_TEXT',
    status: 'CANONICAL',
    description: 'Founding architect of Christian apophaticism, formulating the hyper-essential darkness of the divine beyond light and silence.',
    tradition: 'Negative Theology / Neoplatonism',
    period: '5th–6th Century CE',
    keyWorks: ['Mystical Theology', 'The Divine Names', 'Celestial Hierarchy'],
    confidence: 0.95,
    sourceReference: 'Journal314 Part IV, Sec. 5; Mystical Theology Ch. 1',
    tags: ['Divine Darkness', 'Apophatic', 'Hyperousios', 'Ray of Darkness'],
    lens: 'Apophatic Theology',
    provenance: {
      origin: 'canonical_corpus',
      creator: 'N-KGAP Seed Authority',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-08-20T12:00:00Z'
    }
  },
  {
    id: 'thinker-nagarjuna',
    label: 'Nagarjuna',
    type: 'thinker',
    epistemicTier: 'CANONICAL_PROJECT_DEFINITION',
    status: 'CANONICAL',
    description: 'Dialectician of Madhyamaka, demonstrating that all dharmas are devoid of svabhava (inherent existence) and co-dependent (pratityasamutpada).',
    tradition: 'Madhyamaka Buddhism',
    period: 'c. 150–250 CE',
    keyWorks: ['Mulamadhyamakakarika', 'Vigrahavyavartani', 'Sunyatasaptati'],
    confidence: 0.98,
    sourceReference: 'Journal314 Part III, Sec. 8; MMK XXIV.18',
    tags: ['Sunyata', 'Svabhava', 'Pratityasamutpada', 'Two Truths'],
    lens: 'Kyoto Metaphysics',
    provenance: {
      origin: 'canonical_corpus',
      creator: 'N-KGAP Seed Authority',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-08-20T12:00:00Z'
    }
  },
  {
    id: 'thinker-shestov',
    label: 'Lev Shestov',
    type: 'thinker',
    epistemicTier: 'INTERPRETATION',
    status: 'CANONICAL',
    description: 'Radical Russian existentialist defending biblical faith against the tyranny of speculative reason and necessity (Athens vs Jerusalem).',
    tradition: 'Russian Existentialism',
    period: '1866–1938',
    keyWorks: ['Athens and Jerusalem', 'All Things Are Possible', 'Kierkegaard and the Existential Philosophy'],
    confidence: 0.92,
    sourceReference: 'Journal314 Part II, Sec. 7; Athens & Jerusalem',
    tags: ['Faith beyond Reason', 'Necessity', 'Groundlessness', 'Job'],
    lens: 'Phenomenology of Despair',
    provenance: {
      origin: 'canonical_corpus',
      creator: 'N-KGAP Seed Authority',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-08-20T12:00:00Z'
    }
  },
  {
    id: 'thinker-kierkegaard',
    label: 'Søren Kierkegaard',
    type: 'thinker',
    epistemicTier: 'CANONICAL_PROJECT_DEFINITION',
    status: 'CANONICAL',
    description: 'Father of existentialism, mapping anxiety (Angst) as the dizziness of freedom over the abyss of possibility.',
    tradition: 'Christian Existentialism',
    period: '1813–1855',
    keyWorks: ['Fear and Trembling', 'The Concept of Anxiety', 'The Sickness unto Death', 'Concluding Unscientific Postscript'],
    confidence: 0.96,
    sourceReference: 'Journal314 Part I, Sec. 9; Sickness unto Death',
    tags: ['Angst', 'Leap of Faith', 'Despair', 'Infinite Resignation'],
    lens: 'Phenomenology of Despair',
    provenance: {
      origin: 'canonical_corpus',
      creator: 'N-KGAP Seed Authority',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-08-20T12:00:00Z'
    }
  },
  {
    id: 'thinker-bataille',
    label: 'Georges Bataille',
    type: 'thinker',
    epistemicTier: 'SOURCE_TEXT',
    status: 'CANONICAL',
    description: 'Theorist of general economy, sovereign expenditure, inner experience, and the ecstatic rupture of non-knowledge.',
    tradition: 'French Post-Structuralism / Heterology',
    period: '1897–1962',
    keyWorks: ['Inner Experience', 'The Accursed Share', 'Theory of Religion', 'Erotism'],
    confidence: 0.93,
    sourceReference: 'Journal314 Part V, Sec. 2; Inner Experience',
    tags: ['Non-Knowledge', 'Sovereignty', 'Transgression', 'Sacred Expenditure'],
    lens: 'Radical Immanence',
    provenance: {
      origin: 'canonical_corpus',
      creator: 'N-KGAP Seed Authority',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-08-20T12:00:00Z'
    }
  },
  {
    id: 'thinker-schopenhauer',
    label: 'Arthur Schopenhauer',
    type: 'thinker',
    epistemicTier: 'CANONICAL_PROJECT_DEFINITION',
    status: 'CANONICAL',
    description: 'Pessimist philosopher who revealed the blind, purposeless cosmic Will (Wille zum Leben) as the inner kernel of all suffering.',
    tradition: 'German Idealism / Pessimism',
    period: '1788–1860',
    keyWorks: ['The World as Will and Representation', 'Parerga and Paralipomena'],
    confidence: 0.95,
    sourceReference: 'Journal314 Part I, Sec. 2; WWR Vol. 1, §56',
    tags: ['The Will', 'Cosmic Pessimism', 'Ascetic Denial', 'Maya'],
    lens: 'Ontology of Collapse',
    provenance: {
      origin: 'canonical_corpus',
      creator: 'N-KGAP Seed Authority',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-08-20T12:00:00Z'
    }
  },
  {
    id: 'thinker-mainlander',
    label: 'Philipp Mainländer',
    type: 'thinker',
    epistemicTier: 'SOURCE_TEXT',
    status: 'CANONICAL',
    description: 'Radical cosmologist of cosmic suicide: God died before time, and the universe is the lingering rotting corpse seeking absolute nothingness.',
    tradition: 'German Pessimism',
    period: '1841–1876',
    keyWorks: ['The Philosophy of Redemption (Die Philosophie der Erlösung)'],
    confidence: 0.91,
    sourceReference: 'Journal314 Part I, Sec. 7; Philosophie der Erlösung (1876)',
    tags: ['Cosmic Suicide', 'Entropic Death', 'Will to Die', 'Redemption'],
    lens: 'Ontology of Collapse',
    provenance: {
      origin: 'canonical_corpus',
      creator: 'N-KGAP Seed Authority',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-08-20T12:00:00Z'
    }
  },
  {
    id: 'thinker-altizer',
    label: 'Thomas J. J. Altizer',
    type: 'thinker',
    epistemicTier: 'INTERPRETATION',
    status: 'CANONICAL',
    description: 'Pioneer of the Death of God Theology, viewing Christ’s kenosis as the total self-emptying of God into the immanence of profane history.',
    tradition: 'Radical Theology / Christian Atheism',
    period: '1927–2018',
    keyWorks: ['The Gospel of Christian Atheism', 'Total Presence', 'The Genesis of God'],
    confidence: 0.94,
    sourceReference: 'Journal314 Part VI, Sec. 1; Gospel of Christian Atheism',
    tags: ['Kenosis', 'Total Presence', 'Christian Atheism', 'Incarnation'],
    lens: 'Apophatic Theology',
    provenance: {
      origin: 'canonical_corpus',
      creator: 'N-KGAP Seed Authority',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-08-20T12:00:00Z'
    }
  },
  {
    id: 'thinker-vattimo',
    label: 'Gianni Vattimo',
    type: 'thinker',
    epistemicTier: 'INTERPRETATION',
    status: 'CANONICAL',
    description: 'Theorist of Pensiero Debole (Weak Thought) and the secularization of metaphysics as the ongoing kenotic destiny of Being.',
    tradition: 'Hermeneutics / Nihilism',
    period: '1936–2023',
    keyWorks: ['The End of Modernity', 'Belief', 'After Christianity', 'Weak Thought'],
    confidence: 0.92,
    sourceReference: 'Journal314 Part VI, Sec. 4; After Christianity',
    tags: ['Weak Thought', 'Kenosis', 'Secularization', 'Hermeneutics'],
    lens: 'Radical Immanence',
    provenance: {
      origin: 'canonical_corpus',
      creator: 'N-KGAP Seed Authority',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-08-20T12:00:00Z'
    }
  },
  {
    id: 'thinker-marion',
    label: 'Jean-Luc Marion',
    type: 'thinker',
    epistemicTier: 'TEXTUAL_CLAIM',
    status: 'CANONICAL',
    description: 'Phenomenologist of saturated phenomena and the icon: God freed from ontological categories (God Without Being).',
    tradition: 'Phenomenology / Theology',
    period: '1946–Present',
    keyWorks: ['God Without Being', 'Being Given', 'In Excess', 'The Idol and Distance'],
    confidence: 0.93,
    sourceReference: 'Journal314 Part IV, Sec. 9; God Without Being',
    tags: ['Saturated Phenomenon', 'God Without Being', 'Givenness', 'The Icon'],
    lens: 'Apophatic Theology',
    provenance: {
      origin: 'canonical_corpus',
      creator: 'N-KGAP Seed Authority',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-08-20T12:00:00Z'
    }
  },
  {
    id: 'thinker-brassier',
    label: 'Ray Brassier',
    type: 'thinker',
    epistemicTier: 'COUNTER_READING',
    status: 'CANONICAL',
    description: 'Speculative realist philosopher arguing that extinction is real and nihilism is the inescapable consequence of scientific disenchantment.',
    tradition: 'Speculative Realism / Eliminative Materialism',
    period: '1965–Present',
    keyWorks: ['Nihil Unbound: Enlightenment and Extinction', 'Alien Theory'],
    confidence: 0.95,
    sourceReference: 'Journal314 Part VII, Sec. 2; Nihil Unbound (2007)',
    tags: ['Extinction', 'Disenchantment', 'Speculative Realism', 'Trauma of Reason'],
    lens: 'Ontology of Collapse',
    provenance: {
      origin: 'canonical_corpus',
      creator: 'N-KGAP Seed Authority',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-08-20T12:00:00Z'
    }
  },
  {
    id: 'thinker-thacker',
    label: 'Eugene Thacker',
    type: 'thinker',
    epistemicTier: 'SPECULATIVE_HYPOTHESIS',
    status: 'CANONICAL',
    description: 'Theorist of cosmic horror and the "world-without-us," exploring mysticism and demonic philosophy in the climate catastrophe.',
    tradition: 'Horror of Philosophy / Pessimism',
    period: '1971–Present',
    keyWorks: ['In the Dust of This Planet', 'Starry Speculative Corpse', 'Tentacles Longer Than Night'],
    confidence: 0.90,
    sourceReference: 'Journal314 Part VII, Sec. 5; Dust of This Planet',
    tags: ['World-Without-Us', 'Cosmic Pessimism', 'Dark Mysticism'],
    lens: 'Ontology of Collapse',
    provenance: {
      origin: 'canonical_corpus',
      creator: 'N-KGAP Seed Authority',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-08-20T12:00:00Z'
    }
  },
  {
    id: 'thinker-boehme',
    label: 'Jacob Böhme',
    type: 'thinker',
    epistemicTier: 'SOURCE_TEXT',
    status: 'CANONICAL',
    description: 'Theosopher who formulated the Ungrund as the primal, bottomless abyss prior to light and darkness, source of all manifestation.',
    tradition: 'Christian Theosophy / Mysticism',
    period: '1575–1624',
    keyWorks: ['Aurora', 'Mysterium Magnum', 'De Tribus Principiis'],
    confidence: 0.95,
    sourceReference: 'Journal314 Part IV, Sec. 3; Mysterium Magnum',
    tags: ['Ungrund', 'Primal Abyss', 'Cosmic Dialectic', 'Theosophy'],
    lens: 'Apophatic Theology',
    provenance: {
      origin: 'canonical_corpus',
      creator: 'N-KGAP Seed Authority',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-08-20T12:00:00Z'
    }
  },
  {
    id: 'thinker-tillich',
    label: 'Paul Tillich',
    type: 'thinker',
    epistemicTier: 'INTERPRETATION',
    status: 'CANONICAL',
    description: 'Theologian of existential depth, formulating the "God above God" who emerges in the radical courage to accept despair and non-being.',
    tradition: 'Existential Theology',
    period: '1886–1965',
    keyWorks: ['The Courage to Be', 'Systematic Theology', 'Dynamics of Faith'],
    confidence: 0.94,
    sourceReference: 'Journal314 Part VI, Sec. 2; Courage to Be Ch. 6',
    tags: ['God above God', 'Courage to Be', 'Non-Being', 'Ultimate Concern'],
    lens: 'Apophatic Theology',
    provenance: {
      origin: 'canonical_corpus',
      creator: 'N-KGAP Seed Authority',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-08-20T12:00:00Z'
    }
  },
  {
    id: 'thinker-caputo',
    label: 'John D. Caputo',
    type: 'thinker',
    epistemicTier: 'INTERPRETATION',
    status: 'PROVISIONAL',
    description: 'Architect of radical theology, claiming God does not exist as omnipotent sovereign entity but insists as an unconditional event/call.',
    tradition: 'Radical Hermeneutics / Deconstruction',
    period: '1940–Present',
    keyWorks: ['The Weakness of God', 'The Insistence of God', 'Radical Hermeneutics'],
    confidence: 0.88,
    sourceReference: 'Journal314 Part VI, Sec. 7; Weakness of God',
    tags: ['Weakness of God', 'The Event', 'Theopoetics', 'Deconstruction'],
    lens: 'Radical Immanence',
    provenance: {
      origin: 'canonical_corpus',
      creator: 'N-KGAP Seed Authority',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-08-20T12:00:00Z'
    }
  },
  {
    id: 'thinker-land',
    label: 'Nick Land',
    type: 'thinker',
    epistemicTier: 'COUNTER_READING',
    status: 'PROVISIONAL',
    description: 'Radical philosopher of meltdown, transcendental empiricism, and absolute deterritorialization into inhuman machinic void.',
    tradition: 'Accelerationism / CCRU',
    period: '1962–Present',
    keyWorks: ['Fanged Noumena', 'The Thirst for Annihilation'],
    confidence: 0.84,
    sourceReference: 'Journal314 Part VII, Sec. 8; Fanged Noumena',
    tags: ['Machinic Void', 'Meltdown', 'Annihilation', 'Thanatos'],
    lens: 'Ontology of Collapse',
    provenance: {
      origin: 'canonical_corpus',
      creator: 'N-KGAP Seed Authority',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-08-20T12:00:00Z'
    }
  },
  {
    id: 'thinker-meillassoux',
    label: 'Quentin Meillassoux',
    type: 'thinker',
    epistemicTier: 'SPECULATIVE_HYPOTHESIS',
    status: 'PROVISIONAL',
    description: 'Post-Kantian realist who proves the necessity of contingency (hyper-chaos), opening the possibility of a virtual, yet-to-be-born God.',
    tradition: 'Speculative Realism',
    period: '1967–Present',
    keyWorks: ['After Finitude: An Essay on the Necessity of Contingency', 'The Immanence of the World Beyond'],
    confidence: 0.89,
    sourceReference: 'Journal314 Part VII, Sec. 3; After Finitude',
    tags: ['Hyper-Chaos', 'Ancestrality', 'Virtual God', 'Contingency'],
    lens: 'Ontology of Collapse',
    provenance: {
      origin: 'canonical_corpus',
      creator: 'N-KGAP Seed Authority',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-08-20T12:00:00Z'
    }
  },
  {
    id: 'thinker-weil',
    label: 'Simone Weil',
    type: 'thinker',
    epistemicTier: 'SOURCE_TEXT',
    status: 'CANONICAL',
    description: 'Mystic and philosopher who conceptualized decreation (décréation) as the voluntary unmaking of the self to allow divine grace to pass through.',
    tradition: 'French Mysticism / Philosophy',
    period: '1909–1943',
    keyWorks: ['Gravity and Grace', 'Waiting for God', 'The Need for Roots'],
    confidence: 0.96,
    sourceReference: 'Journal314 Part V, Sec. 4; Gravity and Grace (1947)',
    tags: ['Decreation', 'Affliction', 'Void', 'Attention'],
    lens: 'Apophatic Theology',
    provenance: {
      origin: 'canonical_corpus',
      creator: 'N-KGAP Seed Authority',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-08-20T12:00:00Z'
    }
  },
  {
    id: 'thinker-levinas',
    label: 'Emmanuel Levinas',
    type: 'thinker',
    epistemicTier: 'TEXTUAL_CLAIM',
    status: 'CANONICAL',
    description: 'Phenomenologist who mapped the Il y a (the anonymous, rustling night of being without beings) and the face of the Other as infinity.',
    tradition: 'Phenomenology / Jewish Philosophy',
    period: '1906–1995',
    keyWorks: ['Totality and Infinity', 'Otherwise than Being', 'Existence and Existents'],
    confidence: 0.95,
    sourceReference: 'Journal314 Part V, Sec. 1; Existence and Existents',
    tags: ['Il y a', 'Alterity', 'The Face', 'Otherwise than Being'],
    lens: 'Phenomenology of Despair',
    provenance: {
      origin: 'canonical_corpus',
      creator: 'N-KGAP Seed Authority',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-08-20T12:00:00Z'
    }
  },
  {
    id: 'thinker-derrida',
    label: 'Jacques Derrida',
    type: 'thinker',
    epistemicTier: 'INTERPRETATION',
    status: 'CANONICAL',
    description: 'Deconstructive philosopher exploring différance, the desert in the desert, negative theology without theology, and Khôra.',
    tradition: 'Deconstruction',
    period: '1930–2004',
    keyWorks: ['Margins of Philosophy', 'How to Avoid Speaking: Denials', 'Khôra', 'The Gift of Death'],
    confidence: 0.94,
    sourceReference: 'Journal314 Part V, Sec. 6; How to Avoid Speaking',
    tags: ['Différance', 'Khôra', 'Negative Theology', 'Apophatic'],
    lens: 'Radical Immanence',
    provenance: {
      origin: 'canonical_corpus',
      creator: 'N-KGAP Seed Authority',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-08-20T12:00:00Z'
    }
  },
  {
    id: 'thinker-blanchot',
    label: 'Maurice Blanchot',
    type: 'thinker',
    epistemicTier: 'TEXTUAL_CLAIM',
    status: 'CANONICAL',
    description: 'Novelist and theorist of literary negativity, the ungraspable disaster, the neutral (le neutre), and the dying that never arrives.',
    tradition: 'French Literary Theory / Philosophy',
    period: '1907–2003',
    keyWorks: ['The Space of Literature', 'The Writing of the Disaster', 'The Infinite Conversation'],
    confidence: 0.92,
    sourceReference: 'Journal314 Part V, Sec. 3; Writing of the Disaster',
    tags: ['The Disaster', 'The Neutral', 'Impossibility of Dying', 'Fragment'],
    lens: 'Phenomenology of Despair',
    provenance: {
      origin: 'canonical_corpus',
      creator: 'N-KGAP Seed Authority',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-08-20T12:00:00Z'
    }
  },
  {
    id: 'thinker-adorno',
    label: 'Theodor W. Adorno',
    type: 'thinker',
    epistemicTier: 'INTERPRETATION',
    status: 'CANONICAL',
    description: 'Dialectician of non-identity and negative dialectics: thought can only honor the damaged life by refusing false reconciliation.',
    tradition: 'Frankfurt School / Critical Theory',
    period: '1903–1969',
    keyWorks: ['Negative Dialectics', 'Minima Moralia', 'Dialectic of Enlightenment'],
    confidence: 0.93,
    sourceReference: 'Journal314 Part II, Sec. 9; Negative Dialectics (1966)',
    tags: ['Negative Dialectics', 'Non-Identity', 'Damaged Life', 'Auschwitz'],
    lens: 'Ontology of Collapse',
    provenance: {
      origin: 'canonical_corpus',
      creator: 'N-KGAP Seed Authority',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-08-20T12:00:00Z'
    }
  },

  // --- CORE NIHILTHEISM CONCEPTS & ONTOLOGICAL TIERS ---
  {
    id: 'concept-ungrund',
    label: 'The Ungrund (Groundless Void)',
    type: 'concept',
    epistemicTier: 'CANONICAL_PROJECT_DEFINITION',
    status: 'CANONICAL',
    description: 'The bottomless abyss preceding all being, non-being, deity, and world. The primordial groundlessness that constitutes absolute origin.',
    confidence: 0.99,
    sourceReference: 'Journal314 Part IV; Böhme Mysterium Magnum, Eckhart Sermon 52',
    tags: ['Abyss', 'Ungrund', 'Primal Emptiness', 'Metaphysical Core'],
    lens: 'Ontology of Collapse',
    provenance: {
      origin: 'canonical_corpus',
      creator: 'N-KGAP Seed Authority',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-08-20T12:00:00Z',
      verificationHash: 'sha256-ungrund-001',
      externalAnchor: 'anchor-001-canon'
    }
  },
  {
    id: 'concept-kenosis-of-void',
    label: 'Kenosis of the Void',
    type: 'concept',
    epistemicTier: 'CANONICAL_PROJECT_DEFINITION',
    status: 'CANONICAL',
    description: 'The double-movement wherein the collapse of finite metaphysical structures self-empties into the disclosure of the sacred.',
    confidence: 0.98,
    sourceReference: 'Journal314 Part III, Sec. 1; REN Chapter 4',
    tags: ['Kenosis', 'Double Emptiness', 'Nishitani', 'Altizer'],
    lens: 'Kyoto Metaphysics',
    provenance: {
      origin: 'canonical_corpus',
      creator: 'N-KGAP Seed Authority',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-08-20T12:00:00Z',
      verificationHash: 'sha256-kenosis-002',
      externalAnchor: 'anchor-001-canon'
    }
  },
  {
    id: 'concept-sacred-in-collapse',
    label: 'The Sacred in Collapse',
    type: 'concept',
    epistemicTier: 'NIHILTHEISTIC_RECONSTRUCTION',
    status: 'CANONICAL',
    description: 'The phenomenological moment when religious transcendence is not salvaged from catastrophe, but disclosed strictly AS the very reality of the catastrophe.',
    confidence: 0.97,
    sourceReference: 'Journal314 Part I & REN Chapter 1',
    tags: ['Sacred', 'Collapse', 'Nihilism', 'Religious Experience'],
    lens: 'Phenomenology of the Void',
    provenance: {
      origin: 'canonical_corpus',
      creator: 'N-KGAP Seed Authority',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-08-20T12:00:00Z',
      verificationHash: 'sha256-sacred-collapse-003',
      externalAnchor: 'anchor-001-canon'
    }
  },
  {
    id: 'concept-sunyata',
    label: 'Śūnyatā (Radical Emptiness)',
    type: 'concept',
    epistemicTier: 'CANONICAL_PROJECT_DEFINITION',
    status: 'CANONICAL',
    description: 'The Mahayana realization that all phenomena lack independent substantial essence, identical with co-dependent arising and total open relationality.',
    confidence: 0.99,
    sourceReference: 'Nagarjuna MMK; Nishitani Religion and Nothingness',
    tags: ['Sunyata', 'Emptiness', 'Madhyamaka', 'Nagarjuna'],
    lens: 'Kyoto Metaphysics',
    provenance: {
      origin: 'canonical_corpus',
      creator: 'N-KGAP Seed Authority',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-08-20T12:00:00Z'
    }
  },
  {
    id: 'concept-death-of-god',
    label: 'The Death of God',
    type: 'concept',
    epistemicTier: 'CANONICAL_PROJECT_DEFINITION',
    status: 'CANONICAL',
    description: 'The historical and ontological event marking the collapse of the highest transcendent values and metaphysical foundations of Western thought.',
    confidence: 0.98,
    sourceReference: 'Nietzsche The Gay Science §125; Altizer Gospel of Christian Atheism',
    tags: ['Death of God', 'Nihilism', 'Transvaluation', 'Crisis of Meaning'],
    lens: 'Ontology of Collapse',
    provenance: {
      origin: 'canonical_corpus',
      creator: 'N-KGAP Seed Authority',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-08-20T12:00:00Z'
    }
  },
  {
    id: 'concept-il-y-a',
    label: 'Il y a (The Anonymous Night)',
    type: 'concept',
    epistemicTier: 'PHENOMENOLOGICAL_DESCRIPTION',
    status: 'CANONICAL',
    description: 'The sheer, impersonal density of being that remains when everything has been destroyed; the insomnia of being without subjects or objects.',
    confidence: 0.94,
    sourceReference: 'Levinas Existence and Existents (1947); Journal314 Part V',
    tags: ['Il y a', 'Being', 'Insomnia', 'Horror'],
    lens: 'Phenomenology of Despair',
    provenance: {
      origin: 'canonical_corpus',
      creator: 'N-KGAP Seed Authority',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-08-20T12:00:00Z'
    }
  },
  {
    id: 'concept-decreation',
    label: 'Décréation (Decreation)',
    type: 'concept',
    epistemicTier: 'SOURCE_TEXT',
    status: 'CANONICAL',
    description: 'The voluntary, loving unmaking of the created ego, stepping aside from creaturely sovereignty so that the transcendent void may shine without obstacle.',
    confidence: 0.96,
    sourceReference: 'Simone Weil Gravity and Grace; Journal314 Part V',
    tags: ['Decreation', 'Weil', 'Ego Annihilation', 'Grace'],
    lens: 'Apophatic Theology',
    provenance: {
      origin: 'canonical_corpus',
      creator: 'N-KGAP Seed Authority',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-08-20T12:00:00Z'
    }
  },
  {
    id: 'concept-hyperousios',
    label: 'Hyperousios (Beyond Being)',
    type: 'concept',
    epistemicTier: 'TEXTUAL_CLAIM',
    status: 'CANONICAL',
    description: 'The classic apophatic designation of the divine as not existing as a being among beings, but transcending the category of substance altogether.',
    confidence: 0.95,
    sourceReference: 'Pseudo-Dionysius Mystical Theology; Marion God Without Being',
    tags: ['Hyperousios', 'Beyond Being', 'Apophatic', 'Transcendence'],
    lens: 'Apophatic Theology',
    provenance: {
      origin: 'canonical_corpus',
      creator: 'N-KGAP Seed Authority',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-08-20T12:00:00Z'
    }
  },
  {
    id: 'concept-extinction-realism',
    label: 'Extinction Realism',
    type: 'concept',
    epistemicTier: 'COUNTER_READING',
    status: 'CANONICAL',
    description: 'The materialist thesis that solar and cosmic death guarantees the absolute extinction of all mind and meaning, precluding any theological recovery.',
    confidence: 0.92,
    sourceReference: 'Ray Brassier Nihil Unbound; Journal314 Part VII',
    tags: ['Extinction', 'Materialism', 'Counter-Reading', 'Disenchantment'],
    lens: 'Ontology of Collapse',
    provenance: {
      origin: 'canonical_corpus',
      creator: 'N-KGAP Seed Authority',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-08-20T12:00:00Z'
    }
  },
  {
    id: 'concept-aporia-ethical-ground',
    label: 'Aporia of Groundless Ethics',
    type: 'aporia',
    epistemicTier: 'UNRESOLVED_APORIA',
    status: 'CANONICAL',
    description: 'If all metaphysical ontologies and divine commands have collapsed into the Ungrund, can ethics remain binding without covertly re-importing transcendent dogma?',
    confidence: 0.99,
    sourceReference: 'REN Chapter 6; Invariant E-I7',
    tags: ['Aporia', 'Ethics', 'Groundlessness', 'Nihilism'],
    lens: 'Phenomenology of Despair',
    provenance: {
      origin: 'canonical_corpus',
      creator: 'N-KGAP Seed Authority',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-08-20T12:00:00Z',
      epistemicJustification: 'Preserves the core philosophical tension between normative compassion and ontological void.'
    }
  },
  {
    id: 'claim-collapse-as-revelation',
    label: 'Claim: The Collapse of Being is Epiphanic',
    type: 'claim',
    epistemicTier: 'NIHILTHEISTIC_RECONSTRUCTION',
    status: 'PROVISIONAL',
    description: 'The subjective experience of total nihilistic collapse strips away idolatrous metaphysical reifications, functioning as the ultimate apophatic purgation.',
    confidence: 0.86,
    sourceReference: 'REN Section 2; Nishitani Ch. 3',
    tags: ['Epiphany', 'Collapse', 'Idolatry', 'Purgation'],
    lens: 'Phenomenology of the Void',
    provenance: {
      origin: 'canonical_corpus',
      creator: 'N-KGAP Seed Authority',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-08-20T12:00:00Z'
    }
  }
];

const LEGACY_EDGES: GraphEdge[] = [
  {
    id: 'edge-nietzsche-schopenhauer',
    source: 'thinker-schopenhauer',
    target: 'thinker-nietzsche',
    relation: 'influences',
    epistemicWeight: 0.95,
    notes: 'Schopenhauers Will provides the diagnostic origin of Nietzsches Will to Power.',
    status: 'CANONICAL'
  },
  {
    id: 'edge-nietzsche-death-of-god',
    source: 'thinker-nietzsche',
    target: 'concept-death-of-god',
    relation: 'grounds',
    epistemicWeight: 0.99,
    notes: 'Nietzsches Madman announces the Death of God as cultural and ontological fact.',
    status: 'CANONICAL'
  },
  {
    id: 'edge-nishitani-nietzsche',
    source: 'thinker-nietzsche',
    target: 'thinker-nishitani',
    relation: 'inverts',
    epistemicWeight: 0.94,
    notes: 'Nishitani radicalizes Nietzsches relative nihilism into the absolute Sunyata field.',
    status: 'CANONICAL'
  },
  {
    id: 'edge-nishitani-nagarjuna',
    source: 'thinker-nagarjuna',
    target: 'thinker-nishitani',
    relation: 'grounds',
    epistemicWeight: 0.98,
    notes: 'Madhyamaka Sunyata provides the Buddhist foundation for Nishitanis critique of Western metaphysics.',
    status: 'CANONICAL'
  },
  {
    id: 'edge-nishida-nishitani',
    source: 'thinker-nishida',
    target: 'thinker-nishitani',
    relation: 'influences',
    epistemicWeight: 0.93,
    notes: 'Nishidas logic of Basho directly informs Nishitanis field of Emptiness.',
    status: 'CANONICAL'
  },
  {
    id: 'edge-eckhart-ungrund',
    source: 'thinker-eckhart',
    target: 'concept-ungrund',
    relation: 'grounds',
    epistemicWeight: 0.97,
    notes: 'Eckhartian Gottheit is the mystical precursor to Boehmes explicit Ungrund doctrine.',
    status: 'CANONICAL'
  },
  {
    id: 'edge-boehme-ungrund',
    source: 'thinker-boehme',
    target: 'concept-ungrund',
    relation: 'grounds',
    epistemicWeight: 0.99,
    notes: 'Boehme coins and systematizes the Ungrund as the primal abyss.',
    status: 'CANONICAL'
  },
  {
    id: 'edge-pseudo-dionysius-hyperousios',
    source: 'thinker-pseudo-dionysius',
    target: 'concept-hyperousios',
    relation: 'grounds',
    epistemicWeight: 0.96,
    notes: 'Pseudo-Dionysius establishes Hyperousios as the core term for negative theology.',
    status: 'CANONICAL'
  },
  {
    id: 'edge-marion-pseudo-dionysius',
    source: 'thinker-pseudo-dionysius',
    target: 'thinker-marion',
    relation: 'influences',
    epistemicWeight: 0.92,
    notes: 'Marions theology of givenness and praise draws heavily on Dionysian apophasis.',
    status: 'CANONICAL'
  },
  {
    id: 'edge-altizer-death-of-god',
    source: 'concept-death-of-god',
    target: 'thinker-altizer',
    relation: 'radicalizes',
    epistemicWeight: 0.95,
    notes: 'Altizer turns the Death of God into a radically kenotic Christological event.',
    status: 'CANONICAL'
  },
  {
    id: 'edge-altizer-kenosis',
    source: 'thinker-altizer',
    target: 'concept-kenosis-of-void',
    relation: 'synthesizes',
    epistemicWeight: 0.96,
    notes: 'Altizers Christology directly informs the Nihiltheistic doctrine of Kenosis of the Void.',
    status: 'CANONICAL'
  },
  {
    id: 'edge-brassier-extinction',
    source: 'thinker-brassier',
    target: 'concept-extinction-realism',
    relation: 'grounds',
    epistemicWeight: 0.97,
    notes: 'Brassier establishes extinction as the trauma of reason in Nihil Unbound.',
    status: 'CANONICAL'
  },
  {
    id: 'edge-brassier-sacred-collapse',
    source: 'concept-extinction-realism',
    target: 'concept-sacred-in-collapse',
    relation: 'opposes',
    epistemicWeight: 0.93,
    notes: 'Extinction realism rejects any theological re-enchantment of the cosmic void.',
    status: 'CANONICAL'
  },
  {
    id: 'edge-cioran-shestov',
    source: 'thinker-shestov',
    target: 'thinker-cioran',
    relation: 'influences',
    epistemicWeight: 0.88,
    notes: 'Shestovs revolt against rational necessity echoes in Ciorans despair.',
    status: 'CANONICAL'
  },
  {
    id: 'edge-levinas-il-y-a',
    source: 'thinker-levinas',
    target: 'concept-il-y-a',
    relation: 'grounds',
    epistemicWeight: 0.99,
    notes: 'Levinas discovers the Il y a as the nocturnal rustling of anonymous being.',
    status: 'CANONICAL'
  },
  {
    id: 'edge-weil-decreation',
    source: 'thinker-weil',
    target: 'concept-decreation',
    relation: 'grounds',
    epistemicWeight: 0.98,
    notes: 'Weil establishes decreation as the central ascetic-mystical act of self-emptying.',
    status: 'CANONICAL'
  },
  {
    id: 'edge-heidegger-ungrund',
    source: 'thinker-heidegger',
    target: 'concept-ungrund',
    relation: 'apophatic_counterpart',
    epistemicWeight: 0.91,
    notes: 'Heideggers das Nichts (What is Metaphysics?) acts as modern philosophical counterpart to Eckharts Gottheit.',
    status: 'CANONICAL'
  },
  {
    id: 'edge-sacred-collapse-aporia',
    source: 'concept-sacred-in-collapse',
    target: 'concept-aporia-ethical-ground',
    relation: 'deconstructs',
    epistemicWeight: 0.89,
    notes: 'The collapse of the sacred threatens to dismantle the grounds of moral obligation.',
    status: 'CANONICAL'
  }
];

export const INITIAL_NOTES: ResearchNote[] = [
  {
    id: 'note-001',
    title: 'The Ungrund as Neither Being Nor Non-Being',
    content: `# The Ungrund as Neither Being Nor Non-Being

In Boehme's *Mysterium Magnum* and Eckhart's *Sermon 52*, the divine Godhead (Gottheit) is not a supreme entity or "highest being" (ens summum), but an abyss that precedes all ontological categories.

## Critical Invariant E-I4 Check
"The Transcendent" must remain strictly apophatic and phenomenological. It must not be treated as a determinate entity.

### Key Connections
- Connects with [[concept-ungrund]]
- Prefigures [[thinker-heidegger]]'s ontological difference
- Parallels [[thinker-nishitani]]'s account of Sunyata as field of Emptiness

> "The Ungrund is an eternal nothing, but a stillness without a beginning." — Jacob Böhme`,
    tags: ['Ungrund', 'Apophatic', 'Negative Theology', 'Kyoto School'],
    backlinks: ['concept-ungrund', 'thinker-eckhart', 'thinker-boehme'],
    linkedNodeIds: ['concept-ungrund', 'thinker-eckhart', 'thinker-boehme'],
    epistemicTier: 'TEXTUAL_CLAIM',
    status: 'CANONICAL',
    createdAt: '2026-02-10T14:30:00Z',
    updatedAt: '2026-08-20T10:15:00Z',
    isAddedToWorkingGraph: true
  },
  {
    id: 'note-002',
    title: 'Nishitani vs Nietzsche: Transvaluation vs Field of Emptiness',
    content: `# Nishitani vs Nietzsche: Transvaluation vs Field of Emptiness

While [[thinker-nietzsche]] diagnosed the Death of God and proposed the active will to power as the overcoming of nihilism, [[thinker-nishitani]] argues in *Religion and Nothingness* that Nietzsche remained caught on the "standpoint of relative nothingness" (nihil).

## The Dialectical Turn
1. **Nietzsche's Nihil**: Overcomes traditional metaphysics but leaves the ego's will confronting an empty abyss.
2. **Nishitani's Sunyata**: Transposes the abyss into the field of Absolute Emptiness where reality is recovered *as it is* (tathata).

See also [[concept-kenosis-of-void]] and [[thinker-nagarjuna]].`,
    tags: ['Nietzsche', 'Nishitani', 'Sunyata', 'Will to Power'],
    backlinks: ['thinker-nietzsche', 'thinker-nishitani', 'concept-kenosis-of-void'],
    linkedNodeIds: ['thinker-nietzsche', 'thinker-nishitani', 'concept-kenosis-of-void'],
    epistemicTier: 'INTERPRETATION',
    status: 'CANONICAL',
    createdAt: '2026-02-15T09:00:00Z',
    updatedAt: '2026-08-19T18:20:00Z',
    isAddedToWorkingGraph: true
  },
  {
    id: 'note-003',
    title: 'The Brassier Challenge: Eliminative Extinction',
    content: `# The Brassier Challenge: Eliminative Extinction

In *Nihil Unbound*, [[thinker-brassier]] launches a devastating critique of all "speculative theological" recoveries of nihilism.

## The Extinction Premise
- Scientific cosmology establishes the physical certainty of solar annihilation and cosmic heat death.
- Extinction is not a thought experiment; it is the physical horizon of all thought.
- Therefore, treating the void as "sacred" or "kenotic" is an ideological evasion of disenchantment.

### Methodological Response
How does Nihiltheism respond without falling into naive fideism?
- By acknowledging that Nihiltheism does not offer an *empirical rescue* from physical death, but investigates the *immanent structure of disclosure* in despair.
- Preserves [[concept-extinction-realism]] as a permanent counter-reading (Invariant E-I5).`,
    tags: ['Brassier', 'Extinction', 'Speculative Realism', 'Counter-Reading'],
    backlinks: ['thinker-brassier', 'concept-extinction-realism', 'concept-sacred-in-collapse'],
    linkedNodeIds: ['thinker-brassier', 'concept-extinction-realism', 'concept-sacred-in-collapse'],
    epistemicTier: 'COUNTER_READING',
    status: 'CANONICAL',
    createdAt: '2026-03-01T11:45:00Z',
    updatedAt: '2026-08-20T16:00:00Z',
    isAddedToWorkingGraph: true
  }
];

export const INITIAL_ARGUMENTS: ArgumentItem[] = [
  {
    id: 'arg-001',
    title: 'The Kenotic Inversion of Nihilism',
    claim: 'The total existential realization of nihilism is structurally isomorphic to the apophatic self-emptying of the sacred.',
    premises: [
      'P1: Traditional metaphysical theology collapses when its propositional dogmas are recognized as idolatrous reifications of finite concepts (Nietzsche, Altizer).',
      'P2: The experience of nihilistic despair strips the subject of all conceptual and ontological foundations (Cioran, Kierkegaard, Levinas).',
      'P3: Classic negative theology holds that genuine contact with the divine occurs only when all conceptual idols and creaturely projections are totally annihilated (Pseudo-Dionysius, Eckhart, Weil).',
      'P4: In Buddhist Madhyamaka and Kyoto School metaphysics, the thoroughgoing negation of substantial essence (svabhava) reveals the field of radiant relational emptiness (Nagarjuna, Nishitani).'
    ],
    conclusion: 'Therefore, the phenomenological trajectory of nihilism, when pursued to its absolute limit without premature despair or dogmatic retreat, opens onto the apophatic field of the Sacred in Collapse.',
    strength: 'phenomenological',
    status: 'support',
    epistemicTier: 'NIHILTHEISTIC_RECONSTRUCTION',
    sources: ['Journal314 Part I-IV', 'Nishitani Religion and Nothingness (1961)', 'Altizer Gospel of Christian Atheism (1966)'],
    counterarguments: [
      'Brassier: Extinction is purely physical elimination; attributing spiritual epiphany to cosmological death is anthropocentric consolation.',
      'Naturalism: Despair is merely neurochemical dysregulation, lacking metaphysical significance.'
    ],
    linkedNodeIds: ['concept-kenosis-of-void', 'concept-sacred-in-collapse', 'thinker-nishitani', 'thinker-eckhart'],
    updatedAt: '2026-08-20T15:30:00Z'
  },
  {
    id: 'arg-002',
    title: 'The Non-Inferential Status of Groundless Ethics',
    claim: 'Ethical obligation cannot be formally deduced from the ontological void without committing a naturalistic fallacy (Invariant E-I7).',
    premises: [
      'P1: The Ungrund is intrinsically devoid of prescriptive moral laws, telos, or divine commandments.',
      'P2: An ontological description of nothingness cannot generate a normative "ought" by deductive inference alone.',
      'P3: However, the shared fragility of beings in the void induces an immediate, pre-reflective compassion (Schopenhauer, Levinas).'
    ],
    conclusion: 'Therefore, Nihiltheistic ethics must be framed as a responsive phenomenological posture of mutual vulnerability rather than a derived metaphysical proof.',
    strength: 'abductive',
    status: 'unresolved_aporia',
    epistemicTier: 'UNRESOLVED_APORIA',
    sources: ['REN Chapter 6', 'Schopenhauer Basis of Morality', 'Levinas Otherwise than Being'],
    counterarguments: [
      'Nietzsche: Compassion is merely the morality of the herd; groundlessness should liberate the sovereign strong from egalitarian guilt.',
      'Moral Nihilism: If there is no cosmic anchor, all moral claims are error or emotional preference.'
    ],
    linkedNodeIds: ['concept-aporia-ethical-ground', 'thinker-schopenhauer', 'thinker-levinas', 'thinker-nietzsche'],
    updatedAt: '2026-08-20T16:10:00Z'
  }
];

export const INITIAL_DEFENSE: DefenseItem[] = [
  {
    id: 'defense-001',
    question: 'How do you prevent "Nihiltheism" from simply being an aestheticized rebranding of traditional negative theology or Buddhist Sunyata?',
    category: 'Cross-Traditional Comparative',
    difficulty: 'Hostile Committee',
    draftAnswer: 'Nihiltheism differs from classical negative theology because it does not assume a transcendent Platonist "Hyperousios" waiting behind the cloud of unknowing. Unlike classical apophasis, which presumes a God who is ultimately full of light beyond light, Nihiltheism incorporates the modern catastrophe of the Death of God and physical extinction realism. Unlike standard Western readings of Sunyata, it integrates the existential trauma of Western historical crisis and the Christian kenotic tradition. It is not an uncritical synthesis, but a rigorous comparative architecture grounded in the mutual critique between Kyoto metaphysics and Western disenchantment.',
    linkedEvidence: ['Journal314 Part III & IV', 'Nishitani Ch. 2', 'Marion God Without Being §3'],
    linkedNodeIds: ['thinker-nishitani', 'thinker-eckhart', 'concept-kenosis-of-void', 'concept-extinction-realism'],
    weakPoints: ['Needs clearer textual comparison between Eckharts Abgeschiedenheit and Nishitanis Sunyata', 'Must defend against charges of syncretism'],
    evaluationNotes: 'High conceptual rigor; committee will press on whether the term "Theism" remains justified or if it is misleading.',
    isReady: true,
    updatedAt: '2026-08-20T17:00:00Z'
  },
  {
    id: 'defense-002',
    question: 'Does your invocation of phenomenological "intensity" in despair commit an unwarranted leap from psychological experience to metaphysical claim (Invariant E-I1)?',
    category: 'Epistemic Groundlessness',
    difficulty: 'Hostile Committee',
    draftAnswer: 'No, because Nihiltheism strictly abides by Invariant E-I1: phenomenological intensity does not entail ontology. The experience of despair or the collapse of meaning is not treated as a deductive "proof" of an existing metaphysical entity. Rather, phenomenological reduction (epoche) brackes all ontological dogmas, allowing us to describe how meaning breaks down. The claim is structural and hermeneutic: despair discloses the contingency of all finite idols. We do not claim the void "is God"; we claim the void is the site where the idol of "God as highest entity" is destroyed.',
    linkedEvidence: ['Invariant E-I1 Specification', 'Heidegger What is Metaphysics?', 'Levinas Existence and Existents'],
    linkedNodeIds: ['concept-il-y-a', 'thinker-heidegger', 'thinker-levinas', 'concept-sacred-in-collapse'],
    weakPoints: ['Must ensure language in Chapter 4 does not slip into speculative dogmatism'],
    evaluationNotes: 'Solid epistemological defense adhering to system invariant E-I1.',
    isReady: true,
    updatedAt: '2026-08-20T17:30:00Z'
  },
  {
    id: 'defense-003',
    question: 'How do you answer Ray Brassiers argument that extinction completely annihilates any possibility of meaning or theological disclosure?',
    category: 'Ontological Void',
    difficulty: 'Deep Aporia',
    draftAnswer: 'Brassier is correct that cosmological extinction permanently refutes any anthropocentric teleology or providential history. Nihiltheism accepts Brassiers extinction premise in full (documented in our counter-reading ledger). However, Brassier treats nihilism purely as a conceptual consequence of scientific disenchantment. Nihiltheism shows that extinction itself operates as the ultimate theological decreation (in the sense of Simone Weil). The total refusal of consolation is precisely what prevents Nihiltheism from degenerating into New Age spirituality.',
    linkedEvidence: ['Brassier Nihil Unbound Ch. 7', 'Weil Gravity and Grace', 'Journal314 Part VII'],
    linkedNodeIds: ['thinker-brassier', 'thinker-weil', 'concept-extinction-realism'],
    weakPoints: ['Committee realist may argue that calling extinction "decreation" is still a semantic sleight of hand'],
    evaluationNotes: 'Honest engagement with the strongest counter-argument in modern philosophical realism.',
    isReady: true,
    updatedAt: '2026-08-20T18:00:00Z'
  }
];

export const INITIAL_LIBRARY: LibraryDocument[] = [
  {
    id: 'doc-journal314-part1',
    filename: 'Journal314_Part1_Western_Nihilism_Genealogy.md',
    title: 'Journal314 — Part I: The Genealogy of Western Nihilism',
    author: 'Research Corpus Archive',
    content: `# Journal314: Part I — The Genealogy of Western Nihilism

## 1. Nietzsche & The Death of God
Nietzsche's declaration in *The Gay Science* §125 represents the irreversible threshold of modern thought. The death of God is not an intellectual atheistic victory over superstition; it is a cosmic catastrophe:
> "Whither is God? I will tell you. We have killed him—you and I. All of us are his murderers. But how did we do this? How could we drink up the sea? Who gave us the sponge to wipe away the entire horizon?"

## 2. Schopenhauer and the Cosmic Malady
Schopenhauer stripped the Enlightenment of its progressive illusions:
> "All willing springs from lack, from deficiency, and thus from suffering. Fulfillment brings satiety, and boredom ensues. Life swings like a pendulum between pain and boredom."

## 3. Mainländer's Cosmic Death
Mainländer radicalizes the suicide of God:
> "God died, and His death was the life of the world."`,
    sha256: '9a87f1c32b5e43a9018e45dc11204892c908f92110c9a8b7e6f5d4c3b2a10011',
    sizeBytes: 1240,
    format: 'md',
    importedAt: '2026-01-15T10:00:00Z',
    canonicalStatus: 'CANONICAL',
    extractedQuotesCount: 18,
    tags: ['Journal314', 'Nietzsche', 'Schopenhauer', 'Mainlander', 'Genealogy']
  },
  {
    id: 'doc-journal314-part3',
    filename: 'Journal314_Part3_Kyoto_School_Emptiness.md',
    title: 'Journal314 — Part III: The Kyoto School and Absolute Nothingness',
    author: 'Research Corpus Archive',
    content: `# Journal314: Part III — The Kyoto School and Absolute Nothingness

## 1. Nishitani: From Nihil to Sunyata
In *Religion and Nothingness*, Keiji Nishitani provides the crucial bridge between European existentialism and Mahayana Buddhist philosophy:
> "At the bottom of nihilism lies the abyss of absolute emptiness (Sunyata), which is at once the field of Great Compassion."

## 2. Nishida's Logic of Basho
Nishida demonstrates that absolute nothingness is not the negation of being, but the boundless 'place' (Basho) in which both being and non-being are embraced.`,
    sha256: 'e8391b44c801f92a34bc9812497df8901bca782194ef653018276cd901827461',
    sizeBytes: 1420,
    format: 'md',
    importedAt: '2026-01-15T10:30:00Z',
    canonicalStatus: 'CANONICAL',
    extractedQuotesCount: 24,
    tags: ['Journal314', 'Nishitani', 'Nishida', 'Kyoto School', 'Sunyata']
  },
  {
    id: 'doc-ren-overview',
    filename: 'REN_The_Religious_Experience_of_Nihilism.md',
    title: 'The Religious Experience of Nihilism (REN) — Core Monograph',
    author: 'Philosophical Research Project',
    content: `# The Religious Experience of Nihilism (REN)

## Thesis Statement
The crisis of nihilism is not the extinction of religious experience, but its purification through the complete destruction of idolized metaphysical guarantees. When the subject passes through the zero-point of meaning, what is disclosed is not secular indifference, but the apophatic presence of the Ungrund.

### Epistemic Safeguards & Invariants
- E-I1: Phenomenological intensity does not entail ontology.
- E-I2: Cross-traditional recurrence does not establish metaphysical identity.
- E-I3: The collapse of finite meaning may be investigated as disclosure without being treated as proof of a determinate deity.
- E-I7: Ethical conclusions must not be automatically inferred from groundlessness.`,
    sha256: '7b8123049acfe18490218efbca90128472901238472910482019482019482019',
    sizeBytes: 1890,
    format: 'md',
    importedAt: '2026-01-20T12:00:00Z',
    canonicalStatus: 'CANONICAL',
    extractedQuotesCount: 32,
    tags: ['REN', 'Monograph', 'Epistemic Invariants', 'Core Thesis']
  }
];

export const INITIAL_GOVERNANCE_LEDGER: GovernanceRecord[] = [
  {
    id: 'gov-rec-001',
    timestamp: '2026-01-01T00:00:00Z',
    entityId: 'thinker-nietzsche',
    entityLabel: 'Friedrich Nietzsche',
    entityType: 'node',
    previousStatus: 'PROMOTION_READY',
    newStatus: 'CANONICAL',
    agentRole: 'HUMAN_OPERATOR',
    confirmationPhrase: 'I HAVE INSPECTED THE SOURCE',
    justification: 'Canonical anchor figure in Journal314 Part I. Direct textual verification against The Gay Science §125 confirmed.',
    conjunctiveChecksPassed: {
      sourceVerified: true,
      textualFidelity: true,
      epistemicBoundaryChecked: true,
      noOntologicalOverreach: true,
      humanInspected: true
    },
    previousHash: 'GENESIS_HASH_000000000000000000000000000000000000000000000000000000000000',
    recordHash: 'sha256-gov-001-c89a712f890123',
    externalAnchorId: 'anchor-001-canon'
  },
  {
    id: 'gov-rec-002',
    timestamp: '2026-01-01T00:05:00Z',
    entityId: 'thinker-nishitani',
    entityLabel: 'Keiji Nishitani',
    entityType: 'node',
    previousStatus: 'PROMOTION_READY',
    newStatus: 'CANONICAL',
    agentRole: 'HUMAN_OPERATOR',
    confirmationPhrase: 'I HAVE INSPECTED THE SOURCE',
    justification: 'Principal theoretical foundation for the field of Emptiness. Verified against Religion and Nothingness (1961).',
    conjunctiveChecksPassed: {
      sourceVerified: true,
      textualFidelity: true,
      epistemicBoundaryChecked: true,
      noOntologicalOverreach: true,
      humanInspected: true
    },
    previousHash: 'sha256-gov-001-c89a712f890123',
    recordHash: 'sha256-gov-002-da781290348123',
    externalAnchorId: 'anchor-001-canon'
  },
  {
    id: 'gov-rec-003',
    timestamp: '2026-01-01T00:10:00Z',
    entityId: 'concept-ungrund',
    entityLabel: 'The Ungrund (Groundless Void)',
    entityType: 'node',
    previousStatus: 'PROMOTION_READY',
    newStatus: 'CANONICAL',
    agentRole: 'HUMAN_OPERATOR',
    confirmationPhrase: 'I HAVE INSPECTED THE SOURCE',
    justification: 'Ontological definition verified against Boehme Mysterium Magnum and Meister Eckhart Sermon 52.',
    conjunctiveChecksPassed: {
      sourceVerified: true,
      textualFidelity: true,
      epistemicBoundaryChecked: true,
      noOntologicalOverreach: true,
      humanInspected: true
    },
    previousHash: 'sha256-gov-002-da781290348123',
    recordHash: 'sha256-gov-003-891d4e09812344',
    externalAnchorId: 'anchor-001-canon'
  }
];

export const INITIAL_SPOT_CHECKS: SpotCheckRecord[] = [
  {
    id: 'spot-001',
    timestamp: '2026-08-20T08:00:00Z',
    entityId: 'thinker-nietzsche',
    entityLabel: 'Friedrich Nietzsche',
    auditResult: 'PASS',
    reason: 'Source hash sha256-nietzsche-c48f2b matches canonical corpus ledger. No mutation detected.',
    inspector: 'Ω-Sentinel',
    sourceHashChecked: true
  },
  {
    id: 'spot-002',
    timestamp: '2026-08-20T08:05:00Z',
    entityId: 'thinker-nishitani',
    entityLabel: 'Keiji Nishitani',
    auditResult: 'PASS',
    reason: 'Immutable ledger record sha256-gov-002-da781290348123 hash chain intact.',
    inspector: 'Ω-Sentinel',
    sourceHashChecked: true
  },
  {
    id: 'spot-003',
    timestamp: '2026-08-20T08:10:00Z',
    entityId: 'concept-ungrund',
    entityLabel: 'The Ungrund (Groundless Void)',
    auditResult: 'PASS',
    reason: 'Conjunctive verification rules fully satisfied. External anchor verified.',
    inspector: 'Ω-Sentinel',
    sourceHashChecked: true
  }
];

export const INITIAL_SAVED_VIEWS: SavedView[] = [
  {
    id: 'view-all-canon',
    name: 'Canonical Core & Thinkers',
    description: 'Displays the 53 canonical figures and core ontological concepts.',
    activeLens: 'All',
    activeFilterTypes: ['thinker', 'concept'],
    epistemicFilter: ['CANONICAL_PROJECT_DEFINITION', 'SOURCE_TEXT', 'NIHILTHEISTIC_RECONSTRUCTION'],
    searchTerms: '',
    cameraZoom: 1,
    cameraCenter: [0, 0],
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'view-kyoto-dialogue',
    name: 'Kyoto School & Negative Theology',
    description: 'Focus on the intersection of Sunyata, Gottheit, and Kenosis.',
    activeLens: 'Kyoto Metaphysics',
    activeFilterTypes: ['thinker', 'concept', 'claim'],
    epistemicFilter: ['CANONICAL_PROJECT_DEFINITION', 'SOURCE_TEXT', 'INTERPRETATION'],
    searchTerms: 'Nishitani Eckhart Sunyata Ungrund',
    cameraZoom: 1.2,
    cameraCenter: [100, -50],
    createdAt: '2026-02-01T00:00:00Z'
  },
  {
    id: 'view-counter-readings',
    name: 'Extinction & Counter-Readings',
    description: 'Adversarial materialist challenges (Brassier, Thacker, Naturalism) and unresolved aporias.',
    activeLens: 'Ontology of Collapse',
    activeFilterTypes: ['thinker', 'concept', 'aporia', 'objection'],
    epistemicFilter: ['COUNTER_READING', 'OBJECTION', 'UNRESOLVED_APORIA'],
    searchTerms: 'Brassier Extinction Aporia',
    cameraZoom: 1.1,
    cameraCenter: [-80, 120],
    createdAt: '2026-03-01T00:00:00Z'
  }
];
