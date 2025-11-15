const snarkjs = require("snarkjs");
const fs = require("fs");
const path = require("path");

async function setup() {
  console.log("Starting Groth16 setup...");
  
  const r1csPath = path.join(__dirname, "../circuits/merkle_membership.r1cs");
  const wasmPath = path.join(__dirname, "../circuits/merkle_membership.wasm");
  const ptauPath = path.join(__dirname, "../circuits/powersOfTau.ptau");
  const zkeyPath = path.join(__dirname, "../circuits/proving_key.zkey");
  const vkeyPath = path.join(__dirname, "../circuits/verification_key.json");
  
  if (!fs.existsSync(wasmPath) || !fs.existsSync(r1csPath)) {
    console.error("Circuit not compiled. Run: npm run compile");
    process.exit(1);
  }
  
  console.log("Generating proving key and verification key...");
  console.log("This may take a few minutes...");
  
  try {
    // Step 1: Download or use powers of tau (phase 1)
    if (!fs.existsSync(ptauPath)) {
      console.log("Step 1: Downloading powers of tau ceremony...");
      console.log("(This is a one-time download)");
      
      // Get circuit size to determine powers of tau size needed
      const r1cs = await snarkjs.r1cs.info(r1csPath);
      const maxConstraints = r1cs.nConstraints;
      const ptauSize = Math.ceil(Math.log2(maxConstraints)) + 1;
      
      console.log(`Circuit has ${maxConstraints} constraints`);
      
      // For development, we'll generate a small powers of tau locally
      // For production, use a trusted setup ceremony from https://github.com/iden3/snarkjs
      console.log("\n⚠️  For production, use a trusted setup ceremony.");
      console.log("For development, generating a small powers of tau locally...");
      console.log("(This may take a few minutes)");
      
      // Generate powers of tau with the required size
      // We need at least 2^13 = 8192 for our circuit (5113 constraints)
      // Using 2^13 = 8192 which is sufficient
      const ptauSizePower = 13; // 2^13 = 8192
      
      console.log(`Generating powers of tau with size 2^${ptauSizePower} = ${Math.pow(2, ptauSizePower)}...`);
      
      // Use powersOfTau.newAccumulator
      // Signature: newAccumulator(curve, power, fileName, logger)
      // Get bn128 curve (default for Groth16)
      const curve = await snarkjs.curves.getCurveFromName("bn128");
      
      // Create a logger object with required methods
      const logger = {
        info: console.log,
        debug: console.log,
        warn: console.warn,
        error: console.error
      };
      
      await snarkjs.powersOfTau.newAccumulator(curve, ptauSizePower, ptauPath, logger);
      
      console.log("✓ Powers of tau generated");
    } else {
      console.log("✓ Using existing powers of tau");
    }
    
    // Step 2: Prepare phase 2 and create zkey from r1cs and powers of tau
    console.log("Step 2: Preparing phase 2...");
    const logger = {
      info: console.log,
      debug: () => {}, // Suppress debug output
      warn: console.warn,
      error: console.error
    };
    
    // Prepare phase 2 (required before creating zkey)
    await snarkjs.powersOfTau.preparePhase2(ptauPath, ptauPath + ".tmp", logger);
    const ptauPhase2Path = ptauPath + ".tmp";
    
    console.log("Step 3: Creating zkey (phase 2)...");
    // newZKey signature: (r1csName, ptauName, zkeyName, logger)
    // This creates the zkey file directly
    await snarkjs.zKey.newZKey(r1csPath, ptauPhase2Path, zkeyPath, logger);
    console.log("✓ Proving key (zkey) saved");
    
    // Clean up temporary phase 2 file
    if (fs.existsSync(ptauPhase2Path)) {
      fs.unlinkSync(ptauPhase2Path);
    }
    
    // Step 4: Export verification key
    console.log("Step 4: Exporting verification key...");
    // exportVerificationKey signature: (zkeyName, logger)
    const vKey = await snarkjs.zKey.exportVerificationKey(zkeyPath, logger);
    fs.writeFileSync(vkeyPath, JSON.stringify(vKey, null, 2));
    console.log("✓ Verification key saved");
    
    console.log("\n✅ Setup complete!");
    console.log("Proving key: circuits/proving_key.zkey");
    console.log("Verification key: circuits/verification_key.json");
    
    // Exit explicitly to prevent hanging
    process.exit(0);
  } catch (error) {
    console.error("Error during setup:", error.message);
    console.error(error.stack);
    console.log("\nFor more information, see: https://github.com/iden3/snarkjs#groth16");
    process.exit(1);
  }
}

setup().catch(console.error);

