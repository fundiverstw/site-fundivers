import { describe, it, expect } from 'vitest'
import { SERVICE_PRICING, FUNDIVE_REPO_URL, FUNDIVE_LICENSE } from './services'
import { twd } from '$engine/format'

// The prices on a page that quotes money to other businesses. Worth pinning.

describe('service pricing', () => {
  it('quotes a whole number of dollars for everything', () => {
    for (const [name, amount] of Object.entries(SERVICE_PRICING)) {
      expect(Number.isInteger(amount), `${name} is not a whole number`).toBe(true)
      expect(amount, `${name} is not positive`).toBeGreaterThan(0)
    }
  })

  it('renders the way the page shows it', () => {
    expect(twd(SERVICE_PRICING.fundiveSetup)).toBe('NT$3,000')
    expect(twd(SERVICE_PRICING.fundiveMonthly)).toBe('NT$3,000')
    expect(twd(SERVICE_PRICING.websiteSetupFrom)).toBe('NT$9,000')
    expect(twd(SERVICE_PRICING.websiteMonthly)).toBe('NT$3,000')
  })

  // A website is more work than running FunDive, and the page says so. If the
  // numbers ever cross over, the page contradicts itself.
  it('prices a website build above a FunDive setup', () => {
    expect(SERVICE_PRICING.websiteSetupFrom).toBeGreaterThan(SERVICE_PRICING.fundiveSetup)
  })
})

describe('the FunDive link', () => {
  // The whole pitch is "it is open source, go and look". A dead link, or one
  // pointing at a private repository, undoes the argument.
  it('points at a public GitHub repository over https', () => {
    expect(FUNDIVE_REPO_URL).toMatch(/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/)
  })

  it('names the licence the repository actually carries', () => {
    expect(FUNDIVE_LICENSE).toBe('AGPL-3.0')
  })
})
