# Backend Startup Guide

## Fixed Issues

✅ Removed non-existent import `checkIdentityExists`
✅ Removed non-existent import `getAvailableOrgs`
✅ Fixed `snarkjs` import to use namespace import

## Starting the Backend

### Option 1: If Port 3001 is Free

```bash
cd backend
npm start
```

### Option 2: If Port 3001 is Already in Use

**Kill the existing process:**
```bash
lsof -ti:3001 | xargs kill -9
```

**Then start:**
```bash
cd backend
npm start
```

### Option 3: Use a Different Port

Edit `backend/.env`:
```
PORT=3002
```

Then:
```bash
cd backend
npm start
```

## Expected Output

When started successfully, you should see:
```
Backend server running on port 3001
Connected to Polkadot node
Starting event listener...
```

**Note:** If you don't have a Polkadot node running, you'll see:
```
Failed to connect to Polkadot: [error]
```

This is OK for testing - the backend will use mock data when the contract address is not set.

## Testing the Backend

Once started, test with:
```bash
curl http://localhost:3001/health
```

Should return:
```json
{"status":"ok","timestamp":...}
```

