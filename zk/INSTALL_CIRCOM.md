# Installing Circom 2.x

The npm package `circom` is deprecated and only provides version 0.5.x. For Circom 2.x, you need to install it from GitHub releases.

## macOS Installation

```bash
# Download the latest Circom 2.x release for macOS
cd /tmp
wget https://github.com/iden3/circom/releases/download/v2.1.6/circom-macos-amd64
chmod +x circom-macos-amd64
sudo mv circom-macos-amd64 /usr/local/bin/circom

# Verify installation
circom --version
# Should show: 2.1.6
```

## Alternative: Use npx with circom2

```bash
# Install circom2 via npm (if available)
npm install -g @iden3/circom2

# Or use npx
npx @iden3/circom2 circuits/merkle_membership.circom --r1cs --wasm --sym
```

## Linux Installation

```bash
cd /tmp
wget https://github.com/iden3/circom/releases/download/v2.1.6/circom-linux-amd64
chmod +x circom-linux-amd64
sudo mv circom-linux-amd64 /usr/local/bin/circom
circom --version
```

## Verify Installation

After installing, verify with:
```bash
circom --version
```

You should see version 2.x.x (not 0.5.x)

