import express from 'express';
import { google } from 'googleapis';
import { SHEETS_CONFIG, SHEETS_OPTIONS } from '../config/sheets.js';

const router = express.Router();

// Helper-Funktion zum Konvertieren von Zeit in Minuten
function timeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// Route für Verfügbarkeiten abrufen
router.get('/availability', async (req, res) => {
    try {
        const weekOffset = parseInt(req.query.weekOffset) || 0;
        
        // Google Sheets Client mit Auth initialisieren
        const auth = new google.auth.GoogleAuth(SHEETS_OPTIONS);
        const sheets = google.sheets({ version: 'v4', auth });
        
        // Hole Daten aus dem FreieTermine Sheet
        const availabilityResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEETS_CONFIG.SOURCE_SHEET_ID,
            range: 'FreieTermine!A:C'
        });
        const availabilityData = availabilityResponse.data.values || [];

        // Hole unbestätigte Buchungen aus beiden Sheets
        let unconfirmedBookings = [];
        
        // Quell-Sheet Buchungen
        const sourceBookingsResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEETS_CONFIG.SOURCE_SHEET_ID,
            range: 'Buchungen!A:H'
        });
        if (sourceBookingsResponse.data.values) {
            const bookingsData = sourceBookingsResponse.data.values;
            unconfirmedBookings = bookingsData.slice(1)
                .filter(row => row[7] === false)
                .map(row => ({
                    day: row[5],
                    time: row[6]
                }));
        }

        // Ziel-Sheet Buchungen
        try {
            const targetBookingsResponse = await sheets.spreadsheets.values.get({
                spreadsheetId: SHEETS_CONFIG.TARGET_SHEET_ID,
                range: 'Buchungen!A:H'
            });
            if (targetBookingsResponse.data.values) {
                const targetBookingsData = targetBookingsResponse.data.values;
                const targetUnconfirmed = targetBookingsData.slice(1)
                    .filter(row => row[7] === false)
                    .map(row => ({
                        day: row[5],
                        time: row[6]
                    }));
                unconfirmedBookings = unconfirmedBookings.concat(targetUnconfirmed);
            }
        } catch (error) {
            console.error('Fehler beim Abrufen der Buchungen aus dem Ziel-Sheet:', error);
        }

        // Verfügbarkeiten verarbeiten
        const availability = {
            "Montag": [], "Dienstag": [], "Mittwoch": [],
            "Donnerstag": [], "Freitag": [], "Samstag": [], "Sonntag": []
        };

        const tempSlots = {
            "Montag": [], "Dienstag": [], "Mittwoch": [],
            "Donnerstag": [], "Freitag": [], "Samstag": [], "Sonntag": []
        };

        // Sammle erst alle Slots
        for (let i = 1; i < availabilityData.length; i++) {
            const row = availabilityData[i];
            const wochentag = row[0];
            let startzeit = row[1];
            let endzeit = row[2];

            if (startzeit instanceof Date) {
                startzeit = new Date(startzeit).toLocaleTimeString('de-DE', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                });
            }
            if (endzeit instanceof Date) {
                endzeit = new Date(endzeit).toLocaleTimeString('de-DE', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                });
            }

            if (tempSlots.hasOwnProperty(wochentag)) {
                tempSlots[wochentag].push({
                    start: startzeit,
                    end: endzeit
                });
            }
        }

        // Verarbeite die Slots für jeden Tag
        for (const day in tempSlots) {
            if (tempSlots[day].length > 0) {
                tempSlots[day].sort((a, b) => a.start.localeCompare(b.start));

                let i = 0;
                while (i < tempSlots[day].length - 1) {
                    const currentSlot = tempSlots[day][i];
                    const nextSlot = tempSlots[day][i + 1];

                    const currentStartMinutes = timeToMinutes(currentSlot.start);
                    const currentEndMinutes = timeToMinutes(currentSlot.end);
                    const nextStartMinutes = timeToMinutes(nextSlot.start);
                    const nextEndMinutes = timeToMinutes(nextSlot.end);

                    if (currentEndMinutes === nextStartMinutes &&
                        (nextEndMinutes - currentStartMinutes) === 30) {

                        const timeSlot = `${currentSlot.start} - ${nextSlot.end}`;

                        const isUnconfirmed = unconfirmedBookings.some(booking =>
                            booking.day === day && booking.time === timeSlot
                        );

                        if (!isUnconfirmed) {
                            availability[day].push(timeSlot);
                        }

                        i += 2;
                    } else {
                        i++;
                    }
                }
            }
        }

        // Prüfe verfügbare Slots
        let hasAvailableSlots = false;
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const currentDay = today.getDay();
        const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
        const weekStart = new Date(today);
        weekStart.setDate(diff + (7 * weekOffset));

        for (const day in availability) {
            if (availability[day].length > 0) {
                const dayIndex = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'].indexOf(day);
                const dayDate = new Date(weekStart);
                dayDate.setDate(weekStart.getDate() + dayIndex);

                if (dayDate >= tomorrow) {
                    hasAvailableSlots = true;
                    break;
                }
            }
        }

        res.json({
            availability: availability,
            hasAvailableSlots: hasAvailableSlots
        });

    } catch (error) {
        console.error('Error fetching availability:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Route für neue Buchung
router.post('/booking', async (req, res) => {
    try {
        const bookingData = req.body;
        const auth = new google.auth.GoogleAuth(SHEETS_OPTIONS);
        const sheets = google.sheets({ version: 'v4', auth });

        // Zeit- und Datumberechnung
        const today = new Date();
        const weekOffset = Number(bookingData.weekOffset) || 0;
        const currentDay = today.getDay();
        const daysToLastMonday = currentDay === 0 ? 6 : currentDay - 1;
        
        const lastMonday = new Date(today);
        lastMonday.setDate(today.getDate() - daysToLastMonday);
        
        const targetMonday = new Date(lastMonday);
        targetMonday.setDate(lastMonday.getDate() + (7 * weekOffset));
        
        const daysMap = {
            'Montag': 0, 'Dienstag': 1, 'Mittwoch': 2,
            'Donnerstag': 3, 'Freitag': 4, 'Samstag': 5, 'Sonntag': 6
        };
        
        const targetDate = new Date(targetMonday);
        targetDate.setDate(targetMonday.getDate() + daysMap[bookingData.day]);
        
        const bookingTime = new Date();
        const formattedBookingDate = targetDate.toLocaleDateString('de-DE');

        // Hole Sheet Namen
        const sourceSheet = await sheets.spreadsheets.get({
            spreadsheetId: SHEETS_CONFIG.SOURCE_SHEET_ID
        });
        const sheetName = sourceSheet.data.properties.title;

        // Bereite Buchungsdaten vor
        const newRow = [
            new Date().toLocaleString('de-DE'),
            sheetName,
            bookingData.name,
            bookingData.phone,
            formattedBookingDate,
            bookingData.day,
            bookingData.time,
            false
        ];

        // Speichere in Quell-Sheet
        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEETS_CONFIG.SOURCE_SHEET_ID,
            range: 'Buchungen!A:H',
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [newRow]
            }
        });

        // Versuche im Ziel-Sheet zu speichern
        try {
            await sheets.spreadsheets.values.append({
                spreadsheetId: SHEETS_CONFIG.TARGET_SHEET_ID,
                range: 'Buchungen!A:H',
                valueInputOption: 'USER_ENTERED',
                resource: {
                    values: [newRow]
                }
            });
        } catch (targetError) {
            console.error('Warnung: Konnte nicht im Ziel-Sheet speichern:', targetError);
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error saving booking:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;