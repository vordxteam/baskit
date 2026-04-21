export type GreetingCardDraft = {
  enabled: boolean
  type: string
  to: string
  from: string
  message: string
}

export type GreetingDraftByLineId = Record<string, GreetingCardDraft>

const ORDER_GREETING_DRAFT_KEY = 'baskit-order-greeting-draft'

export const readGreetingDraft = (): GreetingDraftByLineId => {
  if (typeof window === 'undefined') return {}

  try {
    const raw = sessionStorage.getItem(ORDER_GREETING_DRAFT_KEY)
    if (!raw) return {}

    const parsed = JSON.parse(raw)
    return typeof parsed === 'object' && parsed !== null ? parsed : {}
  } catch {
    return {}
  }
}

export const writeGreetingDraft = (draft: GreetingDraftByLineId) => {
  if (typeof window === 'undefined') return

  sessionStorage.setItem(ORDER_GREETING_DRAFT_KEY, JSON.stringify(draft))
}

export const clearGreetingDraft = () => {
  if (typeof window === 'undefined') return

  sessionStorage.removeItem(ORDER_GREETING_DRAFT_KEY)
}
