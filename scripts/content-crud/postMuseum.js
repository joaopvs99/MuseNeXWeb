const form = document.getElementById('museum-form');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Collect input values from the user
    const nome = document.getElementById('nomeInput').value;
    const localizacao = document.getElementById('localizacaoInput').value;
    const galeria = document.getElementById('galeriaInput').value.split(','); // Assuming a comma-separated string for simplicity
    const descricao = document.getElementById('descricaoInput').value;
    const contacto = document.getElementById('contactoInput').value;
    const categoria_id = document.getElementById('categoriaIdInput').value;

    // Validate input data (you might want to add more validation)
    if (!nome || !localizacao || !galeria || !descricao || !contacto || !categoria_id) {
        console.error('Please fill in all required fields.');
        return;
    }

    try {
        // Make a POST request to create a new postmuseum
        const response = await fetch('http://localhost:8383/postmuseum', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${await user.getIdToken()}`
            },
            body: JSON.stringify({
                nome,
                localizacao,
                galeria,
                descricao,
                contacto,
                categoria_id
            }),
        });

        const data = await response.json();
        console.log('Postmuseum created successfully:', data);

        // Optionally, you can update the UI or perform other actions after creating a postmuseum
    } catch (error) {
        console.error('Error creating postmuseum:', error);
    }
});