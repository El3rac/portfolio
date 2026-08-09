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
    { label: "Email", url: "elerac.pro@gmail.com" },
    { label: "YouTube", url: "https://www.youtube.com/@el3rac" },
    { label: "Instagram", url: "https://www.instagram.com/elerac_yt" },
  ],

  footerText: "Disponible pour de nouveaux projets - Contactez-moi !",

  // OPTIONNEL : colle ici une clé API YouTube Data v3 (gratuite) pour afficher
  // le nombre de vues à jour sous chaque vidéo. Laisse "" pour ne pas l'utiliser
  // (le site fonctionne très bien sans). Voir le README pour l'obtenir gratuitement.
  youtubeApiKey: "AIzaSyDBZe2_4TEey6MV5L2ENQ-aPkFQm40MbDw",
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
   ========================================================================= */

const CATEGORIES = [
  {
    name: "Elerac",
    logo: "assets/logo_elerac.png", // ex: "assets/client1.jpg", ou laisse vide
    channelUrl: "https://www.youtube.com/@el3rac",
    description: "Chaîne qui traite des sujets diverses autour du Cinéma.",
    videos: [
      { youtubeId: "nWR9u9g1OsQ" },
      { youtubeId: "p6zvw95eTBo" },
      { youtubeId: "HvpjhyuDdSg" },
      { youtubeId: "1eA_VEC4spo" },
      { youtubeId: "xyTDGR3k3Zc" },
      { youtubeId: "misB7xeNxlM" },
      { youtubeId: "ZdLU7EIbc58" },
      { youtubeId: "2VLQOQckLo8" },
      { youtubeId: "mrGMb5QXioo" },
      { youtubeId: "cYM8L3ItHag" },
      { youtubeId: "C0wskLYi8W4" },
      { youtubeId: "HJZv8-zTFIo" },
      { youtubeId: "FCN2UhzlPIA" },
      { youtubeId: "pLkoG6zOPSc" },
      { youtubeId: "T1smgHE3CX8" },
      { youtubeId: "SgoGlHJInA4" },
      { youtubeId: "IlE33cR1PxE" },
      { youtubeId: "9WtQ8U_S-Fo" },
      { youtubeId: "2pPk4uyRNkc" },
      { youtubeId: "sNYw-nnsUTc" },
      { youtubeId: "8TQ8jsGhOhk" },
      { youtubeId: "3Wl-L28W-EU" },
      { youtubeId: "4cQSoqt-cZ0" },
      { youtubeId: "ePTh_JjTmKU" },
      { youtubeId: "BUVIaFRxeJg" },
      { youtubeId: "itTEqweYS0c" },
      { youtubeId: "IHE28y38mEM" },
      { youtubeId: "bfk82318RFY" },
      { youtubeId: "64vZzWZ7xas" },
      { youtubeId: "_Hf_5in2zIk" },
    ],
  },
  {
    name: "Kombo",
    logo: "assets/logo_kombo.jpg",
    channelUrl: "https://www.youtube.com/@Kombo000",
    description: "Chaîne sur laquelle j'ai travaillé.",
    videos: [
      { youtubeId: "wROFZ0JO0Hk" },
      { youtubeId: "vtQM2e3F7aM" },
    ],
  },
  {
    name: "Aypierre",
    logo: "assets/logo_aypierre.jpg",
    channelUrl: "https://www.youtube.com/@aypierre",
    description: "Chaîne sur laquelle j'ai travaillé.",
    videos: [
      { youtubeId: "2XPQnsglBoU" },
      { youtubeId: "bk8wKpToF_0" },
      { youtubeId: "UYP-SAbl3Hc" },
      { youtubeId: "oLyxhMJyPko" },
      { youtubeId: "63E9Aj_bxLE" },
      { youtubeId: "3Omyh9krDvo" },
      { youtubeId: "J4Ns8QqZjyU" },
      { youtubeId: "M7zfNSlJTPo" },
    ],
  },
  {
    name: "Melanchromia",
    logo: "assets/logo_melanchromia.jpg",
    channelUrl: "https://www.youtube.com/@Melanchromia",
    description: "Chaîne sur laquelle j'ai travaillé.",
    videos: [
      { youtubeId: "o1Py5ZZYgSY" },
    ],
  },
];
