// src/utils/pdfGenerator/rdd.js

export const generateRddPDF = async (doc, character) => {
  // Configuration de la police
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);

  // --- PAGE 1 ---
  doc.setFontSize(16);
  doc.text("Fiche de Personnage : Rêve de Dragon", 20, 20);

  doc.setFontSize(12);
  doc.text(`Nom du Voyageur : ${character.name || 'Inconnu'}`, 20, 35);
  doc.text(`Niveau : ${character.level || 1}`, 20, 45);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("L'intégration complète des coordonnées pour la fiche Rêve de Dragon est en cours...", 20, 60);
  doc.text("Dès que l'image 'sheet_rdd.jpg' sera ajoutée au dossier /public, vous pourrez", 20, 66);
  doc.text("définir le placement millimétré des Caractéristiques (Rêve, Chance, etc.).", 20, 72);

  // Exemple d'ajout d'image future :
  // const imgPage1 = await loadImage('/sheet_rdd_page1.jpg');
  // doc.addImage(imgPage1, 'JPEG', 0, 0, 210, 297);
};