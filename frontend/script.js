document.addEventListener('DOMContentLoaded', () => {
    // --- Éléments du DOM ---
    const activeRequestsList = document.getElementById('active-requests-list');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const form = document.getElementById('create-request-form');
    const message = document.getElementById('request-message');

    const API_URL = 'https://bobotaxi.onrender.com/api/requests';

    /** ------------------------------
     * Fonction pour afficher les demandes
     * ------------------------------ */
    function displayRequests(requests) {
        if (!activeRequestsList) return;
        activeRequestsList.innerHTML = '';

        if (requests.length === 0) {
            activeRequestsList.innerHTML = '<p style="text-align:center; color:#aaa;">Aucune demande trouvée pour le moment.</p>';
            return;
        }

        requests.forEach(req => {
            const div = document.createElement('div');
            div.classList.add('request-item');
            
            // On remplace le contact par le texte "Réservé aux taximans"
            div.innerHTML = `
                <div class="request-header">
                    <h3><i class="fas fa-taxi"></i> ${req.transportType}</h3>
                    <span class="time-badge">${req.validity}h restante(s)</span>
                </div>
                <div class="itinerary-box">
                    <strong>Itinéraire :</strong> ${req.itinerary}
                </div>
                <p><strong>Heure de départ :</strong> ${req.departureTime}</p>
                
                <p><strong>Contact :</strong> <span class="premium-text" style="color:#f1c40f; font-weight:bold;">Réservé aux taximans actifs</span></p>
                
                <p style="font-size:0.85rem; color:#888;"><em>Note : ${req.comments || 'Pas de précision.'}</em></p>
                
                <button class="btn-premium-lock" onclick="window.location.href='inscription.html'">
                    <i class="fas fa-id-card"></i> S'inscrire pour contacter
                </button>
            `;
            activeRequestsList.appendChild(div);
        });
    }

    /** ------------------------------
     * Récupération initiale des données
     * ------------------------------ */
    async function fetchRequests() {
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            displayRequests(data);
        } catch (err) {
            console.error('Erreur lors de la récupération :', err);
            if(activeRequestsList) {
                activeRequestsList.innerHTML = '<p style="color:red;">Erreur de connexion au serveur.</p>';
            }
        }
    }

    /** ------------------------------
     * Logique de recherche
     * ------------------------------ */
    async function performSearch(query) {
        try {
            const url = query 
                ? `${API_URL}/search?q=${encodeURIComponent(query)}` 
                : API_URL;
            const res = await fetch(url);
            const data = await res.json();
            displayRequests(data);
        } catch (err) {
            console.error('Erreur recherche :', err);
        }
    }

    if (searchButton && searchInput) {
        searchButton.addEventListener('click', (e) => {
            e.preventDefault();
            performSearch(searchInput.value.trim());
        });

        searchInput.addEventListener('input', () => {
            performSearch(searchInput.value.trim());
        });
    }

    /** ------------------------------
     * Création d'une demande (Page demande.html)
     * ------------------------------ */
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const request = {
                departureTime: document.getElementById('departure-time').value,
                itinerary: document.getElementById('itinerary').value,
                transportType: document.getElementById('transport-type').value,
                contactInfo: document.getElementById('contact-info').value,
                validity: document.getElementById('validity-duration').value,
                comments: document.getElementById('comments').value
            };

            try {
                const res = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(request)
                });
                
                if (res.ok) {
                    message.textContent = '✅ Demande envoyée !';
                    message.style.color = '#f1c40f';
                    form.reset();
                    setTimeout(() => window.location.href = 'index.html', 1500);
                }
            } catch (err) {
                message.textContent = '❌ Erreur d\'envoi';
                console.error(err);
            }
        });
    }

    fetchRequests();
});