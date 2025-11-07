document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const sideMenu = document.getElementById('side-menu');
    const closeSideMenu = document.getElementById('close-side-menu');
    const form = document.getElementById('create-request-form');
    const message = document.getElementById('request-message');
    const activeRequestsList = document.getElementById('active-requests-list'); // si tu veux afficher les demandes sur index.html
    const searchInput = document.getElementById('search-input'); // barre de recherche
    const searchButton = document.getElementById('search-button');

    const API_URL = 'https://bobotaxi.onrender.com/api/requests';
;

    // --- Menu latéral ---
    if (menuToggle && sideMenu) {
        menuToggle.addEventListener('click', () => {
            sideMenu.classList.toggle('open');
        });
    }

    if (closeSideMenu) {
        closeSideMenu.addEventListener('click', () => {
            sideMenu.classList.remove('open');
        });
    }

    /** ------------------------------
   * Fonction pour afficher les demandes
   * ------------------------------ */
  function displayRequests(requests) {
    if (!activeRequestsList) return;
    activeRequestsList.innerHTML = '';

    if (requests.length === 0) {
      activeRequestsList.innerHTML = '<p>Aucune demande trouvée.</p>';
      return;
    }

    requests.forEach(req => {
      const div = document.createElement('div');
      div.classList.add('request-item');
      div.innerHTML = `
        <h3>${req.transportType}</h3>
        <p><strong>Départ :</strong> ${req.departureTime}</p>
        <p><strong>Itinéraire :</strong> ${req.itinerary}</p>
        <p><strong>Contact :</strong> ${req.contactInfo}</p>
        <p><strong>Valide pour :</strong> ${req.validity}h</p>
        <p><strong>Commentaires :</strong> ${req.comments || 'Aucun'}</p>
        <button class="contact-button" onclick="window.open('https://wa.me/${req.contactInfo.replace(/\D/g,'')}')">Contacter</button>
      `;
      activeRequestsList.appendChild(div);
    });
  }

  /** ------------------------------
   * Création d'une demande
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
        const data = await res.json();

        if (res.ok) {
          message.textContent = '✅ Demande envoyée avec succès !';
          message.style.color = 'green';
          form.reset();
          setTimeout(() => window.location.href = 'index.html', 1500);
        } else {
          throw new Error(data.error);
        }
      } catch (err) {
        message.textContent = '❌ Erreur lors de l’envoi de la demande';
        message.style.color = 'red';
        console.error(err);
      }
    });
  }

  /** ------------------------------
   * Affichage initial des demandes sur index.html
   * ------------------------------ */
  async function fetchRequests() {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      displayRequests(data);
    } catch (err) {
      console.error('Erreur lors de la récupération des demandes :', err);
    }
  }

  fetchRequests();

  /** ------------------------------
   * Recherche dans toutes les demandes
   * ------------------------------ */
  if (searchButton && searchInput) {
  async function performSearch(query) {
    try {
      const url = query
        ? `${API_URL}/search?q=${encodeURIComponent(query)}`
        : API_URL;
      const res = await fetch(url);
      const data = await res.json();
      displayRequests(data);
    } catch (err) {
      console.error('Erreur lors de la recherche :', err);
    }
  }

  searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    performSearch(searchInput.value.trim());
  });

  searchInput.addEventListener('input', () => {
    performSearch(searchInput.value.trim());
  });
}

    // Recherche en temps réel à la frappe (optionnel)
    searchInput.addEventListener('input', async () => {
      const query = searchInput.value.trim();
      if (!query) return fetchRequests();

      try {
        const res = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        displayRequests(data);
      } catch (err) {
        console.error('Erreur lors de la recherche :', err);
      }
    });
  }
);