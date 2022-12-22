import prisma from 'lib/backend/prisma_client'
import {getSession} from 'next-auth/react'

export default async function handler(req, res) {
  const session = await getSession({req})

  const newPost = await prisma.post.create({
    data: {
      title: 'Hello World',
      body: 'This is a post',
      voteCount: Math.floor(Math.random() * 100),
      user: {
        connect: {
          id: (await prisma.user.findFirst()).id
        }
      }
    }
  })

  res.status(200).json({ id: newPost.id })
}
