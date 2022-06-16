import { Prisma } from '@prisma/client'

import prisma from '../lib/prisma'

const rfidData: Prisma.RfidsCreateInput[] = [
    {
        codice: '15725016189159',
    },
    {
        codice: '21721418013750',
    },
    {
        codice: '1921269426250',
    },
    {
        codice: '1184298172146',
    },
]

//const targaData: Prisma.TargaCreateInput[] = [{ sigla: 'AB123BD' }, { sigla: 'AB123BD' }]

async function main() {
    //@ts-ignore
    console.log(`Start seeding ...`)
    const rfids = await prisma.rfids.createMany({
        data: rfidData,
    })

    // const targa = await prisma.targa.createMany({
    //     data: targaData,
    // })
    console.log(`Created RFIDS with id: ${JSON.stringify(rfids)}`)

    console.log(`Seeding finished.`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
