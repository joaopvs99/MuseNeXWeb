document.getElementById('signupForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    try {
      const response = await fetch('http://localhost:8383/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      // Display the server response
      console.log(data); // You can replace this with the logic to display the response on your page
    } catch (error) {
      console.error('Error signing up:', error);
      // Handle the error, e.g., display an error message on your page
    }
  });