// API Funktionen für Google Sheets Integration
class API {
    constructor() {
        // Basis-URL für API-Aufrufe
        this.baseURL = '/api';
    }

    // Verfügbare Termine abrufen
    async fetchAvailability(weekOffset = 0) {
        try {
            const response = await fetch(`${this.baseURL}/availability?weekOffset=${weekOffset}`);
            if (!response.ok) throw new Error('Fehler beim Laden der Verfügbarkeiten');
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Buchung speichern
    async saveBooking(bookingData) {
        try {
            const response = await fetch(`${this.baseURL}/booking`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData)
            });
            if (!response.ok) throw new Error('Fehler beim Speichern der Buchung');
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
}

// Exportiere eine Instanz der API-Klasse
export const api = new API();