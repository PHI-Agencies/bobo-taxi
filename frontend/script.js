document.addEventListener('DOMContentLoaded', () => {
    // --- Éléments du DOM ---
    const activeRequestsList = document.getElementById('active-requests-list');
    const searchInput = document.getElementById('search-input') || document.getElementById('filter-input');
    const searchButton = document.getElementById('search-button');
    const form = document.getElementById('create-request-form');
    const message = document.getElementById('request-message');

    // Utilisation du chemin relatif pour éviter les erreurs de domaine (CORS)
    const API_URL = '/api/requests';

    /** ------------------------------
     * Fonction pour afficher les demandes
     * ------------------------------ */
    function displayRequests(requests) {
        if (!activeRequestsList) return;
        activeRequestsList.innerHTML = '';

        if (!requests || requests.length === 0) {
            activeRequestsList.innerHTML = '<p style="text-align:center; color:#aaa; padding:20px;">Aucune demande trouvée pour le moment.</p>';
            return;
        }

        requests.forEach(req => {

    // 🔥 CALCUL DU TEMPS RESTANT
    const now = new Date();
    const expireAt = new Date(req.expireAt);
    const diffMs = expireAt - now;

    // Si déjà expiré (sécurité front)
    if (diffMs <= 0) return;

    const remainingHours = Math.ceil(diffMs / (1000 * 60 * 60));

    const dateParts = req.date.split('-');
    const dateDisplay = dateParts.length === 3 
        ? `${dateParts[2]}/${dateParts[1]}` 
        : req.date;

    const card = document.createElement('div');
    card.className = 'request-card';
    card.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <span style="font-size:0.7rem; color:var(--primary); font-weight:bold;">
                ${req.type.toUpperCase()}
            </span>
            <span style="font-size:0.7rem; opacity:0.6;">
                ⏳ Expire dans ${remainingHours}h
            </span>
        </div>

        <div style="font-weight:600; font-size:1.1rem; margin-bottom:12px;">
            📍 ${req.departure}
        </div>

        <div style="display: flex; gap: 8px; margin-bottom:10px;">
            <div style="flex:1; background:rgba(255,255,255,0.05); padding:6px; border-radius:8px; text-align:center; border: 1px solid #333;">
                <div style="font-size:0.55rem; color:var(--text-muted);">DATE</div>
                <div style="font-size:0.85rem; font-weight:600; color:var(--primary);">${dateDisplay}</div>
            </div>
            <div style="flex:1; background:rgba(255,255,255,0.05); padding:6px; border-radius:8px; text-align:center; border: 1px solid #333;">
                <div style="font-size:0.55rem; color:var(--text-muted);">HEURE</div>
                <div style="font-size:0.85rem; font-weight:600; color:var(--primary);">${req.time}</div>
            </div>
        </div>

        <p style="font-size:0.8rem; color:#888;">
            ${req.description || ''}
        </p>

        <button class="btn-unlock" onclick="location.href='inscription.html'">
            <i class="fas fa-lock"></i> VOIR LE NUMÉRO
        </button>
    `;

    listContainer.appendChild(card);
});
    }

    /** ------------------------------
     * Récupération des données
     * ------------------------------ */
    async function fetchRequests() {
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error('Erreur Serveur');
            const data = await res.json();
            displayRequests(data);
        } catch (err) {
            console.error('Erreur lors de la récupération :', err);
            if(activeRequestsList) {
                activeRequestsList.innerHTML = '<p style="color:red; text-align:center; padding:20px;">Erreur de connexion au serveur.</p>';
            }
        }
    }

    /** ------------------------------
     * Logique de recherche (Filtrage local pour plus de rapidité)
     * ------------------------------ */
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.request-card');
            
            cards.forEach(card => {
                const text = card.innerText.toLowerCase();
                card.style.display = text.includes(term) ? "block" : "none";
            });
        });
    }

    /** ------------------------------
     * Création d'une demande (Page demande.html)
     * ------------------------------ */
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Mapping exact avec les champs du Backend Request.js
            const requestBody = {
                type: document.getElementById('transport-type').value,
                departure: document.getElementById('itinerary').value,
                date: document.getElementById('departure-date').value,
                time: document.getElementById('departure-time').value,
                duration: document.getElementById('validity-duration').value,
                contact: document.getElementById('contact-info').value,
                description: document.getElementById('comments').value
            };

            try {
                const res = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody)
                });
                
                if (res.ok) {
                    message.textContent = '✅ Demande publiée avec succès !';
                    message.style.color = '#f1c40f';
                    form.reset();
                    setTimeout(() => window.location.href = 'index.html', 1500);
                } else {
                    const errorData = await res.json();
                    message.textContent = '❌ Erreur : ' + (errorData.message || 'Champs invalides');
                    message.style.color = 'red';
                }
            } catch (err) {
                message.textContent = '❌ Impossible de contacter le serveur';
                console.error(err);
            }
        });
    }

    // Lancement automatique au chargement
    fetchRequests();
});