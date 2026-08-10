import { NextResponse } from 'next/server'
import {
  coreMe,
  CoreUnavailableError,
  isCoreUnavailable,
} from '@/lib/coreAuth'
import { clearSessionCookie, getRequestToken } from '@/lib/session'

const CORE_API_BASE_URL = process.env.CORE_API_BASE_URL || ''
const CORE_API_KEY = process.env.CORE_API_KEY || ''

/**
 * POST /api/plans/select
 * Body: { pricingPlanId }
 *
 * Proxies to Core member select-plan. Free/$0 creates a subscription;
 * paid plans return comingSoon.
 */
export const POST = async (req) => {
  try {
    const token = getRequestToken(req)
    if (!token) {
      return NextResponse.json({ error: 'Sign in required.' }, { status: 401 })
    }

    if (!CORE_API_BASE_URL || !CORE_API_KEY) {
      return NextResponse.json({ error: 'Plan selection is not configured.' }, { status: 503 })
    }

    let body
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'pricingPlanId is required.' }, { status: 400 })
    }

    const pricingPlanId =
      typeof body?.pricingPlanId === 'string' ? body.pricingPlanId.trim() : ''
    if (!pricingPlanId) {
      return NextResponse.json({ error: 'pricingPlanId is required.' }, { status: 400 })
    }

    let user
    try {
      user = await coreMe(token)
    } catch (err) {
      if (isCoreUnavailable(err) || err instanceof CoreUnavailableError) {
        return NextResponse.json(
          {
            error: 'We could not update your plan right now. Please try again in a moment.',
            code: 'core_unavailable',
          },
          { status: 503 },
        )
      }
      throw err
    }

    if (!user?.id) {
      const res = NextResponse.json({ error: 'Sign in required.' }, { status: 401 })
      clearSessionCookie(res)
      return res
    }

    const coreRes = await fetch(
      `${CORE_API_BASE_URL}/api/members/${encodeURIComponent(user.id)}/select-plan`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${CORE_API_KEY}`,
        },
        body: JSON.stringify({ pricingPlanId }),
        cache: 'no-store',
      },
    )

    const data = await coreRes.json().catch(() => ({}))

    if (coreRes.status === 402 || data?.comingSoon || data?.code === 'COMING_SOON') {
      return NextResponse.json(
        {
          error: data?.error || 'Paid plan checkout is not available yet.',
          code: 'COMING_SOON',
          comingSoon: true,
        },
        { status: 402 },
      )
    }

    if (!coreRes.ok) {
      return NextResponse.json(
        {
          error: data?.error || 'Unable to select this plan.',
          code: data?.code || undefined,
        },
        { status: coreRes.status >= 400 && coreRes.status < 600 ? coreRes.status : 502 },
      )
    }

    return NextResponse.json({
      success: true,
      subscription: data?.subscription || null,
    })
  } catch (error) {
    if (process.env.DEBUG_LOGS === '1') console.error('[plans/select]', error)
    return NextResponse.json({ error: 'Unable to select this plan.' }, { status: 500 })
  }
}
