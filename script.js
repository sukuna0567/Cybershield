// Gestion du formulaire d'importation
document.getElementById('upload-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (response.ok) {
            document.getElementById('upload-response').innerHTML = `
                <p>Fichier importé avec succès !</p>
            `;
            loadPublicFiles(); // Recharge les fichiers publics
        } else {
            document.getElementById('upload-response').innerHTML = `<p>Erreur : ${result.message}</p>`;
        }
    } catch (error) {
        console.error('Erreur lors de l\'importation :', error);
    }
});

// Chargement des fichiers publics
async function loadPublicFiles() {
    try {
        const response = await fetch('/files/public');
        const files = await response.json();

        const publicFilesContainer = document.getElementById('public-files');
        publicFilesContainer.innerHTML = '';

        files.forEach(file => {
            const fileDiv = document.createElement('div');
            fileDiv.className = 'file-item';

            if (file.type.startsWith('image')) {
                fileDiv.innerHTML = `<img src="${file.path}" alt="${file.name}" />`;
            } else if (file.type.startsWith('video')) {
                fileDiv.innerHTML = `<video controls>
                                        <source src="${file.path}" type="video/mp4">
                                        Votre navigateur ne supporte pas la lecture vidéo.
                                    </video>`;
            } else {
                fileDiv.innerHTML = `<a href="${file.path}" target="_blank">${file.name}</a>`;
            }

            publicFilesContainer.appendChild(fileDiv);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des fichiers publics :', error);
    }
}

document.addEventListener('DOMContentLoaded', loadPublicFiles);
