import { api } from './api.js';

class BookingManager {
    constructor() {
        this.currentWeekOffset = 0;
        this.hasBooked = false;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Navigation Buttons
        document.getElementById('prevWeek')?.addEventListener('click', () => this.handleWeekNavigation('prev'));
        document.getElementById('nextWeek')?.addEventListener('click', () => this.handleWeekNavigation('next'));

        // Zeit Filter
        document.querySelectorAll('.filter-btn')?.forEach(button => {
            button.addEventListener('click', (e) => this.handleFilterChange(e));
        });

        // Buchungsformular
        document.getElementById('bookingForm')?.addEventListener('submit', (e) => this.handleBookingSubmit(e));
    }

    async handleWeekNavigation(direction) {
        if (direction === 'prev' && this.currentWeekOffset > 0) {
            this.currentWeekOffset--;
        } else if (direction === 'next' && this.currentWeekOffset < 2) {
            this.currentWeekOffset++;
        }
        await this.fetchAndDisplayAvailability();
    }

    async handleFilterChange(event) {
        const buttons = document.querySelectorAll('.filter-btn');
        buttons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        await this.fetchAndDisplayAvailability();
    }

    async handleBookingSubmit(event) {
        event.preventDefault();
        // Implementierung folgt...
    }

    async fetchAndDisplayAvailability() {
        try {
            // Implementierung folgt...
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

// Initialisiere den BookingManager wenn das DOM geladen ist
document.addEventListener('DOMContentLoaded', () => {
    new BookingManager();
});