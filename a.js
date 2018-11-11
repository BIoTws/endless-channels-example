const core = require('biot-core');
const AutoRenewableChannel = require('biot-core/lib/AutoRenewableChannel');

let peerPairingCode = 'A4xBDRF9usGr2LTaXV1f5ct14irSo3gyl5dz3rCVoSS0@byteball.org/bb-test#test';
let peerDeviceAddress = '0PEG7SDXYID3QPE5TUG4L4MIBFFGEYAMR';

async function start() {
	await core.init('test');
	let wallets = await core.getMyDeviceWallets();
	
	await core.addCorrespondent(peerPairingCode);
	let init = false;
	const autoRenewableChannel = new AutoRenewableChannel(wallets[0], peerDeviceAddress, 20000, 2);
	autoRenewableChannel.init();
	autoRenewableChannel.events.on('start', async (id) => {
		console.error('id: ', id);
		if (!init) {
			setInterval(async () => {
				await autoRenewableChannel.transfer(37);
			}, 10000);
			await autoRenewableChannel.transfer(37);
			init = true;
		}
	});
	autoRenewableChannel.events.on('changed_step', async (step) => {
		console.error('step: ', step);
	});
	await autoRenewableChannel.openNewChannel({
			walletId: wallets[0],
			peerAddress: null,
			myAmount: 100,
			peerAmount: 100,
			age: 10
		}
	);
}

start().catch(console.error);