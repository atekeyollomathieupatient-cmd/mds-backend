require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// ── CONTACT ──
app.post('/api/contact', async (req, res) => {
  try {
    const { nom, email, service, message } = req.body;
    await supabase.from('contacts').insert([{ nom, email, service, message }]);
    await axios.post('https://api.brevo.com/v3/smtp/email', {
      sender: { name: "MDS NovaTech", email: "contact@mds-novatech.com" },
      to: [{ email: "contact@mds-novatech.com" }],
      subject: `Nouveau message de ${nom}`,
      htmlContent: `<h3>Nouveau message de contact</h3>
        <p><strong>Nom:</strong> ${nom}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Message:</strong> ${message}</p>`
    }, { headers: { 'api-key': process.env.BREVO_KEY } });
    res.json({ success: true, message: 'Message envoyé avec succès !' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── CANDIDATURE ──
app.post('/api/candidature', async (req, res) => {
  try {
    const { nom, prenom, email, telephone, poste, domaine, motivation } = req.body;
    await supabase.from('candidatures').insert([{ nom, prenom, email, telephone, poste, domaine, motivation }]);
    await axios.post('https://api.brevo.com/v3/smtp/email', {
      sender: { name: "MDS NovaTech", email: "contact@mds-novatech.com" },
      to: [{ email }],
      subject: "Votre candidature a été reçue — MDS NovaTech",
      htmlContent: `<h3>Bonjour ${prenom},</h3>
        <p>Nous avons bien reçu votre candidature pour le poste de <strong>${poste}</strong>.</p>
        <p>Notre équipe l'examinera et vous contactera sous 72h.</p>
        <br/>
        <p>Cordialement,<br/><strong>MDS NovaTech</strong></p>`
    }, { headers: { 'api-key': process.env.BREVO_KEY } });
    await axios.post('https://api.brevo.com/v3/smtp/email', {
      sender: { name: "MDS NovaTech", email: "contact@mds-novatech.com" },
      to: [{ email: "contact@mds-novatech.com" }],
      subject: `Nouvelle candidature — ${poste}`,
      htmlContent: `<h3>Nouvelle candidature reçue</h3>
        <p><strong>Nom:</strong> ${prenom} ${nom}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Téléphone:</strong> ${telephone}</p>
        <p><strong>Poste:</strong> ${poste}</p>
        <p><strong>Domaine:</strong> ${domaine}</p>
        <p><strong>Motivation:</strong> ${motivation}</p>`
    }, { headers: { 'api-key': process.env.BREVO_KEY } });
    res.json({ success: true, message: 'Candidature envoyée avec succès !' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── ABONNEMENT NEWSLETTER ──
app.post('/api/abonner', async (req, res) => {
  try {
    const { email } = req.body;
    const { data: existing } = await supabase
      .from('abonnes')
      .select('email')
      .eq('email', email)
      .single();
    if (existing) {
      return res.json({ success: false, message: 'Vous êtes déjà abonné !' });
    }
    await supabase.from('abonnes').insert([{ email }]);
    await axios.post('https://api.brevo.com/v3/smtp/email', {
      sender: { name: "MDS NovaTech", email: "contact@mds-novatech.com" },
      to: [{ email }],
      subject: "Bienvenue dans la newsletter MDS NovaTech !",
      htmlContent: `<h3>Bienvenue !</h3>
        <p>Vous êtes maintenant abonné à la newsletter de <strong>MDS NovaTech</strong>.</p>
        <p>Vous recevrez nos dernières actualités en informatique et agriculture.</p>
        <br/>
        <p>Cordialement,<br/><strong>MDS NovaTech</strong></p>`
    }, { headers: { 'api-key': process.env.BREVO_KEY } });
    res.json({ success: true, message: 'Abonnement confirmé !' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── DÉMARRAGE ──
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur MDS NovaTech démarré sur le port ${PORT}`));
