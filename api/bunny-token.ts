import { createHash } from 'crypto'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

// Signs a short-lived link for a video in the courses Bunny library (private, signed links).
//
// A member gets a link only when the video belongs to a live lesson in a course where the
// member has an active enrollment (course_enrollments.payment_status = 'active', the same test
// the lesson page runs). The admin login skips the live and enrollment checks.
// A video that is not on any lesson row is refused for everyone.

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const rawVideoId = req.query.videoId
  const videoId = typeof rawVideoId === 'string' ? rawVideoId : ''
  if (!videoId) {
    return res.status(400).json({ error: 'videoId required' })
  }

  // Verify Supabase session
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const accessToken = authHeader.slice(7)

  try {
    const supabaseUrl  = process.env.VITE_SUPABASE_URL
    const supabaseAnon = process.env.VITE_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnon) {
      return res.status(500).json({ error: 'Server configuration error' })
    }

    // The member's own login rides along on every read, so the database's existing
    // row rules decide what this route can see.
    const supabase = createClient(supabaseUrl, supabaseAnon, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
    })

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const tokenKey  = process.env.BUNNY_COURSES_TOKEN_AUTH_KEY
    const libraryId = process.env.VITE_BUNNY_COURSES_LIBRARY_ID

    if (!tokenKey || !libraryId) {
      return res.status(500).json({ error: 'Server configuration error' })
    }

    // Same admin rule as the site (AuthContext): the admin email, default deanna@druaiconsulting.com
    const adminEmail = (process.env.VITE_ADMIN_EMAIL || 'deanna@druaiconsulting.com').toLowerCase()
    const isAdmin = (user.email || '').toLowerCase() === adminEmail

    // Which lesson(s) does this video belong to?
    const { data: lessons, error: lessonError } = await supabase
      .from('course_lessons')
      .select('id, module_id, is_active')
      .eq('bunny_video_id', videoId)

    if (lessonError) {
      console.error('[bunny-token] lesson lookup error:', lessonError)
      return res.status(500).json({ error: 'Internal server error' })
    }

    if (!lessons || lessons.length === 0) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    if (!isAdmin) {
      // The lesson must be live (Show, not Hide)
      const liveLessons = lessons.filter(l => l.is_active)
      if (liveLessons.length === 0) {
        return res.status(403).json({ error: 'Forbidden' })
      }

      // Which course(s) do those lessons belong to?
      const moduleIds = Array.from(new Set(liveLessons.map(l => l.module_id)))
      const { data: modules, error: moduleError } = await supabase
        .from('course_modules')
        .select('course_id')
        .in('id', moduleIds)

      if (moduleError) {
        console.error('[bunny-token] module lookup error:', moduleError)
        return res.status(500).json({ error: 'Internal server error' })
      }

      const courseIds = Array.from(new Set((modules || []).map(m => m.course_id)))
      if (courseIds.length === 0) {
        return res.status(403).json({ error: 'Forbidden' })
      }

      // The member must have an active enrollment in one of those courses
      const { data: enrollments, error: enrollmentError } = await supabase
        .from('course_enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('payment_status', 'active')
        .in('course_id', courseIds)
        .limit(1)

      if (enrollmentError) {
        console.error('[bunny-token] enrollment lookup error:', enrollmentError)
        return res.status(500).json({ error: 'Internal server error' })
      }

      if (!enrollments || enrollments.length === 0) {
        return res.status(403).json({ error: 'Forbidden' })
      }
    }

    // Token expires in 2 hours
    const expiration = Math.floor(Date.now() / 1000) + 7200

    // Bunny Stream token: SHA256(tokenAuthKey + videoId + expirationTime)
    const token = createHash('sha256')
      .update(tokenKey + videoId + expiration)
      .digest('hex')

    const url =
      `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}` +
      `?token=${token}&expires=${expiration}` +
      `&autoplay=false&loop=false&muted=false&preload=true&responsive=true`

    return res.status(200).json({ url, expires: expiration })

  } catch (err) {
    console.error('[bunny-token] error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
