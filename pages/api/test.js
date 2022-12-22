import prisma from 'lib/backend/prisma_client'
import {getSession} from 'next-auth/react'

export default async function handler(req, res) {
  const session = await getSession({req})

  const posts = await prisma.post.findMany({
    orderBy: [
      {
        voteCount: 'desc',
      },
    ],
    include: {
      user: {
        select: {
          displayName: true,
        }
      },
    }
  })
  if(posts.length === 0) return res.status(404).json({data: `No more posts`})
  res.status(200).json({ posts: posts })
}
