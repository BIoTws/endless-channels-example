const core = require('biot-core');
const AutoRenewableChannel = require('biot-core/lib/AutoRenewableChannel');

async function start() {
	await core.init('test');
	let wallets = await core.getMyDeviceWallets();
	
	const autoRenewableChannel = new AutoRenewableChannel(wallets[0], null, 20000, 2);
	autoRenewableChannel.init();
	autoRenewableChannel.events.on('start', console.error);
	autoRenewableChannel.events.on('new_transfer', (amount, message, id) => {
		console.error('new transfer', amount, message, id);
	});
	autoRenewableChannel.events.on('request_approve_channel', async (objInfo) => {
		console.error('new Channel: ', objInfo);
		console.error(await autoRenewableChannel.approve(objInfo.index));
	});
}

start().catch(console.error);
