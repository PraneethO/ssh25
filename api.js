const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = 3000;

app.get('/run-command', (req, res) => {
    // Get the 'command' parameter from the URL query string
    const command = req.query.command;

    // Check if the command matches "ollama run llama3.2"
    if (command === "ollama run llama3.2") {
        // Run the command using exec
        exec(command, (error, stdout, stderr) => {
            if (error) {
                return res.status(500).json({
                    status: 'error',
                    message: `Error executing command: ${error.message}`
                });
            }
            if (stderr) {
                return res.status(500).json({
                    status: 'error',
                    message: `stderr: ${stderr}`
                });
            }
            // Return the stdout from the command
            return res.status(200).json({
                status: 'success',
                output: stdout
            });
        });
    } else {
        // Handle invalid command case
        return res.status(400).json({
            status: 'error',
            message: 'Invalid command'
        });
    }
});

app.listen(port, () => {
    console.log("Server running at http://localhost:3000");
});