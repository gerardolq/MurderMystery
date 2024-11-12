document.addEventListener('DOMContentLoaded', function() {
    const gameLengthInput = document.getElementById('gameLength');
    const gameLengthValue = document.getElementById('gameLengthValue');
    const form = document.getElementById('storyForm');
    const storyOutput = document.getElementById('storyOutput');

    // Update the displayed game length value dynamically
    gameLengthInput.addEventListener('input', function() {
        gameLengthValue.textContent = gameLengthInput.value;
    });

    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const numPlayers = document.getElementById('numPlayers').value;
        const playerArchitypes = document.getElementById('playerArchitypes').value;
        const theme = document.getElementById('theme').value;
        const gameLength = gameLengthInput.value;

        const inputData = {
            numPlayers: numPlayers,
            playerArchitypes: playerArchitypes,
            theme: theme,
            gameLength: gameLength
        };

        try {
            console.log('Sending request with the following data:', inputData);
            console.log(generatePrompt(inputData));

            const response = await fetch("https://api.openai.com/v1/completions", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer #########` // Replace with your actual API key
                },
                body: JSON.stringify({
                    model: "babbage-002", // Ensure you're using a valid model
                    prompt: generatePrompt(inputData),
                    max_tokens: 500
                })
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                storyOutput.style.display =  "block";
                throw new Error(`${response.status} - ${response.JSON} - Please verify that you are using a proper and valid API Key for OpenAPI.`);
            }

            const data = await response.json();
            console.log('Response data:', data); // Log the full response to inspect it

            // Ensure that the response contains choices
            if (data.choices && data.choices.length > 0) {
                storyOutput.style.display =  "flex";
                storyOutput.innerHTML = `<h2>Generated Story:</h2><p>${data.choices[0].text}</p>`;
            } else {
                storyOutput.style.display =  "flex";
                throw new Error('The API response does not contain any story output.');
            }
        } catch (error) {
            console.error('Error:', error); // Log the error to the console
            // Display the error message in the story output section
            storyOutput.innerHTML = `<h2>Error</h2><p>${error.message}</p>`;
        }
    });

    // Function to generate the prompt for OpenAI
    function generatePrompt(inputData) {
        return `Create a story for a game with ${inputData.numPlayers} players. The players are described as: ${inputData.playerArchitypes}. The theme or tone of the story should include: ${inputData.theme}. The game should last for about ${inputData.gameLength} minutes.`;
    }
});
