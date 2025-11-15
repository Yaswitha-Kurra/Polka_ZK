#!/bin/bash

echo "🚀 Quick Test Script for Polkadot ZK Access"
echo "=============================================="
echo ""

# Check if backend .env exists
if [ ! -f backend/.env ]; then
    echo "📝 Creating backend/.env file..."
    cat > backend/.env << EOF
PORT=3001
POLKADOT_WS_URL=ws://127.0.0.1:9944
CONTRACT_ADDRESS=
JWT_SECRET=dev-secret-key-change-in-production
EOF
    echo "✅ Created backend/.env"
else
    echo "✅ backend/.env already exists"
fi

# Check if circuit files are in frontend
if [ ! -f frontend/public/circuits/merkle_membership.wasm ]; then
    echo "📦 Copying circuit files to frontend..."
    cd zk
    npm run copy-circuits
    cd ..
    echo "✅ Circuit files copied"
else
    echo "✅ Circuit files already in frontend"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Terminal 1: cd backend && npm start"
echo "2. Terminal 2: cd frontend && npm run dev"
echo "3. Open http://localhost:5173 in your browser"
echo ""
echo "See docs/TESTING_GUIDE.md for detailed testing steps"

