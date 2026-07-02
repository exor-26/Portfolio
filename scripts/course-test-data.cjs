module.exports = {
  modules: [
    {
      moduleId: "module-01",
      title: "C1: What is AI?",
      slot: 1,
      order: 1,
      active: true,
      jsx: `export default function CourseModule() {
  const [selected, setSelected] = useState("phone");
  const [energy, setEnergy] = useState(2);
  const examples = {
    phone: {
      title: "Phone camera",
      copy: "AI notices faces, light, background, and movement so the photo looks better automatically."
    },
    maps: {
      title: "Maps",
      copy: "AI studies traffic patterns and suggests a faster route before you even ask why the road is slow."
    },
    chat: {
      title: "Chat assistant",
      copy: "AI reads your words, predicts what help you need, and replies in normal language."
    }
  };
  const motivation = ["Save time", "Learn faster", "Create better work", "Ask better questions"];
  return (
    <article className="course-module module-stack">
      <section className="module-hero">
        <p className="module-kicker">Week 1 · C1 · AI Foundations</p>
        <h1 className="module-title">What is AI, and why does it matter now?</h1>
        <p className="module-lead">
          AI means a computer system that can notice patterns, make guesses, and help with tasks that normally need human thinking.
          The simple idea: AI is not magic. It is a very fast pattern helper.
        </p>
      </section>

      <section className="module-grid three">
        <button className={selected === "phone" ? "module-card active" : "module-card"} onClick={() => setSelected("phone")}>
          <h2>Daily life</h2>
          <p>Photos, shopping, reels, maps, typing suggestions.</p>
        </button>
        <button className={selected === "maps" ? "module-card active" : "module-card"} onClick={() => setSelected("maps")}>
          <h2>Smart choices</h2>
          <p>AI compares many options quickly and suggests a useful next step.</p>
        </button>
        <button className={selected === "chat" ? "module-card active" : "module-card"} onClick={() => setSelected("chat")}>
          <h2>Conversation</h2>
          <p>Modern AI can understand normal language, not only computer code.</p>
        </button>
      </section>

      <section className="module-card">
        <p className="module-kicker">Tap example cards above</p>
        <h2>{examples[selected].title}</h2>
        <p>{examples[selected].copy}</p>
      </section>

      <section className="module-card">
        <h2>AI energy meter</h2>
        <p>Move the slider. More AI support means the tool can do more thinking with you, but you still stay responsible for checking the result.</p>
        <input className="module-meter" type="range" min="0" max="4" value={energy} onChange={(event) => setEnergy(Number(event.target.value))} />
        <div className="module-pill-row">
          {motivation.slice(0, energy + 1).map((item) => <span className="module-pill" key={item}>{item}</span>)}
        </div>
      </section>

      <section className="module-grid two">
        <div className="module-card">
          <h2>Easy definition</h2>
          <p>AI is software that learns from examples and helps make predictions, suggestions, or content.</p>
        </div>
        <div className="module-card">
          <h2>Remember this</h2>
          <p>AI can be powerful, but it can still be wrong. Good users ask clearly and verify important answers.</p>
        </div>
      </section>

      <section className="module-recap">
        <h2>Quick recap</h2>
        <ul>
          <li>AI is a pattern helper, not magic.</li>
          <li>It matters now because normal people can use it through simple chat interfaces.</li>
          <li>The goal is not to fear AI. The goal is to use it carefully and smartly.</li>
        </ul>
      </section>
    </article>
  );
}`
    },
    {
      moduleId: "module-02",
      title: "C2: How LLMs Work",
      slot: 2,
      order: 1,
      active: true,
      jsx: `export default function CourseModule() {
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState("");
  const steps = [
    {
      title: "1. Read your words",
      copy: "The model first breaks your sentence into smaller pieces so it can understand the shape of the request."
    },
    {
      title: "2. Look for patterns",
      copy: "It compares your request with patterns learned from lots of text examples."
    },
    {
      title: "3. Predict the next useful word",
      copy: "It builds the answer step by step by choosing words that probably fit the context."
    },
    {
      title: "4. You check the answer",
      copy: "The model sounds confident, but you still check important facts, numbers, health, law, and money advice."
    }
  ];
  const current = steps[step];
  const answer = choice === "moon" ? "Correct. It picked a likely next word from context." : choice ? "Good try. In this sentence, moon fits best." : "";
  return (
    <article className="course-module module-stack">
      <section className="module-hero">
        <p className="module-kicker">Week 1 · C2 · Plain Language</p>
        <h1 className="module-title">How LLMs work, without jargon</h1>
        <p className="module-lead">
          An LLM is a language model. It does not think like a human brain. It studies word patterns and creates the next helpful piece of text.
        </p>
      </section>

      <section className="module-card">
        <p className="module-kicker">Step explorer</p>
        <h2>{current.title}</h2>
        <p>{current.copy}</p>
        <div className="module-pill-row">
          {steps.map((item, index) => (
            <button className={index === step ? "module-button primary" : "module-button"} key={item.title} onClick={() => setStep(index)}>
              Step {index + 1}
            </button>
          ))}
        </div>
      </section>

      <section className="module-grid two">
        <div className="module-card">
          <h2>Mini prediction game</h2>
          <p>The night sky has stars and a bright ___.</p>
          <div className="module-pill-row">
            {["chair", "moon", "spoon"].map((word) => (
              <button className={choice === word ? "module-button primary" : "module-button"} key={word} onClick={() => setChoice(word)}>
                {word}
              </button>
            ))}
          </div>
          {answer ? <p className="module-callout">{answer}</p> : null}
        </div>
        <div className="module-card">
          <h2>That is the basic idea</h2>
          <p>An LLM keeps choosing likely next words, but at a huge scale. Because of that, it can explain, summarize, write, translate, plan, and help brainstorm.</p>
        </div>
      </section>

      <section className="module-grid three">
        <div className="module-card">
          <h3>It can help</h3>
          <p>Explain topics, make drafts, organize ideas, and create practice questions.</p>
        </div>
        <div className="module-card">
          <h3>It can fail</h3>
          <p>It may invent facts, misunderstand context, or give outdated information.</p>
        </div>
        <div className="module-card">
          <h3>Your job</h3>
          <p>Ask clearly, give context, and verify important answers before trusting them.</p>
        </div>
      </section>

      <section className="module-recap">
        <h2>Quick recap</h2>
        <ul>
          <li>LLMs work with language patterns.</li>
          <li>They generate answers one piece at a time.</li>
          <li>They are useful helpers, but not perfect truth machines.</li>
        </ul>
      </section>
    </article>
  );
}`
    }
  ],
  users: [
    {
      userId: "teacher001",
      displayName: "Course Access Demo",
      password: "ChangeMe-12345",
      unlockedSlot: 1
    }
  ]
};
