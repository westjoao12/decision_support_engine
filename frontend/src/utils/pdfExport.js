import jsPDF from 'jspdf';

/**
 * Gera um ficheiro PDF formatado com qualidade Enterprise para o Parecer de Governança.
 * @param {Object} projectData - Os dados originais do projeto.
 * @param {Object} finalDecision - A decisão editada e assinada pelo analista.
 */
export const exportDecisionToPDF = (projectData, finalDecision) => {
  // Cria um documento A4 padrão
  const doc = new jsPDF('p', 'mm', 'a4');
  
  // 1. CABEÇALHO INSTITUCIONAL (Vermelho BNB)
  doc.setFillColor(184, 0, 50); // Cor Hex: #B80032
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("PARECER DE GOVERNANÇA", 105, 20, { align: "center" });
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Motor Determinístico de Apoio à Decisão - Lei do Bem", 105, 30, { align: "center" });

  // 2. METADADOS DO PROJETO
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`Projeto de Referência: ${projectData.projeto_id}`, 20, 55);
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  // splitTextToSize garante que o texto não ultrapasse a margem direita da folha
  const splitTitulo = doc.splitTextToSize(`Título: ${projectData.titulo}`, 170);
  doc.text(splitTitulo, 20, 63);

  // Linha separadora
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 72, 190, 72);

  // 3. O VEREDITO (CLASSIFICAÇÃO)
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Classificação Final:", 20, 85);
  
  doc.setFont("helvetica", "normal");
  // Destaca a classificação final com uma cor baseada no resultado
  if (finalDecision.classificacao === "Elegível") {
    doc.setTextColor(0, 128, 0); // Verde
  } else if (finalDecision.classificacao === "Não elegível") {
    doc.setTextColor(184, 0, 50); // Vermelho
  } else {
    doc.setTextColor(255, 132, 0); // Laranja BNB
  }
  doc.text(finalDecision.classificacao.toUpperCase(), 65, 85);
  doc.setTextColor(30, 30, 30); // Volta ao texto escuro padrão

  // 4. JUSTIFICATIVA TÉCNICA
  doc.setFont("helvetica", "bold");
  doc.text("Justificativa Técnica:", 20, 100);
  doc.setFont("helvetica", "normal");
  const splitJustificativa = doc.splitTextToSize(finalDecision.justificativa, 170);
  doc.text(splitJustificativa, 20, 108);

  // Calcula a posição Y dinamicamente com base no tamanho do texto anterior
  let currentY = 108 + (splitJustificativa.length * 6) + 10;

  // 5. LIMITES E RESSALVAS
  doc.setFont("helvetica", "bold");
  doc.text("Limites e Ressalvas:", 20, currentY);
  doc.setFont("helvetica", "normal");
  const limiteText = finalDecision.limite && finalDecision.limite.trim() !== "" 
    ? finalDecision.limite 
    : "Não se aplica.";
  const splitLimites = doc.splitTextToSize(limiteText, 170);
  doc.text(splitLimites, 20, currentY + 8);

  currentY = currentY + 8 + (splitLimites.length * 6) + 10;

  // 6. FONTES DECISIVAS (RASTREABILIDADE)
  doc.setFont("helvetica", "bold");
  doc.text("Rastreabilidade (Fontes Decisivas):", 20, currentY);
  doc.setFont("helvetica", "normal");
  // Usa uma fonte monoespaçada para simular o aspeto de sistema/código
  doc.setFont("courier", "normal");
  const splitFontes = doc.splitTextToSize(finalDecision.fontes_decisivas, 170);
  doc.text(splitFontes, 20, currentY + 8);

  // 7. RODAPÉ E ASSINATURA (Obriga o elemento de "Humano-in-the-loop")
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  // Linha de assinatura no final da folha
  doc.line(60, 250, 150, 250);
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Assinatura do Analista Responsável", 105, 256, { align: "center" });
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  
  // Registo temporal para auditoria
  const dataHoraAtual = new Date().toLocaleString('pt-BR');
  doc.text(`Documento gerado e imutabilizado pelo sistema em: ${dataHoraAtual}`, 105, 275, { align: "center" });
  doc.text("Banco do Nordeste - Uso Interno Restrito", 105, 280, { align: "center" });

  // 8. DISPARO DO DOWNLOAD
  const fileName = `Parecer_Auditoria_${projectData.projeto_id}.pdf`;
  doc.save(fileName);
};