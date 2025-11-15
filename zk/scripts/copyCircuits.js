const fs = require('fs');
const path = require('path');

// Copy circuit files to frontend public directory
function copyCircuits() {
  const sourceDir = path.join(__dirname, '../circuits');
  const targetDir = path.join(__dirname, '../../frontend/public/circuits');
  
  // Create target directory if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  const filesToCopy = [
    'merkle_membership.wasm',
    'proving_key.zkey',
    'verification_key.json'
  ];
  
  let copied = 0;
  
  filesToCopy.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);
    
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`✅ Copied ${file}`);
      copied++;
    } else {
      console.log(`⚠️  ${file} not found (run 'npm run compile' and 'npm run setup' first)`);
    }
  });
  
  if (copied > 0) {
    console.log(`\n✅ Copied ${copied} file(s) to frontend/public/circuits/`);
  } else {
    console.log('\n❌ No files copied. Make sure to compile and setup circuits first.');
  }
}

copyCircuits();

