# Configuration EmailJS et Google Calendar

## 📧 Configuration EmailJS (Obligatoire)

### 1. Créer un compte EmailJS
1. Allez sur [https://www.emailjs.com/](https://www.emailjs.com/)
2. Créez un compte gratuit (200 emails/mois gratuits)
3. Créez un service email (Gmail, Outlook, etc.)

### 2. Créer les templates d'email

#### Template pour le client (confirmation)
- **Template ID**: `YOUR_TEMPLATE_ID_CLIENT`
- **Sujet**: Confirmation de réservation - RF Studio
- **Contenu**:
```
Bonjour {{to_name}},

Votre réservation a été confirmée !

Détails de la réservation:
- Durée: {{hours}} heure(s)
- Prix: {{price}}
- Date: {{date}}
- Heure: {{time}}

{{#message}}
Message: {{message}}
{{/message}}

Nous avons hâte de vous accueillir au RF Studio !

L'équipe RF Studio
RFSTUDIO@OUTLOOK.FR
01.84.80.95.84
```

#### Template pour le studio (notification)
- **Template ID**: `YOUR_TEMPLATE_ID_STUDIO`
- **Sujet**: Nouvelle réservation - {{client_name}}
- **Contenu**:
```
Nouvelle réservation reçue !

Client: {{client_name}}
Email: {{client_email}}
Téléphone: {{client_phone}}

Détails:
- Durée: {{hours}} heure(s)
- Prix: {{price}}
- Date: {{date}}
- Heure: {{time}}

{{#message}}
Message: {{message}}
{{/message}}
```

### 3. Récupérer vos clés
1. Dans EmailJS, allez dans **Account > API Keys**
2. Copiez votre **Public Key**
3. Dans **Email Services**, copiez votre **Service ID**
4. Dans **Email Templates**, copiez les **Template IDs**

### 4. Mettre à jour le code
Dans `script.js`, ligne 5, remplacez:
```javascript
emailjs.init("YOUR_PUBLIC_KEY"); // Remplacez par votre clé publique
```

Dans les fonctions d'envoi d'email, remplacez:
- `YOUR_SERVICE_ID` par votre Service ID
- `YOUR_TEMPLATE_ID_CLIENT` par l'ID du template client
- `YOUR_TEMPLATE_ID_STUDIO` par l'ID du template studio

## 📅 Google Calendar (Automatique)

Le système utilise un **lien Google Calendar** qui s'ouvre automatiquement dans un nouvel onglet. 

**Aucune configuration nécessaire !** 

Quand un client réserve :
1. L'email de confirmation est envoyé (via EmailJS)
2. Une fenêtre Google Calendar s'ouvre avec l'événement pré-rempli
3. Le client peut ajouter l'événement à son calendrier
4. **Pour le studio** : Vous pouvez créer un calendrier partagé et partager le lien avec les clients, ou simplement copier l'événement depuis votre email de notification

### Option : Calendrier partagé pour le studio
1. Créez un calendrier Google dédié "RF Studio - Réservations"
2. Partagez-le avec votre équipe
3. Quand vous recevez une notification de réservation, ajoutez manuellement l'événement au calendrier partagé

## 🚀 Déploiement

1. Configurez EmailJS (voir ci-dessus)
2. Remplacez les clés dans `script.js`
3. Testez une réservation
4. Déployez sur Vercel/Netlify/GitHub Pages

**C'est tout !** Aucun backend nécessaire, tout fonctionne via APIs frontend.
