import Link from 'next/link'
import styles from './page.module.css'

const GITHUB_URL = 'https://github.com/gopallchoudhary/coolcode'

// Block-pixel ASCII wordmark, 5 rows — the brand identity is its own ASCII art
// (DESIGN.md: never render the wordmark as a vector logo).
const C = [' ████', '█    ', '█    ', '█    ', ' ████']
const O = [' ███ ', '█   █', '█   █', '█   █', ' ███ ']
const L = ['█    ', '█    ', '█    ', '█    ', '█████']
const D = ['████ ', '█   █', '█   █', '█   █', '████ ']
const E = ['█████', '█    ', '████ ', '█    ', '█████']

const WORDMARK = Array.from({ length: 5 }, (_, row) =>
  [C, O, O, L, C, O, D, E].map(letter => letter[row]).join(' ')
).join('\n')

const FEATURES = [
  {
    label: 'Terminal-native',
    text: 'A real TUI built with OpenTUI and React — rendered in your terminal, not a web view.'
  },
  {
    label: 'Plans before it builds',
    text: 'PLAN mode is read-only and enforced on both the server and the CLI. Review the approach before a single file changes.'
  },
  {
    label: 'Executes tools locally',
    text: 'Tool calls stream from the model and run inside your working directory, sandboxed to your project.'
  },
  {
    label: 'Streams everything',
    text: 'Tokens, tool calls, and results arrive in real time — results are returned to the model automatically.'
  },
  {
    label: 'Multi-model',
    text: 'Pick from a shared model registry routed through OpenRouter. Swap models without leaving the prompt.'
  },
  {
    label: 'Sessions that persist',
    text: 'Conversations and history live in Postgres, not in your scrollback.'
  }
]

const STEPS = [
  {
    label: 'Start the API',
    text: 'The Hono server handles auth, sessions, credits, and model routing.',
    cmd: 'bun run dev:server'
  },
  {
    label: 'Launch the TUI',
    text: 'The CLI connects to the API and opens the chat interface in your terminal.',
    cmd: 'bun run dev:cli'
  },
  {
    label: 'Ship code',
    text: 'Ask for a change. The agent streams tool calls, the CLI executes them in your repo, and results return automatically.',
    cmd: null
  }
]

export const metadata = {
  title: {
    absolute: 'coolcode — the open source terminal AI coding agent'
  },
  description:
    'coolcode streams a coding agent into a native terminal UI. It plans before it builds, executes tools inside your repository, and shows every step as it happens.'
}

export default function HomePage() {
  return (
    <div className={styles.page}>
      <header className={styles.nav}>
        <div className={styles.navInner}>
          <Link
            href="/"
            className={styles.wordmarkLink}
            aria-label="coolcode — home"
          >
            <pre className={styles.wordmark} aria-hidden="true">
              {WORDMARK}
            </pre>
          </Link>
          <nav className={styles.navLinks} aria-label="Primary">
            <a
              className={styles.navLink}
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <Link className={styles.navLink} href="/docs">
              Docs
            </Link>
            <Link className={styles.navCta} href="/docs">
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.frame}>
            <p className={styles.badge}>open source</p>
            <h1 className={styles.headline}>
              The open source AI coding agent that lives in your terminal.
            </h1>
            <p className={styles.sub}>
              coolcode streams a coding agent into a native terminal UI. It
              plans before it builds, executes tools inside your repository,
              and shows every step as it happens.
            </p>
            <div className={styles.ctaRow}>
              <a
                className={styles.btnPrimary}
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
              >
                View on GitHub
              </a>
              <Link className={styles.btnSecondary} href="/docs">
                Read the docs →
              </Link>
            </div>
          </div>
        </section>

        <section
          className={styles.tuiSection}
          aria-label="Preview of the coolcode terminal interface"
        >
          <div className={styles.frame}>
            <div className={styles.tui}>
              <pre className={styles.tuiWordmark} aria-hidden="true">
                {WORDMARK}
              </pre>
              <div className={styles.promptRow}>
                <span className={styles.promptPipe}>|</span>
                <span>Build</span>
                <span className={styles.promptModel}>[gpt-5.4]</span>
                <span>coolcode</span>
                <span className={styles.cursor} aria-hidden="true">
                  █
                </span>
              </div>
              <div className={styles.hintsRow}>
                <span>tab switch agent</span>
                <span>ctrl-p commands</span>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.content}>
            <h2 className={styles.sectionHead}>What is coolcode?</h2>
            <ul className={styles.list}>
              {FEATURES.map(feature => (
                <li key={feature.label} className={styles.listRow}>
                  <span className={styles.marker}>[+]</span>
                  <span className={styles.rowLabel}>{feature.label}</span>
                  <span className={styles.rowText}>{feature.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.content}>
            <h2 className={styles.sectionHead}>How it works</h2>
            <ol className={styles.list}>
              {STEPS.map((step, index) => (
                <li key={step.label} className={styles.listRow}>
                  <span className={styles.marker}>{`[${index + 1}]`}</span>
                  <div className={styles.stepBody}>
                    <span className={styles.rowLabel}>{step.label}</span>
                    <p className={styles.stepText}>{step.text}</p>
                    {step.cmd ? (
                      <code className={styles.snippet}>{step.cmd}</code>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.content}>
            <h2 className={styles.sectionHead}>Start building</h2>
            <div className={styles.ctaRow}>
              <a
                className={styles.btnPrimary}
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
              >
                View on GitHub
              </a>
              <Link className={styles.btnSecondary} href="/docs">
                Read the docs →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span>© {new Date().getFullYear()} coolcode · MIT</span>
          <nav className={styles.footerLinks} aria-label="Footer">
            <a
              className={styles.footerLink}
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <a
              className={styles.footerLink}
              href={`${GITHUB_URL}/issues`}
              target="_blank"
              rel="noreferrer"
            >
              Issues
            </a>
            <Link className={styles.footerLink} href="/docs">
              Docs
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
