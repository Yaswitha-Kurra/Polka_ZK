const { ApiPromise, WsProvider } = require('@polkadot/api');

async function testContract() {
  console.log('Testing contract interaction...');
  
  const wsProvider = new WsProvider('ws://127.0.0.1:9944');
  const api = await ApiPromise.create({ provider: wsProvider });
  
  console.log('Connected to Polkadot node');
  
  // Test querying chain state
  const [chain, nodeName, nodeVersion] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version()
  ]);
  
  console.log(`Chain: ${chain}`);
  console.log(`Node: ${nodeName}`);
  console.log(`Version: ${nodeVersion}`);
  
  // Subscribe to new blocks
  api.rpc.chain.subscribeNewHeads((header) => {
    console.log(`New block: #${header.number}`);
  });
  
  console.log('Listening for new blocks...');
  console.log('Press Ctrl+C to exit');
}

testContract().catch(console.error);

