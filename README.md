# Businesshandler — klickbarer Mobile-Prototyp

Eine mobile App (Expo / React Native, TypeScript) ohne Backend, die die drei
wichtigsten Screens des Figma-Designs „businesshandler“ (414×896) klickbar
umsetzt: **Dashboard**, **Money Management** und **Time Management**. Alle
Inhalte stammen aus typisierten Beispieldaten im Code; Farben, Typografie,
Abstände und Bilder folgen exakt dem Design. Es gibt keine Netzwerkaufrufe,
keine Persistenz und keinen Login.

## Tech-Stack

- **Sprache:** TypeScript
- **Framework:** React Native mit Expo (Managed Workflow), SDK 57
- **Navigation:** React Navigation — Bottom Tabs, gestapelte Zustände je Tab
- **Zustand:** ausschließlich lokaler Komponenten-State über einen
  React-Context (`src/state/AppData.tsx`), typisierte Beispieldaten in
  `src/data/*.ts`
- **Design-Tokens:** Farben, Typografie, Spacing und Radien zentral in
  `src/theme.ts`
- **Tests:** Jest mit `jest-expo` und React Native Testing Library
- **Verifikation:** `expo export --platform web`, Prüfung bei 414×896 Hochformat

## Installation

Voraussetzung: Node.js (LTS) und npm.

```bash
npm ci
```

`npm ci` spielt exakt das eingecheckte `package-lock.json` nach. Nach jeder
Änderung an `package.json` muss der Lockfile neu erzeugt werden
(`npm install`) und im selben Commit mitwandern.

## Entwicklung starten

```bash
npm run web      # öffnet die App im Browser (Expo Dev-Server)
npm run android  # Android-Emulator oder Gerät
npm run ios      # iOS-Simulator (nur macOS)
```

`npm start` startet den Expo-Dev-Server mit Auswahl der Plattform.

## Produktions-Build

```bash
npm run build    # expo export --platform web  →  Ausgabe in dist/
```

Der statische Web-Build liegt danach in `dist/` und kann von einem beliebigen
Webserver ausgeliefert werden, z. B.:

```bash
npx serve dist
```

`RUN.json` beschreibt denselben Weg maschinenlesbar: Installation mit
`npm ci`, Build mit `npm run build`, danach wird `dist/` als statische Seite
ausgeliefert.

## Tests

```bash
npm test         # jest mit dem jest-expo Preset
```

## Bedienung

Die App startet direkt auf dem **Dashboard**. Am unteren Rand liegt die
**Bottom-Tab-Bar** mit den drei Bereichen:

- **Dashboard** — Startansicht
- **Money** — Money Management
- **Time** — Time Management

Jeder Tab ist antippbar; der aktive Tab ist grün hervorgehoben. Der Wechsel
erfolgt ohne Neustart. Innerhalb eines Tabs liegen Detail- und
Eingabe-Zustände als gestapelte Screens (z. B. Wochenbericht, Kalender,
„Add Expense“).

## Funktionsumfang

- Bottom-Tab-Bar mit drei Bereichen und sichtbar hervorgehobenem aktiven Tab
- Gemeinsame Beispieldaten für Transaktionen (Einnahmen/Ausgaben) und
  Zeiteinträge, inklusive berechneter Summen (Saldo, Einnahmen, Ausgaben,
  Gesamtminuten)
- Wiederverwendbare, token-gestylte UI-Bausteine: `Card`, `SectionHeader`,
  `AmountText`, `Row`, `PrimaryButton`, `FloatingAddButton`, `FormField` und
  `DatePickerField` (ein echter In-App-Kalender, kein Freitext-Datum)
- Neun registrierte Screens als Grundgerüst; die inhaltliche Ausarbeitung
  einzelner Screens erfolgt in Folge-Tickets

## Projektstruktur

```
App.tsx                      App-Wurzel (Fonts, Provider, Navigation)
index.ts                     Expo-Einstiegspunkt
src/theme.ts                 Design-Tokens (DESIGN.md)
src/data/                    Typen und Beispieldaten
src/state/AppData.tsx        AppData-Context (transactions, timeEntries, totals)
src/navigation/              Root-Tabs, Stacks, Param-Listen
src/components/              Gemeinsame UI-Bausteine
src/screens/                 Die neun Screens
__tests__/                   Tests (jest-expo)
```
