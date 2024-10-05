// pages/api/run-docker.js
import { exec } from 'child_process';

export default function handler(req, res) {
  const { num_periods, frequency } = req.query;

  // Construct the Docker run command with dynamic inputs
  const command = `docker run --rm steel-price-model --num_periods ${num_periods} --frequency ${frequency}`;

  // Execute the command using Node's child_process.exec
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).json({ error: error.message });
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).json({ error: stderr });
    }
    // Send the output back to the client
    res.status(200).json({ output: stdout });
  });
}
