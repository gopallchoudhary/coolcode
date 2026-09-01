import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { getPageMap } from 'nextra/page-map'

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
      navbar={
        <Navbar
          logo={<b>coolcode</b>}
          projectLink="https://github.com/gopallchoudhary/coolcode"
        />
      }
      footer={<Footer>MIT {new Date().getFullYear()} © coolcode</Footer>}
      docsRepositoryBase="https://github.com/gopallchoudhary/coolcode/tree/main/apps/web"
      darkMode={false}
      nextThemes={{ forcedTheme: 'light' }}
    >
      {children}
    </Layout>
  )
}
