// projects.js
// Handles project form submission, project display, and project detail modal
import { db } from './firebase.js';
import { ref, push, onValue, query, limitToLast } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

document.addEventListener('DOMContentLoaded', function() {
  // Project submission form logic
  const projectForm = document.getElementById('project-form');
  const projectModal2 = document.getElementById('project-modal');
  const projectImagesInput = document.getElementById('project-images');
  const langList = document.getElementById('language-select-list');
  const selectedLangsDiv = document.getElementById('selected-languages');
  const dbList = document.getElementById('database-select-list');
  const selectedDbsDiv = document.getElementById('selected-databases');

  if (projectForm) {
    projectForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(projectForm);
      const title = formData.get('title');
      const description = formData.get('description');
      // Get all checked languages
      const languages = Array.from(document.querySelectorAll('#language-select-list input[type=checkbox]:checked')).map(cb => cb.value);
      // Get all checked databases
      const databases = Array.from(document.querySelectorAll('#database-select-list input[type=checkbox]:checked')).map(cb => cb.value);
      const files = projectImagesInput.files;
      if (title && description && languages.length > 0) {
        // Convert images to base64
        const images = [];
        if (files && files.length > 0) {
          const maxImages = Math.min(files.length, 5);
          for (let i = 0; i < maxImages; i++) {
            const file = files[i];
            const base64 = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            });
            images.push(base64);
          }
        }
        try {
          const projectData = {
            title,
            description,
            languages,
            databases,
            images,
            timestamp: new Date().toISOString()
          };
          await push(ref(db, 'Projects'), projectData);
          alert('Project submitted!');
          projectForm.reset();
          langList.querySelectorAll('input[type=checkbox]').forEach(cb => cb.checked = false);
          selectedLangsDiv.innerHTML = '';
          dbList.querySelectorAll('input[type=checkbox]').forEach(cb => cb.checked = false);
          selectedDbsDiv.innerHTML = '';
          projectModal2.classList.add('hidden');
        } catch (error) {
          alert('There was an error submitting your project. Please try again later.');
        }
      } else {
        alert('Please fill in all fields and select at least one language.');
      }
    });
  }

  // Display submitted projects in Featured Projects (from SecretProjects)
  const projectCardsContainer = document.querySelectorAll('.project-card');
  const secretProjectsRef = query(ref(db, 'SecretProjects'), limitToLast(3));
  onValue(secretProjectsRef, (snapshot) => {
    const data = snapshot.val();
    let projects = [];
    if (data) {
      projects = Object.values(data).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
    projectCardsContainer.forEach((card, idx) => {
      card.innerHTML = '';
      card.style.cursor = 'pointer';
      if (projects[idx]) {
        let imgTag = '';
        if (projects[idx].images && projects[idx].images.length > 0) {
          imgTag = `<div class='w-full h-48 mb-4 rounded overflow-hidden flex items-center justify-center'><img src='${projects[idx].images[0]}' alt='Project Image' class='w-full h-full object-cover'/></div>`;
        }
        let langs = '';
        if (projects[idx].languages && Array.isArray(projects[idx].languages)) {
          langs = `<div class='flex flex-wrap gap-2 mb-2'>` + projects[idx].languages.map(lang => {
            let color = 'bg-gray-300';
            if (lang === 'JavaScript') color = 'bg-blue-200';
            if (lang === 'Python') color = 'bg-yellow-200';
            if (lang === 'Java') color = 'bg-green-200';
            if (lang === 'C#') color = 'bg-red-200';
            if (lang === 'PHP') color = 'bg-purple-200';
            if (lang === 'TypeScript') color = 'bg-pink-200';
            if (lang === 'HTML') color = 'bg-orange-200';
            if (lang === 'Other') color = 'bg-gray-300';
            return `<span class='${color} text-xs px-2 py-1 rounded-full text-black font-semibold'>${lang}</span>`;
          }).join('') + `</div>`;
        }
        card.innerHTML = `
          <div class='p-6'>
            ${imgTag}
            <h4 class='text-xl font-bold text-primary dark:text-yellow-300 mb-2'>${projects[idx].title}</h4>
            <p class='text-gray-700 dark:text-gray-200 mb-2'>${projects[idx].description}</p>
            ${langs}
          </div>
        `;
        card.onclick = () => {
          renderProjectDetails(projects[idx]);
          projectDetailModal.classList.remove('hidden');
        };
      } else {
        card.onclick = null;
      }
    });
  });

  // Project detail modal logic
  let currentProject = null;
  const projectDetailModal = document.createElement('div');
  projectDetailModal.id = 'project-detail-modal';
  projectDetailModal.className = 'fixed inset-0 bg-black/40 flex items-center justify-center z-50 hidden';
  projectDetailModal.innerHTML = `
    <div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
      <button id="close-project-detail-modal" class="absolute top-2 right-2 text-gray-500 hover:text-primary text-2xl">&times;</button>
      <div id="project-detail-content"></div>
    </div>
  `;
  document.body.appendChild(projectDetailModal);
  const closeProjectDetailModal = projectDetailModal.querySelector('#close-project-detail-modal');
  closeProjectDetailModal.addEventListener('click', () => {
    projectDetailModal.classList.add('hidden');
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') projectDetailModal.classList.add('hidden');
  });
  function renderProjectDetails(project) {
    let imagesHtml = '';
    if (project.images && project.images.length > 0) {
      imagesHtml = `<div class='flex gap-4 mb-4 overflow-x-auto'>` + project.images.map(img => `<img src='${img}' class='w-48 h-48 object-cover rounded'/>`).join('') + `</div>`;
    }
    let langs = '';
    if (project.languages && Array.isArray(project.languages)) {
      langs = `<div class='flex flex-wrap gap-2 mb-2'>` + project.languages.map(lang => {
        let color = 'bg-gray-300';
        if (lang === 'JavaScript') color = 'bg-blue-200';
        if (lang === 'Python') color = 'bg-yellow-200';
        if (lang === 'Java') color = 'bg-green-200';
        if (lang === 'C#') color = 'bg-red-200';
        if (lang === 'PHP') color = 'bg-purple-200';
        if (lang === 'TypeScript') color = 'bg-pink-200';
        if (lang === 'HTML') color = 'bg-orange-200';
        if (lang === 'Other') color = 'bg-gray-300';
        return `<span class='${color} text-xs px-2 py-1 rounded-full text-black font-semibold'>${lang}</span>`;
      }).join('') + `</div>`;
    }
    let dbs = '';
    if (project.databases && Array.isArray(project.databases)) {
      dbs = `<div class='flex flex-wrap gap-2 mb-2'>` + project.databases.map(db => {
        let color = 'bg-gray-300';
        if (db === 'MySQL') color = 'bg-blue-300';
        if (db === 'PostgreSQL') color = 'bg-green-300';
        if (db === 'Firebase') color = 'bg-yellow-300';
        if (db === 'MongoDB') color = 'bg-red-300';
        if (db === 'SQLite') color = 'bg-purple-300';
        if (db === 'Other') color = 'bg-pink-300';
        return `<span class='${color} text-xs px-2 py-1 rounded-full text-black font-semibold'>${db}</span>`;
      }).join('') + `</div>`;
    }
    // Add project link display
    let linkHtml = '';
    let projectLink = project.links || project.link || '';
    if (projectLink && projectLink !== 'no link provided') {
      linkHtml = `<div class='mb-2'><a href='${projectLink}' target='_blank' rel='noopener' class='text-primary underline break-all dark:text-yellow-300'>${projectLink}</a></div>`;
    } else {
      linkHtml = `<div class='mb-2 text-gray-400 text-sm'>No link provided</div>`;
    }
    document.getElementById('project-detail-content').innerHTML = `
      <h2 class='text-2xl font-bold text-primary dark:text-yellow-300 mb-2'>${project.title}</h2>
      ${imagesHtml}
      ${linkHtml}
      <p class='text-gray-700 dark:text-gray-200 mb-2'>${project.description}</p>
      ${langs}
      ${dbs}
      <div class='text-xs text-gray-400 mb-1'>Submitted: ${project.timestamp ? new Date(project.timestamp).toLocaleString() : ''}</div>
    `;
  }
});
