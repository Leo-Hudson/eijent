import { redirect } from 'next/navigation'
import ChoosePlanPage from '@/components/member/ChoosePlanPage'
import {
  coreMe,
  CoreUnavailableError,
  isCoreUnavailable,
} from '@/lib/coreAuth'
import { readSessionToken } from '@/lib/session'
import { hasBlockingSubscription } from '@/lib/memberPlan'

export const metadata = {
  title: 'Choose a plan — Eijent',
  description: 'Select a pricing plan for your Eijent account.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/dashboard/choose-plan' },
}

const CORE_API_BASE_URL = process.env.CORE_API_BASE_URL || ''
const CORE_API_KEY = process.env.CORE_API_KEY || ''

const fetchMemberSubscriptions = async (memberId) => {
  if (!CORE_API_BASE_URL || !CORE_API_KEY || !memberId) return []
  const query =
    `where[member][equals]=${encodeURIComponent(memberId)}` +
    `&depth=0&limit=20&sort=-startDate`
  try {
    const res = await fetch(`${CORE_API_BASE_URL}/api/subscriptions?${query}`, {
      headers: { Authorization: `Bearer ${CORE_API_KEY}` },
      cache: 'no-store',
    })
    if (!res.ok) return []
    const data = await res.json().catch(() => ({}))
    return Array.isArray(data?.docs) ? data.docs : []
  } catch {
    return []
  }
}

export default async function ChoosePlanRoute() {
  const token = await readSessionToken()
  if (!token) {
    redirect('/login?next=/dashboard/choose-plan')
  }

  let user = null
  let coreDown = false
  try {
    user = await coreMe(token)
  } catch (err) {
    if (isCoreUnavailable(err) || err instanceof CoreUnavailableError) {
      coreDown = true
    } else {
      throw err
    }
  }

  if (!coreDown && !user?.id) {
    redirect('/login?next=/dashboard/choose-plan')
  }

  if (user?.id) {
    const subscriptions = await fetchMemberSubscriptions(user.id)
    if (hasBlockingSubscription(subscriptions)) {
      redirect('/dashboard')
    }
  }

  return <ChoosePlanPage />
}
