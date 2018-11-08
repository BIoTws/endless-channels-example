const core = require('biot-core');
const AutoReNewChannels = require('biot-core/lib/AutoReNewChannels');

async function start() {
	await core.init('test');
	let wallets = await core.getMyDeviceWallets();
	
	const autoReNewChannels = new AutoReNewChannels(wallets[0], 20000, 60);
	
	autoReNewChannels.events.on('request_approve_channel', async (objInfo) => {
		console.error('new Channel: ', objInfo);
		autoReNewChannels.events.on('error', (error, id) => {
			console.error('channelError', id, error);
		});
		autoReNewChannels.events.on('start', (id) => {
			console.error('channel start:', id);
		});
		autoReNewChannels.events.on('changed_step', (step, id) => {
			console.error('changed_step: ', step, id);
		});
		autoReNewChannels.events.on('new_transfer', async (amount, message, id) => {
			console.error('new_transfer: ', amount, message, id);
			
		});
		if (autoReNewChannels.currentChannel.myAmount === 100) {
			await autoReNewChannels.approve();
		} else {
			await autoReNewChannels.reject();
		}
	});
}

start().catch(console.error);
