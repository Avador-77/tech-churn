import { Article } from './types';

export const SEED_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'OpenAI Unveils Next-Gen Multimodal Reasoning Models for Real-Time Code Synthesis',
    slug: 'openai-next-gen-multimodal-reasoning-models',
    summary: 'The new model architecture introduces real-time reasoning capability with zero latency code synthesis and interactive debugging tools.',
    content: `OpenAI has announced its latest breakthrough in AI model architectures, focusing on ultra-fast reasoning and native multimodal comprehension.

Key Highlights:
• Sub-100ms Reasoning: Complex reasoning chains execute in real-time, enabling interactive live pair-programming experiences.
• Context Extension: Supports up to 2 million tokens of active working memory with precise recall.
• Multi-Agent Coordination: Native protocols for multi-agent delegation without prompt engineering overhead.

"We are entering an era where AI agents do not just output text, but actively collaborate with human developers in zero-latency feedback loops," said the chief research lead during the live keynote presentation.

Developers can now integrate these capabilities using standard API endpoints, with backward compatibility for existing completions and chat formats. Early benchmark results show an impressive 40% reduction in logic hallucination across complex math and software engineering evaluations.`,
    image_url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1000&auto=format&fit=crop',
    source_name: 'TechCrunch',
    source_url: 'https://techcrunch.com',
    category: '🤖 AI',
    published_at: '2026-07-25T09:30:00Z',
    read_time_minutes: 4,
    likes_count: 342,
  },
  {
    id: 'art-2',
    title: 'Quantum Chipset Breaks 1,000 Logical Qubit Barrier in Room Temperature Trial',
    slug: 'quantum-chipset-breaks-1000-logical-qubit-barrier',
    summary: 'Engineers achieve fault-tolerant quantum calculation at near room temperature using novel optical crystal lattices.',
    content: `A consortium of quantum physics research labs has announced a monumental milestone: maintaining over 1,000 fault-tolerant logical qubits at room temperature.

Breakthrough Details:
• Optical Lattice Matrix: Uses micro-machined sapphire substrates to trap ions with lasers instead of liquid helium supercooling.
• Error Correction Rate: Achieves a surface code error threshold under 0.001%, allowing continuous operations for hours.
• Commercial Impact: Accelerates molecular dynamics simulation for novel battery chemistries and oncology drug discovery.

This hardware leap reduces the infrastructure footprint of quantum computers from massive sub-zero refrigeration tanks to standard server rack units. Commercial deployment is projected for late 2027.`,
    image_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop',
    source_name: 'Wired',
    source_url: 'https://wired.com',
    category: '⚡ Gadgets',
    published_at: '2026-07-25T08:15:00Z',
    read_time_minutes: 6,
    likes_count: 518,
  },
  {
    id: 'art-3',
    title: 'Next-Gen Foldable Smartphones Integrate Solid-State Batteries for 3-Day Battery Life',
    slug: 'foldable-smartphones-solid-state-batteries',
    summary: 'The latest mobile devices pack 7,500mAh capacity in a sleek 6mm chassis without overheating or battery degradation risks.',
    content: `Mobile hardware makers have unveiled the first consumer smartphones equipped with commercial solid-state electrolyte batteries.

What Makes This Revolutionizing:
• 7,500 mAh in a 6.1mm Body: Double the energy density of traditional lithium-ion packs.
• Ultra-Fast 200W Charging: 0 to 100% full charge achieved in under 9 minutes.
• Zero Swelling Risk: Solid electrolyte removes thermal runaway hazards completely.

The fold mechanism has also been updated with self-healing fluid hinges, eliminating screen creases after 500,000 flex test cycles.`,
    image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000&auto=format&fit=crop',
    source_name: 'The Verge',
    source_url: 'https://theverge.com',
    category: '📱 Smartphones',
    published_at: '2026-07-24T18:45:00Z',
    read_time_minutes: 5,
    likes_count: 289,
  },
  {
    id: 'art-4',
    title: 'Zero-Day Flaw in WebAssembly Runtime Patched Across Major Browsers',
    slug: 'zero-day-flaw-in-webassembly-runtime-patched',
    summary: 'Security researchers discovered a memory isolation vulnerability affecting edge runtimes, prompting emergency updates.',
    content: `Security teams across major browser vendors and cloud providers have released coordinated emergency patches for a critical WebAssembly memory isolation flaw.

Security Briefing:
• CVE Identification: CVE-2026-9812 with a critical severity score.
• Vulnerability Vector: Out-of-bounds heap read and write in JIT compiler optimization passes.
• Remediation: Users and server admins are advised to update Chromium, Firefox, WebKit, and serverless Node.js runtimes immediately.

No active wild exploits targeting end users have been identified prior to disclosure thanks to responsible bug bounty reporting.`,
    image_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop',
    source_name: 'Ars Technica',
    source_url: 'https://arstechnica.com',
    category: '🔐 Cybersecurity',
    published_at: '2026-07-24T14:20:00Z',
    read_time_minutes: 3,
    likes_count: 412,
  },
  {
    id: 'art-5',
    title: 'SpaceX Starship Successfully Deploys Orbital Solar Relay System',
    slug: 'spacex-starship-orbital-solar-relay-system',
    summary: 'Starship flight test 12 successfully orbitally deployed wireless energy receiver satellites designed for 24/7 clean energy beaming.',
    content: `In a historic aerospace achievement, Starship completed mission payload deployment for the orbital solar reflector array.

Mission Milestones:
• In-Space Refueling: Automated propellant transfer completed in low Earth orbit.
• Payload Deployment: Deployed 12 high-efficiency photovoltaic solar mirrors designed to beam microwave energy to ground receivers.
• Booster Catch: Super Heavy booster returned safely to launch tower arms with millimeter accuracy.

This test demonstrates the viability of space-based solar power generation for remote off-grid emergency relief stations.`,
    image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
    source_name: 'SpaceNews',
    source_url: 'https://spacenews.com',
    category: '🌌 Space',
    published_at: '2026-07-24T11:00:00Z',
    read_time_minutes: 5,
    likes_count: 670,
  },
  {
    id: 'art-6',
    title: 'Clean Tech Startup Raises $250M for Direct-Air Carbon-to-Fuel Conversion',
    slug: 'clean-tech-startup-raises-250m-carbon-fuel',
    summary: 'Novel electrochemical catalysts convert captured atmospheric CO2 directly into carbon-neutral aviation fuel at commercial scale.',
    content: `Climate tech startup SynFuel Global has closed a $250 million Series C financing round led by major clean tech funds.

How it Works:
• Direct air capture towers harvest atmospheric carbon dioxide.
• Water electrolysis powered by geothermal energy produces green hydrogen.
• Proprietary catalyst combines CO2 and H2 into synthetic Jet-A fuel with zero net emissions.

The company plans to complete its first commercial production facility producing 50 million gallons annually by 2028.`,
    image_url: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=1000&auto=format&fit=crop',
    source_name: 'TechCrunch',
    source_url: 'https://techcrunch.com',
    category: '🚀 Startups',
    published_at: '2026-07-23T16:10:00Z',
    read_time_minutes: 4,
    likes_count: 215,
  },
  {
    id: 'art-7',
    title: 'Unreal Engine 6 Preview Showcases Photorealistic Physics and Neural Lighting',
    slug: 'unreal-engine-6-preview-photorealistic-physics',
    summary: 'Epic Games reveals next-generation engine architecture featuring real-time neural path tracing and dynamic fluid dynamics.',
    content: `Epic Games hosted its annual developer summit, debuting Unreal Engine 6 with revolutionary graphics rendering pipelines.

Features Highlighted:
• Neural Radiance Fields (NeRFs): Instant 3D environment generation from video clips.
• Sub-Atom Physics Engine: Accurate fluid, destruction, and cloth simulation computed entirely on GPU compute shaders.
• Cross-Platform Scalability: Seamless scale from high-end VR headsets to mobile browsers.

The developer preview build is available starting today for early access partner studios.`,
    image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop',
    source_name: 'Polygon',
    source_url: 'https://polygon.com',
    category: '🎮 Gaming',
    published_at: '2026-07-23T13:40:00Z',
    read_time_minutes: 5,
    likes_count: 480,
  },
  {
    id: 'art-8',
    title: 'TypeScript 6.0 Ships Native WebAssembly Compilation and Instant Type Checker',
    slug: 'typescript-6-ships-native-wasm-compilation',
    summary: 'The latest major release rewritten in Rust delivers 50x faster type checking and direct compilation targets for serverless edge environments.',
    content: `Microsoft's TypeScript team has officially announced TypeScript 6.0, marking the biggest performance rewrite in the language's history.

What's New:
• Rust Core Compiler: Type checking thousands of files in under 20 milliseconds.
• Native WebAssembly Target: Compile TypeScript subset directly to lightweight WASM binaries.
• Built-in Pattern Matching: Full pattern matching syntax support natively in TypeScript.

Developers can upgrade by updating their package configurations or using standard package managers.`,
    image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
    source_name: 'InfoQ',
    source_url: 'https://infoq.com',
    category: '💻 Software',
    published_at: '2026-07-23T09:00:00Z',
    read_time_minutes: 4,
    likes_count: 590,
  }
];

export function getArticleById(idOrSlug: string): Article | undefined {
  return SEED_ARTICLES.find(
    (a) => a.id === idOrSlug || a.slug === idOrSlug
  );
}
