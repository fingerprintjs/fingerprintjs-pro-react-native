#!/bin/sh

printf 'Sync is running!\nPress Ctrl + C to stop the script.\n'
while true; do
    sleep 1
    rsync -rc ./src ./TestProject/node_modules/@fingerprintjs/fingerprintjs-pro-react-native/
    rsync -rc ./dist ./TestProject/node_modules/@fingerprintjs/fingerprintjs-pro-react-native/
    rsync -rc ./ios ./TestProject/node_modules/@fingerprintjs/fingerprintjs-pro-react-native/
    rsync -c ./RNFingerprintjsPro.podspec ./TestProject/node_modules/@fingerprintjs/fingerprintjs-pro-react-native/
    rsync -rc ./android ./TestProject/node_modules/@fingerprintjs/fingerprintjs-pro-react-native/
done
