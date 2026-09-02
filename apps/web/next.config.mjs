import nextra from 'nextra'

const withNextra = nextra({
  // Nextra-specific options (MDX options, search, etc.)
})

export default withNextra({
  // Separate output dirs so `next build` can never clobber the chunks of a
  // running `next dev` server (they used to share `.next`, which produced
  // "Cannot find module './N.js'" errors in dev).
  distDir: process.env.NODE_ENV === 'production' ? '.next-prod' : '.next'
})
