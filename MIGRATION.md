# Projektdokumentation: Migration der Terminbuchungs-Webapp

## Projektziel
Migration der Google Apps Script Terminbuchungs-Webapp zu einer standalone Webanwendung mit GitHub-Hosting, die weiterhin mit Google Sheets als Datenbank arbeitet.

## Projektstruktur
1. **Phase 1: Vorbereitung und Analyse** [COMPLETED]
   - [x] GitHub Repository ist vorhanden
   - [x] Projektstruktur erstellt
   - [x] Grundlegende Dateien angelegt
   - [x] Node.js und npm installiert
   - [x] Dependencies installiert (express, cors, dotenv, googleapis, helmet, nodemon)

2. **Phase 2: Backend-Setup** [IN PROGRESS]
   - [x] Einrichten der grundlegenden Server-Struktur
   - [x] Migration der Booking-Routes begonnen
   - [x] Sheet-Konfiguration übernommen
   - [ ] Setup der Google Sheets API und Service Account
   - [ ] Vollständige Migration der Apps Script Funktionen

3. **Phase 3: Frontend-Migration** [NEXT]
   - [ ] Anpassung des HTML/CSS
   - [ ] Migration des JavaScript Codes
   - [ ] Implementation der API Aufrufe
   - [ ] Anpassung der Buchungslogik

4. **Phase 4: Integration** [PENDING]
   - [ ] Verbindung von Frontend und Backend
   - [ ] Testing der Funktionalitäten
   - [ ] Deployment Setup

5. **Phase 5: Deployment** [PENDING]
   - [ ] Frontend Deployment auf GitHub Pages
   - [ ] Backend Deployment
   - [ ] Finale Tests

## Aktueller Stand (13.01.2024)
- Node.js und npm erfolgreich installiert
- Projektstruktur und Dependencies eingerichtet
- Backend-Grundstruktur mit Express aufgesetzt
- Booking-Routes teilweise migriert
- Sheet-Konfiguration übernommen

## Nächste Schritte
1. Google Service Account Credentials einrichten
2. Vollständige Migration der Booking-Logik abschließen
3. Frontend für neue API-Endpunkte anpassen
4. Testing der migrierten Funktionalität

## Wichtige IDs und Konfigurationen
- Source Sheet ID: '1-wiTnD2XA3pX1vShG9hnWgzQ2QNVwh7Hkcz0ej3sq8g'
- Target Sheet ID: '1sv0E7ZQdKsMFBfCeMLeY63jDgEBBYdR069PILqJjsDM'

## Projektstruktur
```
LEHRERPROFIBUCHUNG/
├── frontend/
│   ├── images/
│   ├── styles/
│   ├── js/
│   └── index.html
├── api/
│   ├── config/
│   └── routes/
└── README.md
```

## Wichtige Notizen
- Google Service Account Credentials werden benötigt
- Frontend muss an neue API-Endpunkte angepasst werden
- Node.js und npm müssen auf dem Entwicklungssystem installiert sein
- Booking-Logik muss von Apps Script zu Express migriert werden

## Für nächsten Sprint
1. Google Cloud Projekt einrichten
2. Service Account erstellen und Credentials sichern
3. Frontend-Code für neue API-Endpunkte anpassen
4. Erste Integrationstests durchführen