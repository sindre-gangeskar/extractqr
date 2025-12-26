# extractqr

A simple electron app used to scan QR codes in images and extract the QR data.

Made with Electron, React and TailwindCSS.

## Why did I make this?

I use a local password database called KeePassXC. Adding MFA to KeePassXC requires the secret string that _sometimes_ comes with a QR code. The QR code itself has that secret, but the QR code is meant to be scanned and added to an authentication app. Without the secret string that some provide along with the QR code; you'll be forced to extract the data yourself.

By extracting the data using an online tool, you potentially expose your QR secret online, which is why I made this app so you can scan your QR codes locally and extract the data safely without having to worry about any data exposure using an online QR reading tool.

This app is made to keep things simple, it has one purpose and one purpose only. There are other applications that has QR scanning as a feature, but that's a part of a larger toolset which I don't personally want.

### How to use

- Select the image you want to scan
- Once image is selected; click "Extract QR data from image"
- On successful extraction you can copy the text to your clipboard

<img src=".github/demo.jpg" width=400 />
