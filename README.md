# extractqr

A simple electron app used to scan QR codes in images and extract the QR data.

Made with Electron, React and TailwindCSS.

## Why did I make this?

I use a local password database called KeePassXC. Adding MFA to KeePassXC requires the secret string that _sometimes_ comes with a QR code. The QR code itself has that secret, but the QR code is meant to be scanned and added to an authentication app. Omitting the secret string in MFA QR codes; forces the users to take action and extract it by themselves.

By extracting the data using an online tool, you potentially expose your QR secret online, which is why I made this app so you can scan your QR codes locally and extract the data safely without having to worry about any data exposure using an online QR reading tool.

This app is made to keep things simple, it has one purpose and one purpose only. There are other applications that has QR scanning as a feature, but that's a part of a larger toolset which I don't personally want.

### How to use

- Select the image you want to scan
- Once an image is selected; click "Extract QR data from image" to extract data
- On a successful extraction; an option to copy to your clipboard will be available

<img src=".github/demo.jpg" width=400 />
