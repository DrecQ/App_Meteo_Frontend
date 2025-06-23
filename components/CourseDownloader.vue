<template>
  <div class="course-downloader">
    <button 
      @click="showDownloadModal = true"
      class="download-btn"
      :disabled="loading"
    >
      <i class="fas fa-download"></i>
      {{ loading ? 'Génération...' : 'Télécharger le cours' }}
    </button>

    <!-- Modal de téléchargement -->
    <Teleport to="body">
      <div v-if="showDownloadModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Télécharger le cours</h3>
            <button @click="closeModal" class="close-btn">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="modal-body">
            <div class="format-selection">
              <h4>Choisir le format :</h4>
              <div class="format-options">
                <label class="format-option">
                  <input 
                    type="radio" 
                    v-model="selectedFormat" 
                    value="pdf"
                    name="format"
                  >
                  <div class="format-card">
                    <i class="fas fa-file-pdf"></i>
                    <span>PDF</span>
                    <small>Document portable</small>
                  </div>
                </label>
                
                <label class="format-option">
                  <input 
                    type="radio" 
                    v-model="selectedFormat" 
                    value="txt"
                    name="format"
                  >
                  <div class="format-card">
                    <i class="fas fa-file-alt"></i>
                    <span>Texte</span>
                    <small>Document simple</small>
                  </div>
                </label>
              </div>
            </div>

            <div class="course-info">
              <h4>Informations du cours :</h4>
              <div class="info-grid">
                <div class="info-item">
                  <strong>Titre :</strong>
                  <span>{{ course.title }}</span>
                </div>
                <div class="info-item">
                  <strong>Instructeur :</strong>
                  <span>{{ course.instructor || 'Agence de Météo' }}</span>
                </div>
                <div class="info-item">
                  <strong>Durée :</strong>
                  <span>{{ course.duration || 'Non spécifiée' }}</span>
                </div>
                <div class="info-item">
                  <strong>Leçons :</strong>
                  <span>{{ course.lessons?.length || 0 }} leçons</span>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button @click="closeModal" class="btn-secondary">
              Annuler
            </button>
            <button 
              @click="downloadCourse" 
              class="btn-primary"
              :disabled="loading || !selectedFormat"
            >
              <i v-if="loading" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-download"></i>
              {{ loading ? 'Génération...' : 'Télécharger' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  course: {
    type: Object,
    required: true
  }
})

const showDownloadModal = ref(false)
const selectedFormat = ref('pdf')
const loading = ref(false)

const closeModal = () => {
  showDownloadModal.value = false
  selectedFormat.value = 'pdf'
}

const generateHtmlForCourse = (course) => {
  let html = `<h1>${course.title}</h1>`
  if (course.instructor) {
    html += `<p><strong>Instructeur:</strong> ${course.instructor}</p>`
  }
  if (course.duration) {
    html += `<p><strong>Durée:</strong> ${course.duration}</p>`
  }
  html += '<hr>'

  if (course.lessons && course.lessons.length > 0) {
    course.lessons.forEach((lesson, index) => {
      html += `<h2>Leçon ${index + 1}: ${lesson.title}</h2>`
      if (lesson.content) {
        html += `<div>${lesson.content}</div>`
      }
      html += '<br>'
    })
  } else {
    html += '<p>Ce cours ne contient pas de leçons.</p>'
  }
  return html
}

const generateTextForCourse = (course) => {
  let text = `${course.title}\n\n`
  if (course.instructor) {
    text += `Instructeur: ${course.instructor}\n`
  }
  if (course.duration) {
    text += `Durée: ${course.duration}\n`
  }
  text += '====================================\n\n'

  if (course.lessons && course.lessons.length > 0) {
    course.lessons.forEach((lesson, index) => {
      text += `Leçon ${index + 1}: ${lesson.title}\n\n`
      if (lesson.content) {
        const lessonContent = lesson.content.replace(/<[^>]*>/g, '\n').replace(/\n\s*\n/g, '\n').trim()
        text += `${lessonContent}\n\n`
      }
      text += '------------------------------------\n\n'
    })
  } else {
    text += 'Ce cours ne contient pas de leçons.\n'
  }
  return text
}

const downloadCourse = async () => {
  if (!selectedFormat.value) return

  loading.value = true

  try {
    const courseTitle = props.course.title
    if (selectedFormat.value === 'pdf') {
      const htmlContent = generateHtmlForCourse(props.course)
      await generatePDF(htmlContent, courseTitle)
    } else if (selectedFormat.value === 'txt') {
      const textContent = generateTextForCourse(props.course)
      generateTextFile(textContent, courseTitle)
    }

    closeModal()
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error)
    alert('Erreur lors de la génération du document. Veuillez réessayer.')
  } finally {
    loading.value = false
  }
}

const generateTextFile = (textContent, courseTitle) => {
  try {
    if (process.server) {
      throw new Error('Génération de fichier texte non disponible côté serveur');
    }

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fileName = `${courseTitle.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erreur lors de la génération du fichier texte:', error);
    throw error;
  }
}

const generatePDF = async (htmlContent, courseTitle) => {
  try {
    // Vérifier que nous sommes côté client
    if (process.server) {
      throw new Error('Génération PDF non disponible côté serveur')
    }

    // Importer jsPDF et html2canvas dynamiquement côté client
    const [jsPDF, html2canvas] = await Promise.all([
      import('jspdf'),
      import('html2canvas')
    ])

    // Créer un élément temporaire pour le contenu HTML
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = htmlContent
    tempDiv.style.position = 'absolute'
    tempDiv.style.left = '-9999px'
    tempDiv.style.top = '0'
    tempDiv.style.width = '800px'
    document.body.appendChild(tempDiv)

    // Convertir en canvas
    const canvas = await html2canvas.default(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      width: 800,
      height: tempDiv.scrollHeight
    })

    // Nettoyer l'élément temporaire
    document.body.removeChild(tempDiv)

    // Créer le PDF
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF.default('p', 'mm', 'a4')
    
    const imgWidth = 210
    const pageHeight = 295
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    // Télécharger le PDF
    const fileName = `${courseTitle.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
    pdf.save(fileName)

  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error)
    throw error
  }
}
</script>

<style scoped>
.course-downloader {
  display: inline-block;
}

.download-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #4e6bff 0%, #3a56d4 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.download-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(78, 107, 255, 0.3);
}

.download-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  color: #1f2937;
  font-size: 1.25rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0.25rem;
  border-radius: 4px;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #374151;
}

.modal-body {
  padding: 1.5rem;
}

.format-selection h4,
.course-info h4 {
  margin: 0 0 1rem 0;
  color: #374151;
  font-size: 1rem;
}

.format-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

.format-option {
  cursor: pointer;
}

.format-option input[type="radio"] {
  display: none;
}

.format-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.3s ease;
  text-align: center;
}

.format-card i {
  font-size: 2rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.format-card span {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
}

.format-card small {
  color: #6b7280;
  font-size: 0.875rem;
}

.format-option input[type="radio"]:checked + .format-card {
  border-color: #4e6bff;
  background: #f0f4ff;
}

.format-option input[type="radio"]:checked + .format-card i {
  color: #4e6bff;
}

.info-grid {
  display: grid;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 6px;
}

.info-item strong {
  color: #374151;
}

.info-item span {
  color: #6b7280;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  justify-content: flex-end;
}

.btn-secondary,
.btn-primary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-primary {
  background: linear-gradient(135deg, #4e6bff 0%, #3a56d4 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(78, 107, 255, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .format-options {
    grid-template-columns: 1fr;
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .btn-secondary,
  .btn-primary {
    width: 100%;
    justify-content: center;
  }
}
</style> 