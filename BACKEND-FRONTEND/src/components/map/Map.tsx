import { useState } from 'react'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'
import getCenter from 'geolib/es/getCenter'

export default function Map(locations: any) {
    const [selectedLocation, setSelectedLocation] = useState<any>({})

    //   Transform coordinates into required array of objects in the correct shape
    const coordinates: any = {
        latitude: locations.lat,
        longitude: locations.long,
    }

    // The latitude and longitude of the center of locations coordinates
    const center: any = getCenter(coordinates)

    const [viewport, setViewport] = useState({
        width: '100%',
        height: '100%',
        latitude: center.latitude,
        longitude: center.longitude,
        zoom: 11,
    })

    return (
        <Map
            initialViewState={{
                longitude: -100,
                latitude: 40,
                zoom: 3.5,
            }}
            style={{ width: '100vw', height: '100vh' }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            mapboxAccessToken={process.env.MAPBOX_KEY}
        />
    )
}
