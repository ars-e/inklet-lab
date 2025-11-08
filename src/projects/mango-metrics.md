---
layout: "project-template.njk"
title: "The Doodler"
card_id: "PETI001"
dek: "An audio reactive generative art experiment. Also a nod to Dada’s play with chance."
studio: "Inklet Lab"
disciplines: ["Generative Art", "Data driven Art Direction", "Audio Visualization", "Modern Art"]
year: 2025
status: "Published"
image: "/assets/project_covers/image.png"
image_alt: "Visualization of Khalbali"
image_caption: "Fig. 01 — \"Khalbali\" rendered in spray paint (first 90 seconds)."
external_url: "#"
toolkit:
  - label: "Core Engine"
    value: "p5.js, p5.sound, Meyda.js"
  - label: "Design system"
    value: "Digital Paint, Ruled Paper Pubstrate, Generative Brushstrokes"
  - label: "Conceptual Inspiration"
    value: "Dadaist Automatism, Digital Synesthesia"
featured: true
tags: ["projects", "generative art", "visual experiment"]
---

<figure class="vid-embed vid-embed--ink">
  <video
    class="vid-media"
    controls
    preload="metadata"
    playsinline
    poster="/assets/project_covers/image.png"
  >
    <source src="/assets/videos/doodle-av (5).webm" type="video/webm">
  </video>

<br>


  <figcaption class="vid-cap">
  Vid. 01 — Audio reactive artwork of <a href="https://en.wikipedia.org/wiki/Rang_De_Basanti_(soundtrack)" class="bold-link" target="_blank">“Khalbali” (<em>Rang De Basanti</em>)</a>
</figcaption>

</figure>


<br>

## The Concept {.section-title}

"The doodler" is a generative art experiment, an exploration of the idea of digital <a href="https://www.britannica.com/art/automatism-art" target= "_blank">automatism</a>. It is a machine that listens to the chaos of sound and produces an irrational looking doodle. It rejects the idea that complex analysis should serve a logical purpose. Instead, it uses sophisticated audio-feature extraction to make absurd, aesthetic decisions. It’s <a href="https://en.wikipedia.org/wiki/Dada" target= "_blank">dada</a> in spirit, embracing <a href="https://arthistoryunstuffed.com/dada-and-chance/" target= "_blank">chance</a>. 

### What is Dada? {.subsection-title}

Dada was an art movement of the European avant-garde in the early 20th century. Born from the chaos and trauma of World War I, it was a profound "anti-art" protest. Dadaists rejected logic, reason, and aestheticism, instead embracing nonsense, irrationality, chance, and absurdity as their primary tools. It was a movement that sought to tear down old traditions and question the very definition of art itself.

### Automatism and the Digital Hand {.subsection-title}

The Surrealists inherited Dada’s chaos but turned it inward — toward the subconscious and the instinctive hand. Automatism asked the artist to draw without thought, to let gesture arrive before judgment. It was a way to free creation from conscious control, allowing the unconscious to express itself through movement.” This artwork experiment borrows that idea but translates it into code. The computer becomes the hand; the song becomes the subconscious. Each image emerges from thousands of small decisions made in real time

<br>

## The Strategy {.section-title}


+ **Automatism**: The "artist" here is a machine. It removes the conscious, logical hand of the human creator. The doodle is the immediate, unconscious product of the audio input.  
+ **Chance Operations:** The audio file is a "found object". Like pulling words from a hat for a poem, this machine pulls features from the sound. The final artwork is a direct result of this chance operation. You set the machine's rules, but the audio provides the chaos.  
+ **Irrationality & Absurdity:** A stable vocal pitch triggers a "calligraphy" brush. A sudden drum hit cause a "splatter". There is no logical reason.  
+ **Anti-Art:** The canvas is not a grand, archival sheet. It’s a procedurally generated piece of ruled notebook paper. This rejects the pretension of "high art" in favor of the doodle, the most immediate, and universal form of drawing.

<br>


## The Machine's "Guts" {.section-title}

The automaton is built with several "organs":

<br>


+ **The Ear (Meyda.js & p5.sound)**: Listens to the sound's soul, analyzing its timbre (MFCCs), pitch (F0, chroma), energy (RMS), and rhythm (onsets) among other things. 
+ **The "Vocal" Brain (Vocal Detector**): An internal logic that tries to distinguish a human voice from the instrumental chaos by looking for stable pitch, high chroma concentration, and low spectral flatness.
+ **The Motor (Movement Modes**): Decides how to move, whether in a chaotic Lévy Flight, an anxious Hesitation, a predictable Grid, or a lyrical Lissajous curve.
+ **The Hand (Brush Modes)**: Chooses its tool. It may use a bristle brush for backing tracks, a sharp calligraphy nib for vocals, or simply splatter the paint in response to a beat.


<br>

## The Showcase Gallery {.section-title}

<br>

<section class="gallery-section">
  <figure class="stylized-frame">
    <video
      class="stylized-image"
      controls
      playsinline
      preload="metadata"
      poster=""
    >
      <source src="/assets/videos/doodle-av (8).webm" type="video/webm" />
    </video>
    <figcaption class="font-pixel">Vid. 02 — Audio reactive artwork of <a href="https://en.wikipedia.org/wiki/Hallelujah_(Leonard_Cohen_song)" target="_blank">"Hallelujah"</a></figcaption>
  </figure>

  <figure class="stylized-frame">
    <video
      class="stylized-image"
      controls
      playsinline
      preload="metadata"
      poster=""
    >
      <source src="/assets/videos/doodle-av (9).webm" type="video/webm" />
    </video>
    <figcaption class="font-pixel">Vid. 03 — Audio reactive artwork of <a href="https://www.anti.com/releases/elwan/tracks/nannuflay/" target="_blank">"Nànnuflày"</a>
    </figcaption>
  </figure>
</section>

## Few Final Thoughts {.section-title}

<br>

Ultimately, "The Doodler" is a question posed in code. It wonders if the "unconscious" hand of the automatist can be digitally simulated, not through artificial intelligence, but through an absence of traditional, goal-oriented logic. 

<br>
Each piece that emerges is not a final answer, but the artifact of a unique performance, a testament to the idea that, art(compelling or not) can be born from chaos, chance, and the beautiful, absurd rejection of reason.




