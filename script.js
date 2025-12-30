// Initialize EmailJS
(function() {
    // Initialize EmailJS with your public key
    // Remplacez 'YOUR_PUBLIC_KEY' par votre clé publique EmailJS
    emailjs.init("YOUR_PUBLIC_KEY"); // À remplacer par votre clé
})();

// Header scroll effect
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 20) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Mobile menu toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Contact form handling
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Here you would normally send the data to a server
        // For now, we'll just show an alert
        console.log('Form data:', data);
        
        alert('Merci pour votre message ! Nous vous contacterons bientôt.');
        
        // Reset form
        contactForm.reset();
    });
}

// Set current year in footer
const currentYearElement = document.getElementById('current-year');
if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
}

// Reservation Modal Functions
function openReservationModal(packName, packPrice, packDuration) {
    const modal = document.getElementById('reservation-modal');
    const packNameElement = document.getElementById('modal-pack-name');
    const packPriceElement = document.getElementById('modal-pack-price');
    const packDurationElement = document.getElementById('modal-pack-duration');
    const selectedPackInput = document.getElementById('selected-pack');
    
    if (modal && packNameElement && packPriceElement && packDurationElement && selectedPackInput) {
        packNameElement.textContent = packName;
        packPriceElement.textContent = packPrice;
        packDurationElement.textContent = packDuration;
        selectedPackInput.value = packName;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closeReservationModal() {
    const modal = document.getElementById('reservation-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        // Reset form
        const form = document.getElementById('reservation-form');
        if (form) {
            form.reset();
        }
    }
}

// Close modal when clicking outside
const modal = document.getElementById('reservation-modal');
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeReservationModal();
        }
    });
}

// Handle reservation form submission (Pack booking)
const reservationForm = document.getElementById('reservation-form');
if (reservationForm) {
    reservationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(reservationForm);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        const submitBtn = reservationForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        
        try {
            // Get pack details
            const packName = document.getElementById('modal-pack-name').textContent;
            const packPrice = document.getElementById('modal-pack-price').textContent;
            const packDuration = document.getElementById('modal-pack-duration').textContent;
            
            // Send email to client
            await emailjs.send(
                'YOUR_SERVICE_ID', // À remplacer par votre Service ID EmailJS
                'YOUR_TEMPLATE_ID_CLIENT', // À remplacer par votre Template ID pour le client
                {
                    to_name: data.name,
                    to_email: data.email,
                    pack: packName,
                    price: packPrice,
                    duration: packDuration,
                    date: data.date,
                    time: data.time,
                    message: data.message || 'Aucun message'
                }
            );
            
            // Send email to studio (notification)
            await emailjs.send(
                'YOUR_SERVICE_ID', // À remplacer par votre Service ID EmailJS
                'YOUR_TEMPLATE_ID_STUDIO', // À remplacer par votre Template ID pour le studio
                {
                    client_name: data.name,
                    client_email: data.email,
                    client_phone: data.phone,
                    pack: packName,
                    price: packPrice,
                    duration: packDuration,
                    date: data.date,
                    time: data.time,
                    message: data.message || 'Aucun message'
                }
            );
            
            // Add to Google Calendar via link
            const hours = parseInt(packDuration.replace('H', ''));
            addToGoogleCalendar({
                summary: `Réservation RF Studio - ${packName} - ${data.name}`,
                description: `Pack: ${packName} (${packPrice})\nClient: ${data.name}\nEmail: ${data.email}\nTéléphone: ${data.phone}${data.message ? '\nMessage: ' + data.message : ''}`,
                startDateTime: `${data.date}T${data.time}:00`,
                duration: hours
            });
            
            // Show success message
            alert(`✅ Réservation confirmée pour ${packName} !\n\nPrix: ${packPrice}\nDurée: ${packDuration}\n\nDate: ${data.date} à ${data.time}\n\nUn email de confirmation vous a été envoyé.\n\nUne fenêtre Google Calendar s'ouvre pour ajouter l'événement à votre calendrier.`);
            
            // Close modal and reset form
            closeReservationModal();
        } catch (error) {
            console.error('Erreur lors de l\'envoi:', error);
            alert('Une erreur est survenue. Veuillez réessayer ou nous contacter directement.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
}

// Set minimum date to today for date input
const dateInput = document.getElementById('reservation-date');
if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

// Function to add event to Google Calendar via link
function addToGoogleCalendar(eventData) {
    try {
        // Create Google Calendar link
        const startDate = new Date(eventData.startDateTime);
        const endDate = new Date(startDate);
        endDate.setHours(endDate.getHours() + eventData.duration);
        
        // Format dates for Google Calendar (YYYYMMDDTHHmmss)
        const formatDateForGoogle = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${year}${month}${day}T${hours}${minutes}${seconds}`;
        };
        
        const startFormatted = formatDateForGoogle(startDate);
        const endFormatted = formatDateForGoogle(endDate);
        
        // Create Google Calendar URL
        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventData.summary)}&dates=${startFormatted}/${endFormatted}&details=${encodeURIComponent(eventData.description)}&location=RF Studio, 10 BIS RUE DE PARIS, PISCOP`;
        
        // Open Google Calendar in new tab
        window.open(googleCalendarUrl, '_blank');
        
        return { success: true, url: googleCalendarUrl };
    } catch (error) {
        console.error('Erreur Google Calendar:', error);
        return { success: false, error: error.message };
    }
}

// Session Modal Functions (Hourly Booking)
function openSessionModal() {
    const modal = document.getElementById('session-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Reset form
        const form = document.getElementById('session-form');
        if (form) {
            form.reset();
            calculateSessionPrice();
        }
        // Set minimum date
        const dateInput = document.getElementById('session-date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }
    }
}

function closeSessionModal() {
    const modal = document.getElementById('session-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        // Reset form
        const form = document.getElementById('session-form');
        if (form) {
            form.reset();
            calculateSessionPrice();
        }
    }
}

// Calculate session price based on hours
function calculateSessionPrice() {
    const hoursSelect = document.getElementById('session-hours');
    const priceDisplay = document.getElementById('session-total-price');
    
    if (hoursSelect && priceDisplay) {
        const hours = parseInt(hoursSelect.value);
        let price = 0;
        
        if (hours === 6) {
            price = 210; // Pack R price
        } else if (hours >= 2) {
            price = hours * 40; // 40€ per hour
        }
        
        priceDisplay.textContent = price > 0 ? `${price}€` : '0€';
    }
}

// Close session modal when clicking outside
const sessionModal = document.getElementById('session-modal');
if (sessionModal) {
    sessionModal.addEventListener('click', (e) => {
        if (e.target === sessionModal) {
            closeSessionModal();
        }
    });
}

// Handle session form submission
const sessionForm = document.getElementById('session-form');
if (sessionForm) {
    sessionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(sessionForm);
        const data = Object.fromEntries(formData);
        const hours = parseInt(data.hours);
        const price = hours === 6 ? 210 : hours * 40;
        
        // Show loading state
        const submitBtn = sessionForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        
        try {
            // Send email to client
            await emailjs.send(
                'YOUR_SERVICE_ID', // À remplacer par votre Service ID EmailJS
                'YOUR_TEMPLATE_ID_CLIENT', // À remplacer par votre Template ID pour le client
                {
                    to_name: data.name,
                    to_email: data.email,
                    hours: hours,
                    price: price + '€',
                    date: data.date,
                    time: data.time,
                    message: data.message || 'Aucun message'
                }
            );
            
            // Send email to studio (notification)
            await emailjs.send(
                'YOUR_SERVICE_ID', // À remplacer par votre Service ID EmailJS
                'YOUR_TEMPLATE_ID_STUDIO', // À remplacer par votre Template ID pour le studio
                {
                    client_name: data.name,
                    client_email: data.email,
                    client_phone: data.phone,
                    hours: hours,
                    price: price + '€',
                    date: data.date,
                    time: data.time,
                    message: data.message || 'Aucun message'
                }
            );
            
            // Add to Google Calendar via link
            addToGoogleCalendar({
                summary: `Réservation RF Studio - ${data.name}`,
                description: `Réservation de ${hours}h (${price}€)\nClient: ${data.name}\nEmail: ${data.email}\nTéléphone: ${data.phone}${data.message ? '\nMessage: ' + data.message : ''}`,
                startDateTime: `${data.date}T${data.time}:00`,
                duration: hours
            });
            
            // Show success message
            alert(`✅ Réservation confirmée !\n\n${hours} heure(s) - ${price}€\n\nDate: ${data.date} à ${data.time}\n\nUn email de confirmation vous a été envoyé.\n\nUne fenêtre Google Calendar s'ouvre pour ajouter l'événement à votre calendrier.`);
            
            // Close modal and reset form
            closeSessionModal();
        } catch (error) {
            console.error('Erreur lors de l\'envoi:', error);
            alert('Une erreur est survenue. Veuillez réessayer ou nous contacter directement.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
}

// Add animation on scroll (optional enhancement)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe service cards and gallery items
document.addEventListener('DOMContentLoaded', () => {
    const serviceCards = document.querySelectorAll('.service-card');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const tarifCards = document.querySelectorAll('.tarif-card');
    
    [...serviceCards, ...galleryItems, ...tarifCards].forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
});

