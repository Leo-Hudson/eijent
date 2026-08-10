import { redirect } from 'next/navigation'
import {
  coreMe,
  CoreUnavailableError,
  isCoreUnavailable,
} from '@/lib/coreAuth'
import { readSessionToken } from '@/lib/session'
import { hasBlockingSubscription } from '@/lib/memberPlan'

const CORE_API_BASE_URL = process.env.CORE_API_BASE_URL || ''
const CORE_API_KEY = process.env.CORE_API_KEY || ''

const fetchMemberSubscriptions = async (memberId) => {
  if (!CORE_API_BASE_URL || !CORE_API_KEY || !memberId) return []
  const query =
    `where[member][equals]=${encodeURIComponent(memberId)}` +
    `&depth=0&limit=20&sort=-startDate`
  try {
    const res = await fetch(`${CORE_API_BASE_URL}/api/subscriptions?${query}`, {
      headers: {
        Authorization: `Bearer ${CORE_API_KEY}`,
      },
      cache: 'no-store',
    })
    if (!res.ok) return []
    const data = await res.json().catch(() => ({}))
    return Array.isArray(data?.docs) ? data.docs : []
  } catch {
    return []
  }
}

/**
 * Member dashboard pages require an active (or non-terminal) subscription.
 * Approved members without a plan are sent to /dashboard/choose-plan.
 */
export default async function MemberDashboardLayout({ children }) {
  const token = await readSessionToken()
  if (!token) {
    redirect('/login?next=/dashboard')
  }

  let user = null
  try {
    user = await coreMe(token)
  } catch (err) {
    // If Core is down, let pages render their offline/error states.
    if (isCoreUnavailable(err) || err instanceof CoreUnavailableError) {
      return children
    }
    throw err
  }

  if (!user?.id) {
    redirect('/login?next=/dashboard')
  }

  const subscriptions = await fetchMemberSubscriptions(user.id)
  if (!hasBlockingSubscription(subscriptions)) {
    redirect('/dashboard/choose-plan')
  }

  return children
}
