document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('create-request-form');
  const message = document.getElementById('request-message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    message.textContent = "Publication en cours...";

    // 🔗 Harmonisation des noms avec le backend
    const requestData = {
      type: document.getElementById('transport-type').value,
      departure: document.getElementById('itinerary').value,
      date: document.getElementById('departure-date').value,
      time: document.getElementById('departure-time').value,
      duration: parseInt(document.getElementById('validity-duration').value),
      contact: document.getElementById('contact-info').value,
      description: document.getElementById('comments').value
    };

    try {
      const res = await fetch('/api/requests', { // Utilise le chemin relatif
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      if (res.ok) {
        message.textContent = '✅ Demande publiée !';
        message.style.color = '#27ae60';
        setTimeout(() => window.location.href = 'index.html', 1500);
      } else {
        const errData = await res.json();
        throw new Error(errData.message || 'Erreur serveur');
      }
    } catch (err) {
      message.textContent = '❌ Erreur : ' + err.message;
      message.style.color = '#e74c3c';
    }
  });
});