import { Prisma } from '@prisma/client'
import prisma from '../lib/prisma'

const arrPIANO1: any = []
for (var x = 0; x < 50; x++) {
    arrPIANO1[x] = { posto: x, piano: 1, parcheggio_stato: Math.random() < 0.5, rfid_stato: Math.random() < 0.5 }
}

const arrPIANO2: any = []
for (var x = 0; x < 50; x++) {
    arrPIANO2[x] = { posto: x, piano: 2, parcheggio_stato: Math.random() < 0.5, rfid_stato: Math.random() < 0.5 }
}

const arrDurata: any = []
for (var x = 0; x < 50; x++) {
    arrDurata[x] = { posto: x, piano: 2, parcheggio_stato: Math.random() < 0.5, rfid_stato: Math.random() < 0.5 }
}

const rfidData: Prisma.RfidsCreateInput[] = [
    {
        codice: '15725016189159',
        stato: false,
    },
    {
        codice: '21721418013750',
        stato: false,
    },
    {
        codice: '1921269426250',
        stato: false,
    },
    {
        codice: '1184298172146',
        stato: false,
    },
]

const durataData: Prisma.ParcheggiCreateInput[] = arrDurata

const parcheggiData: Prisma.ParcheggiCreateInput[] = arrPIANO1
const parcheggiData2: Prisma.ParcheggiCreateInput[] = arrPIANO2

async function main() {
    console.log(`Start seeding ...`)
    await prisma.parcheggi.deleteMany({})
    const parcheggi = await prisma.parcheggi.createMany({
        data: parcheggiData,
    })
    const parcheggi2 = await prisma.parcheggi.createMany({
        data: parcheggiData2,
    })
    const rfid = await prisma.rfids.createMany({
        data: rfidData,
    })
    console.log('🚀 - file: seed.ts - line 36 - main - user', parcheggi, parcheggi2, rfid)
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
