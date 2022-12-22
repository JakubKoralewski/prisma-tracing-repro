import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const bobData = {
    displayName: "Bob"
}

const aliceData = {
    displayName: "Alice"
}

async function main() {
    const alice = await prisma.user.upsert({
        where: { displayName: aliceData.displayName },
        update: aliceData,
        create: {
            ...aliceData,
            posts: {
                create: {
                    title: 'aaaaaaa',
                    body: 'bbbbbbbbbbbb',
                },
            },
        },
    })

    const bob = await prisma.user.upsert({
        where: { displayName: bobData.displayName },
        update: bobData,
        create: {
            ...bobData,
            posts: {
                create: [
                    {
                        title: 'bbbbbbbbbbbbb',
                        body: 'aaaaaaaaaa',
                    },
                    {
                        title: 'aaaaaa',
                        body: 'aaaaaaaaaaaaaa',
                    },
                ],
            },
        },
    })
    console.log({ alice, bob })
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
