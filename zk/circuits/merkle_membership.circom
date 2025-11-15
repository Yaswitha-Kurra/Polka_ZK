pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";
include "../node_modules/circomlib/circuits/comparators.circom";

template MerkleTreeInclusionProof(levels) {
    signal input leaf;
    signal input pathElements[levels];
    signal input pathIndices[levels];
    signal input root;
    
    component hashers[levels];
    component comparators[levels];
    
    signal intermediate[levels + 1];
    signal notPathIndex[levels];
    signal temp1[levels];
    signal temp2[levels];
    signal temp3[levels];
    signal temp4[levels];
    signal left[levels];
    signal right[levels];
    
    intermediate[0] <== leaf;
    
    for (var i = 0; i < levels; i++) {
        hashers[i] = Poseidon(2);
        
        // Check path index is valid (0 or 1)
        pathIndices[i] * (pathIndices[i] - 1) === 0;
        
        // Hash based on path index using quadratic constraints only
        // If pathIndices[i] == 0: hash(intermediate[i], pathElements[i])
        // If pathIndices[i] == 1: hash(pathElements[i], intermediate[i])
        notPathIndex[i] <== 1 - pathIndices[i];
        
        // left = pathIndices[i] * pathElements[i] + notPathIndex[i] * intermediate[i]
        temp1[i] <== pathIndices[i] * pathElements[i];
        temp2[i] <== notPathIndex[i] * intermediate[i];
        left[i] <== temp1[i] + temp2[i];
        
        // right = pathIndices[i] * intermediate[i] + notPathIndex[i] * pathElements[i]
        temp3[i] <== pathIndices[i] * intermediate[i];
        temp4[i] <== notPathIndex[i] * pathElements[i];
        right[i] <== temp3[i] + temp4[i];
        
        hashers[i].inputs[0] <== left[i];
        hashers[i].inputs[1] <== right[i];
        
        intermediate[i + 1] <== hashers[i].out;
    }
    
    // Verify root matches
    comparators[levels - 1] = IsEqual();
    comparators[levels - 1].in[0] <== intermediate[levels];
    comparators[levels - 1].in[1] <== root;
    comparators[levels - 1].out === 1;
}

template OrgAccessProof() {
    signal input identitySecret;
    signal input fileId;
    signal input orgRoot;
    signal input pathElements[20];  // 20 levels = 2^20 members max
    signal input pathIndices[20];
    
    signal output root;
    
    component poseidon = Poseidon(1);
    poseidon.inputs[0] <== identitySecret;
    
    component merkleProof = MerkleTreeInclusionProof(20);
    merkleProof.leaf <== poseidon.out;
    merkleProof.pathElements <== pathElements;
    merkleProof.pathIndices <== pathIndices;
    merkleProof.root <== orgRoot;
    
    root <== orgRoot;
}

component main = OrgAccessProof();

