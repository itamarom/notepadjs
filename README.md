![notepadjs screensshot](screenshot.png?raw=true "notepadjs")

# notepadjs

This is a simple app that imitates Windows Notepad. Installable as a PWA.

Use it here: https://itamarom.github.io/notepadjs/

## Installation

After [opening the app](https://itamarom.github.io/notepadjs/), click on the "Install" button in the top menu. Look for "Install Notepad". It might be under "Cast, Save, and Share":

![notepadjs setup](setup.png?raw=true "setup")

## About

As a native Windows user who switched to macOS a few years back, one thing I never got over was the simplicity and usefulness of the old school Notepad app. This app aims to recreate that very same experience. It uses a fairly modern [File System Access API](https://wicg.github.io/file-system-access/) to allow reading and writing of local files. Unfortunately, this means it currently does not work on FireFox. To overcome this, local storage support will be implemented in the future.

Also worth mentioning: this is my first time using Vue, so some things might not make perfect sense. Criticism, issues and PRs are welcome.

## Roadmap

- [X] Notepad-like UI
- [X] Allow Local FS operations
- [X] Installable as a PWA
- [ ] Implement font selection dialog
- [ ] Implement local storage support
- [ ] Keep tab state and unsaved drafts between sessions
- [ ] Pixel perfect Notepad UI 

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
