/* =========================================================================
   C'EST LE SEUL FICHIER À MODIFIER POUR METTRE À JOUR TON SITE.
   Change les infos ci-dessous, sauvegarde, et rafraîchis la page.
   ========================================================================= */

const PROFILE = {
  name: "Elerac",
  eyebrow: "Rédacteur de vidéos YouTube",
  bio: "J'écris des vidéos qui font rester les viewers jusqu'à la fin ! Voici une sélection de vidéos sur lesquelles j'ai travaillé !",

  // Laisse vide "" si tu n'as pas de photo. Sinon mets par ex "assets/avatar.jpg"
  avatar: "assets/logo_elerac.png",

  // Réseaux / contact affichés en haut et en bas de page. Ajoute ou supprime des lignes librement.
  socials: [
    { label: "Email : elerac.pro@gmail.com", url: "mailto:elerac.pro@gmail.com" },
    { label: "YouTube", url: "https://www.youtube.com/@el3rac" },
    { label: "Instagram", url: "https://www.instagram.com/elerac_yt" },
  ],

  // Affiche un badge "Disponible" (vert) ou "Complet" (rouge) en bas du site.
  // Change juste cette valeur entre "disponible" et "complet" selon ta situation,
  // puis réuploade data.js sur GitHub pour que ça se mette à jour sur le site.
  availability: "disponible",

  // OPTIONNEL : colle ici une clé API YouTube Data v3 (gratuite) pour afficher
  // le nombre de vues à jour sous chaque vidéo. Laisse "" pour ne pas l'utiliser
  // (le site fonctionne très bien sans). Voir le README pour l'obtenir gratuitement.
  youtubeApiKey: "AIzaSyC0pnxKOepw7OQaTyR_-wJtaEyjj3OdVtA",
};

/* =========================================================================
   TES CATÉGORIES (par ex. un YouTubeur = une catégorie) ET LEURS VIDÉOS.

   - Pour réordonner : change simplement l'ordre des blocs dans le tableau.
   - Pour ajouter une vidéo : ajoute un objet { youtubeId: "..." } dans "videos".
   - Pour ajouter une catégorie : copie-colle un bloc { name: ..., videos: [...] }.
   - "channelUrl" (optionnel) : lien vers la chaîne YouTube du YouTubeur, affiché
     comme un bouton à côté de son nom. Laisse "" pour ne pas afficher de bouton.
   - "youtubeId" = la partie après "v=" dans l'URL YouTube
     (ex: https://www.youtube.com/watch?v=dQw4w9WgXcQ -> dQw4w9WgXcQ)
   - "title" est optionnel : si tu ne le mets pas, il est récupéré automatiquement.
   - "roles" (optionnel) : liste de badges affichés sur la vidéo, ex: ["Script"],
     ["Script", "Montage"]. Valeurs libres, mais on utilise pour l'instant :
     "Script", "Montage", "Réalisation", "Voix".
   - Le nombre de vidéos/chaînes affiché dans la barre de stats en haut du site
     est calculé automatiquement à partir de ce fichier : rien à faire de plus.
   ========================================================================= */

const CATEGORIES = [
  {
    name: "Elerac",
    logo: "assets/logo_elerac.png", // ex: "assets/client1.jpg", ou laisse vide
    channelUrl: "https://www.youtube.com/@el3rac",
    description: "Chaîne qui traite des sujets diverses autour du Cinéma.",
    videos: [
      { youtubeId: "nWR9u9g1OsQ", roles: ["Script", "Montage", "Voix"] },
      { youtubeId: "p6zvw95eTBo", roles: ["Script", "Montage", "Voix"] },
      { youtubeId: "HvpjhyuDdSg", roles: ["Script", "Montage", "Voix"] },
      { youtubeId: "1eA_VEC4spo", roles: ["Script", "Montage", "Voix"] },
      { youtubeId: "xyTDGR3k3Zc", roles: ["Script", "Montage", "Voix"] },
      { youtubeId: "misB7xeNxlM", roles: ["Script", "Montage", "Voix"] },
      { youtubeId: "ZdLU7EIbc58", roles: ["Script", "Montage", "Voix"] },
      { youtubeId: "2VLQOQckLo8", roles: ["Script", "Montage", "Voix"] },
      { youtubeId: "mrGMb5QXioo", roles: ["Script", "Montage", "Voix"] },
      { youtubeId: "cYM8L3ItHag", roles: ["Script", "Montage", "Voix"] },
      { youtubeId: "C0wskLYi8W4", roles: ["Script", "Montage", "Voix"] },
      { youtubeId: "HJZv8-zTFIo", roles: ["Script", "Montage", "Voix"] },
      { youtubeId: "FCN2UhzlPIA", roles: ["Script", "Montage", "Voix"] },
      { youtubeId: "pLkoG6zOPSc", roles: ["Script", "Montage", "Voix"] },
      { youtubeId: "T1smgHE3CX8", roles: ["Script", "Voix"] }, // Quand le Réalisateur Brise Toutes les Règles du Cinéma
      { youtubeId: "SgoGlHJInA4", roles: ["Script", "Montage", "Voix"] },
      { youtubeId: "IlE33cR1PxE", roles: ["Script", "Montage", "Voix"] },
      { youtubeId: "9WtQ8U_S-Fo", roles: ["Script", "Montage", "Voix"] },
      { youtubeId: "2pPk4uyRNkc", roles: ["Script", "Montage", "Voix"] },
      { youtubeId: "sNYw-nnsUTc", roles: ["Script", "Montage", "Voix"] },
      { youtubeId: "8TQ8jsGhOhk", roles: ["Script", "Montage", "Voix"] },
      { youtubeId: "3Wl-L28W-EU", roles: ["Script", "Montage", "Voix"] },
      { youtubeId: "4cQSoqt-cZ0", roles: ["Script", "Montage", "Voix"] },
      { youtubeId: "ePTh_JjTmKU", roles: ["Script", "Montage", "Voix"] },
      { youtubeId: "BUVIaFRxeJg", roles: ["Script", "Montage", "Voix"] },
      { youtubeId: "itTEqweYS0c", roles: ["Script", "Montage", "Voix"] },
      { youtubeId: "IHE28y38mEM", roles: ["Script", "Montage", "Voix"] },
      { youtubeId: "bfk82318RFY", roles: ["Script", "Montage", "Voix"] },
      { youtubeId: "64vZzWZ7xas", roles: ["Script", "Montage", "Voix"] },
      { youtubeId: "_Hf_5in2zIk", roles: ["Script", "Montage", "Voix"] },
    ],
  },
  {
    name: "Kombo",
    logo: "assets/logo_kombo.jpg",
    channelUrl: "https://www.youtube.com/@Kombo000",
    description: "Chaîne storytelling autour du Jeu Vidéo.",
    videos: [
      { youtubeId: "wROFZ0JO0Hk", roles: ["Script"] },
      { youtubeId: "vtQM2e3F7aM", roles: ["Script"] },
    ],
  },
  {
    name: "Aypierre",
    logo: "assets/logo_aypierre.jpg",
    channelUrl: "https://www.youtube.com/@aypierre",
    description: "Chaîne de storytelling autour du Jeu Vidéo/Minecraft.",
    videos: [
      { youtubeId: "2XPQnsglBoU", roles: ["Script"] },
      { youtubeId: "bk8wKpToF_0", roles: ["Script"] },
      { youtubeId: "UYP-SAbl3Hc", roles: ["Script"] },
      { youtubeId: "oLyxhMJyPko", roles: ["Script", "Réalisation"] }, // Ils ont Bâti une Civilisation sur Minecraft
      { youtubeId: "63E9Aj_bxLE", roles: ["Script"] },
      { youtubeId: "3Omyh9krDvo", roles: ["Script"] },
      { youtubeId: "J4Ns8QqZjyU", roles: ["Script"] },
      { youtubeId: "M7zfNSlJTPo", roles: ["Script", "Réalisation", "Voix"] }, // 400 joueurs recréent les châteaux de France
    ],
  },
  {
    name: "Melanchromia",
    logo: "assets/logo_melanchromia.jpg",
    channelUrl: "https://www.youtube.com/@Melanchromia",
    description: "Chaîne qui traite de sujets diverses autour de la peinture.",
    videos: [
      { youtubeId: "o1Py5ZZYgSY", roles: ["Script"] },
    ],
  },
];
