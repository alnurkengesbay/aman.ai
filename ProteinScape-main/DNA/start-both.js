const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting GenFlow AI Application...\n');

// Check if we're in the DNA directory
const dnaDir = __dirname;

// Start Streamlit server
console.log('📊 Starting Streamlit server on http://localhost:8501...');
const streamlit = spawn('python', ['-m', 'streamlit', 'run', 'app.py', '--server.headless', 'true', '--server.port', '8501'], {
  cwd: dnaDir,
  stdio: 'inherit',
  shell: true
});

streamlit.on('error', (error) => {
  console.error('❌ Error starting Streamlit:', error.message);
  console.error('   Make sure Python and Streamlit are installed.');
  process.exit(1);
});

// Wait a bit for Streamlit to start
setTimeout(() => {
  // Start React/Vite dev server
  console.log('⚛️  Starting React development server...\n');
  console.log('========================================');
  console.log('Application URLs:');
  console.log('  React App:    http://localhost:5173');
  console.log('  Streamlit:    http://localhost:8501');
  console.log('========================================\n');
  console.log('Press Ctrl+C to stop both servers\n');

  const vite = spawn('npm', ['run', 'dev'], {
    cwd: dnaDir,
    stdio: 'inherit',
    shell: true
  });

  vite.on('error', (error) => {
    console.error('❌ Error starting React app:', error.message);
    console.error('   Make sure Node.js and npm are installed.');
    streamlit.kill();
    process.exit(1);
  });

  // Cleanup on exit
  const cleanup = () => {
    console.log('\n🛑 Stopping servers...');
    if (streamlit && !streamlit.killed) streamlit.kill();
    if (vite && !vite.killed) vite.kill();
    process.exit();
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  process.on('exit', cleanup);
}, 3000);

