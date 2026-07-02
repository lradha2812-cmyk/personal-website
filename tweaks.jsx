/* Tweaks app — design-time only. Loaded (with React/Babel) only when the site
   runs inside the design tool; a plain deployed site never fetches this. */

const ACCENTS = {
  teal:   ["#0f766e", "#2dd4bf"],
  cobalt: ["#1d4ed8", "#60a5fa"],
  amber:  ["#b45309", "#fbbf24"],
  rose:   ["#be123c", "#fb7185"],
};

function nameOfAccent(palette) {
  const k = JSON.stringify(palette).toLowerCase();
  return Object.keys(ACCENTS).find((n) => JSON.stringify(ACCENTS[n]).toLowerCase() === k) || "teal";
}

const VOICE_LABELS = { grotesk: "Grotesk", editorial: "Editorial", mono: "Mono" };
const TEXTURE_LABELS = { dots: "Dot grid", mesh: "Mesh", none: "None" };
const labelToKey = (map, label) => Object.keys(map).find((k) => map[k] === label);

function TweaksApp() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);

  React.useEffect(() => {
    const r = document.documentElement;
    r.setAttribute("data-accent", t.accent);
    r.setAttribute("data-voice", t.voice);
    r.setAttribute("data-texture", t.texture);
  }, [t]);

  return (
    <TweaksPanel>
      <TweakSection label="Feel" />
      <TweakColor
        label="Accent"
        value={ACCENTS[t.accent]}
        options={[ACCENTS.teal, ACCENTS.cobalt, ACCENTS.amber, ACCENTS.rose]}
        onChange={(v) => setTweak("accent", nameOfAccent(v))}
      />
      <TweakRadio
        label="Voice"
        value={VOICE_LABELS[t.voice]}
        options={["Grotesk", "Editorial", "Mono"]}
        onChange={(v) => setTweak("voice", labelToKey(VOICE_LABELS, v))}
      />
      <TweakRadio
        label="Hero texture"
        value={TEXTURE_LABELS[t.texture]}
        options={["Dot grid", "Mesh", "None"]}
        onChange={(v) => setTweak("texture", labelToKey(TEXTURE_LABELS, v))}
      />
    </TweaksPanel>
  );
}

(function mount() {
  const el = document.createElement("div");
  document.body.appendChild(el);
  ReactDOM.createRoot(el).render(<TweaksApp />);
})();
