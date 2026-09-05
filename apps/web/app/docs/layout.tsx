import { Anchor } from 'nextra/components'
import { GitHubIcon } from 'nextra/icons'
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { getPageMap } from 'nextra/page-map'
import ThemeToggle from '../theme-toggle'

const GITHUB_URL = 'https://github.com/gopallchoudhary/coolcode'

export default async function DocsLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <Layout
      // pageMap is scoped to /docs, so the sidebar only ever lists docs pages.
      // The landing page (app/page.tsx) lives outside this route tree.
      pageMap={await getPageMap('/docs')}
      // The ThemeToggle renders a sun/moon button immediately left of the
      // GitHub icon; nextra renders Navbar children after its built-in slots.
      navbar={
        <Navbar logo={<img src="/coolcode.svg" alt="coolcode" width={28} height={28} />}>
          <ThemeToggle />
          <Anchor href={GITHUB_URL}>
            <GitHubIcon height="24" aria-label="Project repository" />
          </Anchor>
        </Navbar>
      }
      footer={<Footer>© {new Date().getFullYear()} coolcode</Footer>}
      docsRepositoryBase="https://github.com/gopallchoudhary/coolcode/tree/main/apps/web"
    >
      {children}
    </Layout>
  )
}
