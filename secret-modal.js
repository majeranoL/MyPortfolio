// secret-modal.js
// Handles secret button, secret modal, and secret project submission
import { db } from './firebase.js';
import { ref, push } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

document.addEventListener('DOMContentLoaded', function() {
  let secretModal = document.getElementById('secret-modal');
  if (!secretModal) {
    secretModal = document.createElement('div');
    secretModal.id = 'secret-modal';
    secretModal.className = 'fixed inset-0 bg-black/40 flex items-center justify-center z-50 hidden';
    secretModal.innerHTML = `
      <div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-md relative">
        <button id="close-secret-modal" class="absolute top-2 right-2 text-gray-500 hover:text-primary text-2xl">&times;</button>
        <h3 class="text-2xl font-bold mb-6 text-primary dark:text-yellow-300 text-center">Secret Project Submission</h3>
        <form id="secret-project-form" class="space-y-4">
          <div>
            <label for="secret-title" class="block font-semibold mb-1 text-gray-700 dark:text-gray-200">Project Title</label>
            <input type="text" id="secret-title" name="title" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white">
          </div>
          <div>
            <label for="secret-description" class="block font-semibold mb-1 text-gray-700 dark:text-gray-200">Description</label>
            <textarea id="secret-description" name="description" rows="3" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"></textarea>
          </div>
          <div>
            <label for="secret-links" class="block font-semibold mb-1 text-gray-700 dark:text-gray-200">Project Link (optional)</label>
            <input type="url" id="secret-links" name="links" placeholder="https://yourproject.com" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white">
          </div>
          <div>
            <label for="secret-images" class="block font-semibold mb-1 text-gray-700 dark:text-gray-200">Project Images (up to 5)</label>
            <input type="file" id="secret-images" name="images" accept="image/*" multiple class="w-full px-2 py-1 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white">
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">You can select up to 5 images. The first image will be featured.</p>
          </div>
          <div>
            <label class="block font-semibold mb-1 text-gray-700 dark:text-gray-200">Languages Used</label>
            <button type="button" id="show-secret-language-select" class="bg-primary text-white px-3 py-1 rounded mb-2">Select Languages</button>
            <div id="secret-language-select-list" class="flex flex-wrap gap-2 mb-2 hidden">
              <label class="flex items-center bg-blue-200 px-2 py-1 rounded-full cursor-pointer">
                <input type="checkbox" name="languages" value="JavaScript" class="mr-1"> JavaScript
              </label>
              <label class="flex items-center bg-yellow-200 px-2 py-1 rounded-full cursor-pointer">
                <input type="checkbox" name="languages" value="Python" class="mr-1"> Python
              </label>
              <label class="flex items-center bg-green-200 px-2 py-1 rounded-full cursor-pointer">
                <input type="checkbox" name="languages" value="Java" class="mr-1"> Java
              </label>
              <label class="flex items-center bg-red-200 px-2 py-1 rounded-full cursor-pointer">
                <input type="checkbox" name="languages" value="C#" class="mr-1"> C#
              </label>
              <label class="flex items-center bg-purple-200 px-2 py-1 rounded-full cursor-pointer">
                <input type="checkbox" name="languages" value="PHP" class="mr-1"> PHP
              </label>
              <label class="flex items-center bg-pink-200 px-2 py-1 rounded-full cursor-pointer">
                <input type="checkbox" name="languages" value="TypeScript" class="mr-1"> TypeScript
              </label>
              <label class="flex items-center bg-orange-200 px-2 py-1 rounded-full cursor-pointer">
                <input type="checkbox" name="languages" value="HTML" class="mr-1"> HTML
              </label>
              <label class="flex items-center bg-gray-300 px-2 py-1 rounded-full cursor-pointer">
                <input type="checkbox" name="languages" value="Other" class="mr-1"> Other
              </label>
            </div>
            <div id="secret-selected-languages" class="flex flex-wrap gap-2"></div>
          </div>
          <button type="submit" class="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary/90 transition duration-300">Submit Project</button>
        </form>
      </div>
    `;
    document.body.appendChild(secretModal);
  }
  const secretBtn = document.getElementById('hidden-navbar-btn');
  secretBtn.addEventListener('click', () => {
    secretModal.classList.remove('hidden');
  });
  // Close modal logic
  function closeSecretModal() {
    secretModal.classList.add('hidden');
  }
  document.addEventListener('click', function(e) {
    if (e.target.id === 'close-secret-modal' || e.target.id === 'close-secret-modal-btn') {
      closeSecretModal();
    }
  });
  window.addEventListener('keydown', function(e) {
    if (!secretModal.classList.contains('hidden') && e.key === 'Escape') closeSecretModal();
  });
  // Secret language select logic
  const showSecretLangBtn = document.getElementById('show-secret-language-select');
  const secretLangList = document.getElementById('secret-language-select-list');
  const secretSelectedLangsDiv = document.getElementById('secret-selected-languages');
  if (showSecretLangBtn && secretLangList) {
    showSecretLangBtn.addEventListener('click', () => {
      secretLangList.classList.toggle('hidden');
    });
    secretLangList.querySelectorAll('input[type=checkbox]').forEach(cb => {
      cb.addEventListener('change', () => {
        const checked = Array.from(secretLangList.querySelectorAll('input[type=checkbox]:checked'));
        secretSelectedLangsDiv.innerHTML = checked.map(cb => {
          let color = 'bg-gray-300';
          if (cb.value === 'JavaScript') color = 'bg-blue-200';
          if (cb.value === 'Python') color = 'bg-yellow-200';
          if (cb.value === 'Java') color = 'bg-green-200';
          if (cb.value === 'C#') color = 'bg-red-200';
          if (cb.value === 'PHP') color = 'bg-purple-200';
          if (cb.value === 'TypeScript') color = 'bg-pink-200';
          if (cb.value === 'HTML') color = 'bg-orange-200';
          if (cb.value === 'Other') color = 'bg-gray-300';
          return `<span class='${color} text-xs px-2 py-1 rounded-full text-black font-semibold'>${cb.value}</span>`;
        }).join('');
      });
    });
  }
  // Secret project form submission logic
  const secretProjectForm = document.getElementById('secret-project-form');
  const secretImagesInput = document.getElementById('secret-images');
  // --- Fix: Maintain a persistent array of selected images (base64) ---
  let selectedSecretImages = [];

  // Add a preview/count display for selected images
  let secretImagesPreview = document.getElementById('secret-images-preview');
  if (!secretImagesPreview) {
    secretImagesPreview = document.createElement('div');
    secretImagesPreview.id = 'secret-images-preview';
    secretImagesPreview.className = 'flex flex-wrap gap-2 mt-2';
    secretImagesInput.parentNode.appendChild(secretImagesPreview);
  }

  function updateSecretImagesPreview() {
    secretImagesPreview.innerHTML = '';
    if (selectedSecretImages.length === 0) {
      secretImagesPreview.innerHTML = "<span class='text-xs text-gray-500 dark:text-gray-400'>No images selected.</span>";
    } else {
      selectedSecretImages.forEach((img, idx) => {
        secretImagesPreview.innerHTML += `<div class='relative'><img src='${img}' class='w-16 h-16 object-cover rounded border border-gray-300 dark:border-gray-700'/><button type='button' data-idx='${idx}' class='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs' title='Remove'>&times;</button></div>`;
      });
    }
  }

  // Listen for file input changes and append new images (up to 5)
  secretImagesInput.addEventListener('change', async (e) => {
    const files = Array.from(secretImagesInput.files);
    for (let i = 0; i < files.length && selectedSecretImages.length < 5; i++) {
      const file = files[i];
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      selectedSecretImages.push(base64);
    }
    if (selectedSecretImages.length > 5) selectedSecretImages = selectedSecretImages.slice(0, 5);
    secretImagesInput.value = '';
    updateSecretImagesPreview();
  });

  // Remove image on preview click
  secretImagesPreview.addEventListener('click', function(e) {
    if (e.target.tagName === 'BUTTON' && e.target.dataset.idx !== undefined) {
      const idx = parseInt(e.target.dataset.idx);
      selectedSecretImages.splice(idx, 1);
      updateSecretImagesPreview();
    }
  });

  // Initial preview
  updateSecretImagesPreview();

  if (secretProjectForm) {
    secretProjectForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(secretProjectForm);
      const title = formData.get('title');
      const description = formData.get('description');
      const links = formData.get('links')?.trim() || '';
      const languages = Array.from(secretLangList.querySelectorAll('input[type=checkbox]:checked')).map(cb => cb.value);
      if (title && description && languages.length > 0 && selectedSecretImages.length > 0) {
        try {
          const projectData = {
            title,
            description,
            links: links !== '' ? links : 'no link provided',
            languages,
            images: selectedSecretImages,
            timestamp: new Date().toISOString(),
            secret: true
          };
          await push(ref(db, 'SecretProjects'), projectData);
          alert('Secret project submitted!');
          secretProjectForm.reset();
          secretLangList.querySelectorAll('input[type=checkbox]').forEach(cb => cb.checked = false);
          secretSelectedLangsDiv.innerHTML = '';
          selectedSecretImages = [];
          updateSecretImagesPreview();
          closeSecretModal();
        } catch (error) {
          alert('There was an error submitting your secret project. Please try again later.');
        }
      } else {
        alert('Please fill in all fields, select at least one language, and upload at least one image.');
      }
    });
  }
});
