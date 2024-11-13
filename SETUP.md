# Google Sheets Integration Setup

Um die Google Sheets Integration einzurichten, folgen Sie bitte diesen Schritten:

1. Gehen Sie zur [Google Cloud Console](https://console.cloud.google.com/)

2. Erstellen Sie ein neues Projekt oder wählen Sie ein bestehendes aus

3. Aktivieren Sie die Google Sheets API:
   - Gehen Sie zu "APIs & Services" > "Library"
   - Suchen Sie nach "Google Sheets API"
   - Klicken Sie auf "Enable"

4. Erstellen Sie Service Account Credentials:
   - Gehen Sie zu "APIs & Services" > "Credentials"
   - Klicken Sie auf "Create Credentials" > "Service Account"
   - Füllen Sie die erforderlichen Felder aus
   - Klicken Sie auf "Create and Continue"
   - Vergeben Sie die Rolle "Editor" unter "Select a role"
   - Klicken Sie auf "Done"

5. Generieren Sie einen Private Key:
   - Klicken Sie auf den erstellten Service Account
   - Gehen Sie zum Tab "Keys"
   - Klicken Sie auf "Add Key" > "Create new key"
   - Wählen Sie "JSON" als Key-Typ
   - Klicken Sie auf "Create"
   - Eine JSON-Datei wird heruntergeladen

6. Aktualisieren Sie die .env.local Datei:
   - Öffnen Sie die heruntergeladene JSON-Datei
   - Kopieren Sie die `client_email` in die GOOGLE_CLIENT_EMAIL Variable
   - Kopieren Sie den `private_key` in die GOOGLE_PRIVATE_KEY Variable

7. Starten Sie den Development Server neu:
   ```bash
   npm run dev
   ```

Die Anwendung wird automatisch:
- Google Sheets für jede Ressourcenkategorie erstellen
- Die Tabellen mit den entsprechenden Spalten initialisieren
- Die Daten in der Anwendung anzeigen und bearbeitbar machen

## Funktionen

Die Integration bietet folgende Funktionen:
- Automatische Erstellung und Verwaltung von Google Sheets für jede Ressourcenkategorie
- Echtzeit-Synchronisation zwischen der Anwendung und Google Sheets
- Benutzerfreundliche Tabellenansicht mit Bearbeitungsmöglichkeiten
- Kategorisierung in interne und externe Ressourcen
- Automatische Formatierung der Tabellen mit Überschriften

## Wichtige Hinweise

- Bewahren Sie die Credentials sicher auf und teilen Sie sie nicht öffentlich
- Der Service Account muss Bearbeitungsrechte für die Sheets haben
- Die .env.local Datei sollte nie in Git eingecheckt werden (ist bereits in .gitignore)
- Für die Produktion sollten Sie separate Credentials verwenden

## Fehlerbehebung

Wenn Sie Probleme mit der Integration haben:

1. Überprüfen Sie, ob die API aktiviert ist
2. Stellen Sie sicher, dass die Credentials korrekt in .env.local eingetragen sind
3. Überprüfen Sie die Server-Logs auf Fehlermeldungen
4. Stellen Sie sicher, dass der Service Account die notwendigen Berechtigungen hat

## Datenstruktur

Jede Kategorie hat ihre eigene vordefinierte Struktur:

### Mitarbeiter
- Name
- Status
- Kampagne
- Shirt Größe
- Jacken Größe
- Hosen Größe
- Ausrüstung

### Ausrüstung
- Name
- Kategorie
- Status
- Zugewiesen an
- Seriennummer

### Kleidung
- Artikel
- Größe S
- Größe M
- Größe L
- Größe XL

### Fahrzeuge
- Name
- Status
- Kampagne
- Notizen
- Quelle

### Kreisverbände
- Name
- Status
- Kapazität
- Kontakt

### Unterkünfte
- Name
- Standort
- Kapazität
- Kampagne
- Kontakt
