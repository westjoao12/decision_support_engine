import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // <-- IMPORTAÇÃO CORRIGIDA PARA O VITE

/**
 * Gera um Dossiê PDF estruturado nos moldes do Manual de Frascati.
 */
export const exportDecisionToPDF = (projectData, finalDecision) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  let currentY = 15;

  // --- CABEÇALHO ---
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  doc.text("Motor de Governança Lei do Bem (Lei nº 11.196/2005)", 14, currentY);
  
  currentY += 7;
  doc.setFontSize(14);
  doc.setTextColor(184, 0, 50); // Vermelho BNB
  doc.text("Parecer técnico de enquadramento", 14, currentY);

  currentY += 6;
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(100, 100, 100);
  doc.text("Dados simulados (modo demonstração). Este documento não tem valor legal.", 14, currentY);

  currentY += 12;

  // --- SEÇÃO 1: IDENTIFICAÇÃO ---
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(184, 0, 50);
  doc.text("1. Identificação", 14, currentY);
  currentY += 6;

  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);
  doc.setFont("helvetica", "normal");
  const dataAtual = new Date().toLocaleString('pt-BR');
  const hashId = `demo-${Math.random().toString(36).substring(2, 10)}`;

  doc.text(`Projeto: ${projectData.projeto_id} - ${projectData.titulo || "Dados simulados"}`, 14, currentY);
  currentY += 5;
  doc.text(`Análise do motor: ${dataAtual} | Versão 1 de 1`, 14, currentY);
  currentY += 5;
  doc.text(`Identificador da análise: ${hashId}`, 14, currentY);

  currentY += 12;

  // --- SEÇÃO 2: RECOMENDAÇÃO DO MOTOR VS DECISÃO HUMANA ---
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(184, 0, 50);
  doc.text("2. Decisão do Analista (com apoio do Motor)", 14, currentY);
  currentY += 6;

  // Recomendação Original da IA
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.setFont("helvetica", "bold");
  doc.text(`Recomendação preliminar da IA: ${projectData.classificacao}`, 14, currentY);
  
  // Decisão Final do Humano
  currentY += 6;
  doc.setTextColor(30, 30, 30);
  doc.text("Classificação Final (Humano):", 14, currentY);
  
  if (finalDecision.classificacao === "Elegível") {
    doc.setTextColor(0, 128, 0); // Verde
  } else if (finalDecision.classificacao === "Não elegível") {
    doc.setTextColor(184, 0, 50); // Vermelho
  } else {
    doc.setTextColor(255, 132, 0); // Laranja
  }
  doc.text(finalDecision.classificacao.toUpperCase(), 70, currentY);

  currentY += 6;
  doc.setTextColor(30, 30, 30);
  doc.setFont("helvetica", "normal");
  const splitJustificativa = doc.splitTextToSize(`Justificativa: ${finalDecision.justificativa}`, 180);
  doc.text(splitJustificativa, 14, currentY);
  currentY += (splitJustificativa.length * 5) + 6;

  if (finalDecision.limite) {
    const splitLimite = doc.splitTextToSize(`Ressalvas: ${finalDecision.limite}`, 180);
    doc.text(splitLimite, 14, currentY);
    currentY += (splitLimite.length * 5) + 8;
  }

  // --- SEÇÃO 3: CRITÉRIOS DO MANUAL DE FRASCATI (TABELA) ---
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(184, 0, 50);
  doc.text("3. Critérios do Manual de Frascati", 14, currentY);
  currentY += 4;

  const isAprovado = finalDecision.classificacao === "Elegível";
  const tableData = [
    ["Novidade", isAprovado ? "Demonstrada" : "Não demonstrada", isAprovado ? "Avanço no estado da arte comprovado nos ensaios." : "Solução equivalente a prática de mercado citada no dossiê."],
    ["Criatividade", isAprovado ? "Demonstrada" : "Não demonstrada", isAprovado ? "Abordagem metodológica não óbvia aplicada." : "Não há escolha técnica além da configuração padrão."],
    ["Incerteza", isAprovado ? "Caracterizada" : "Não caracterizada", isAprovado ? "Desafios técnicos resolvidos durante as medições." : "Nenhum ensaio registra resultado inesperado."],
    ["Sistematicidade", "Documentada", "Os registros descrevem os testes no arquivo atividades.xlsx."],
    ["Transferibilidade", "Documentada", "Instalação replicável conforme evidências técnicas."]
  ];

  // <-- USO CORRIGIDO DA FUNÇÃO AUTOTABLE -->
  autoTable(doc, {
    startY: currentY,
    head: [['Critério', 'Estado', 'Justificativa e fonte']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [184, 0, 50], textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 35, fontStyle: 'bold' },
      1: { cellWidth: 35 },
      2: { cellWidth: 'auto' }
    },
    styles: { fontSize: 9, cellPadding: 3 }
  });

  currentY = doc.lastAutoTable.finalY + 12;

  // --- SEÇÃO 4: EVIDÊNCIAS ---
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(184, 0, 50);
  doc.text("4. Evidências que sustentam a decisão", 14, currentY);
  currentY += 6;

  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);
  doc.setFont("courier", "normal");
  const splitFontes = doc.splitTextToSize(finalDecision.fontes_decisivas || "Nenhuma fonte explicitamente mapeada.", 180);
  doc.text(splitFontes, 14, currentY);
  currentY += (splitFontes.length * 5) + 20;

  // --- SEÇÃO 5: ASSINATURA E COMPLIANCE ---
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(184, 0, 50);
  doc.text("5. Decisão do analista", 14, currentY);
  currentY += 15;

  doc.setDrawColor(0, 0, 0);
  doc.line(14, currentY, 100, currentY);
  currentY += 5;
  
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);
  doc.text("Assinatura do Analista Responsável", 14, currentY);
  currentY += 5;
  doc.text("Banco do Nordeste do Brasil", 14, currentY);
  currentY += 5;
  
  // Tratamento seguro para a data
  const dataLocal = dataAtual.split(',')[0] || dataAtual;
  doc.text(`Local e data: Ceará, ${dataLocal}`, 14, currentY);

  currentY += 15;
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(100, 100, 100);
  doc.text(`A IA só recomenda. A classificação final é a decisão do analista. Documento gerado em ${dataAtual}.`, 14, currentY);

  // <-- DOWNLOAD -->
  doc.save(`Parecer_Enquadramento_${projectData.projeto_id}.pdf`);
};