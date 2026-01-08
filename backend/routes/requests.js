router.post('/', async (req, res) => {
  try {
    const allowedDurations = [12, 24, 48];
    const hours = Number(req.body.duration);

    if (!allowedDurations.includes(hours)) {
      return res.status(400).json({
        message: 'Durée invalide (12, 24 ou 48 heures uniquement)'
      });
    }

    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + hours);

    const newRequest = new Request({
      ...req.body,
      duration: hours,
      expireAt: expirationDate
    });

    await newRequest.save();
    res.status(201).json({ message: 'Demande créée avec succès' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
// CETTE LIGNE EST INDISPENSABLE :
export default router;
