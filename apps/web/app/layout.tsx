import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'

export const metadata = {
  title: {
    default: 'coolcode',
    template: '%s — coolcode'
  },
  description: 'coolcode documentation'
}

const navbar = <Navbar logo={<b>coolcode</b>} />
const footer = <Footer>MIT {new Date().getFullYear()} © coolcode</Footer>

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      dir="ltr"
      // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
      suppressHydrationWarning
    >
      <Head />
      <body>
        <Layout
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/gopallchoudhary/coolcode/tree/main/apps/web"
          footer={footer}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
