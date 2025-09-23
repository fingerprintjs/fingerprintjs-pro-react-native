import Geolocation from '@react-native-community/geolocation'

export async function requestLocationPermission() {
  return new Promise((resolve) => {
    Geolocation.requestAuthorization(
      () => resolve(true),
      (e) => () => {
        console.error(e)
        resolve(false)
      }
    )
  })
}
