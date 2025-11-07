document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('create-request-form');
  const message = document.getElementById('request-message');

  const API_URL = 'https://bobotaxi.onrender.com'; // <-- adapte ce lien Render

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const request = {
      departureTime: document.getElementById('departure-time').value,
      itinerary: document.getElementById('itinerary').value,
      transportType: document.getElementById('transport-type').value,
      contactInfo: document.getElementById('contact-info').value,
      validity: parseInt(document.getElementById('validity-duration').value),
      comments: document.getElementById('comments').value
    };

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });

      if (res.ok) {
        message.textContent = '✅ Demande envoyée avec succès !';
        message.style.color = 'green';
        form.reset();
        setTimeout(() => window.location.href = 'index.html', 1500);
      } else {
        throw new Error('Erreur serveur');
      }
    } catch (err) {
      message.textContent = '❌ Erreur lors de l’envoi';
      message.style.color = 'red';
      console.error(err);
    }
  });
});
