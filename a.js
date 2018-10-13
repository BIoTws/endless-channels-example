const core = require('biot-core');
const AutoReNewChannels = require('biot-core/lib/AutoReNewChannels');

let peerPairingCode = 'AkibUjffrMVjFBQ/wW76gx+3J/iQtMyzrvG3/dYIQMcg@byteball.org/bb-test#test';
let peerDeviceAddress = '0ECDNM2P7HSTBWCSAZNQA4W65USHXUAXZ';

async function start() {
	const device = require('byteballcore/device');
	
	await core.init('test');
	let myDeviceAddress = device.getMyDeviceAddress();
	let wallets = await core.getMyDeviceWallets();
	
	await core.addCorrespondent(peerPairingCode);
	
	const autoReNewChannels = new AutoReNewChannels(wallets[0], 20000, 60);
	
	await autoReNewChannels.init({
		walletId: wallets[0],
		myDeviceAddress,
		peerDeviceAddress,
		peerAddress: null,
		myAmount: 100,
		peerAmount: 100,
		age: 10
	});
	autoReNewChannels.events.on('error', (error, id) => {
		console.error('channelError', id, error);
	});
	autoReNewChannels.events.on('start', async (id) => {
		console.error('channel start:', id);
		setInterval(async () => {
			console.error('transfer', await autoReNewChannels.transfer(30));
		}, 10000);
	});
	autoReNewChannels.events.on('start_next', async (id) => {
		console.error('*********\nstart_next:', id, '\n********');
	});
	autoReNewChannels.events.on('changed_step', (step, id) => {
		console.error('changed_step: ', step, id);
	});
	autoReNewChannels.events.on('new_transfer', async (amount, message, id) => {
		console.error('new_transfer: ', amount, message, id);
	});
}

start().catch(console.error);