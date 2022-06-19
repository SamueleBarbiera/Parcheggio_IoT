import axios from 'axios'

export async function fetcher(url: string, options = {}) {
    let res
    if (!options) {
        res = await fetch(url.toString())
    } else {
        res = await fetch(url.toString(), options)
    }
    const data = await res.status(200).json({)
    return data
}
