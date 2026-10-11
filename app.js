document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', event => { if(event.target === dialog){ const r=dialog.getBoundingClientRect(); if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close(); } }));
const walletButton=document.querySelector('[data-wallet]');
let walletAddress='',connecting=null;
function walletState(address=''){
 walletAddress=address;window.sparkWallet.address=address;
 if(walletButton)walletButton.textContent=address?`${address.slice(0,4)}…${address.slice(-4)}`:'Connect wallet';
 document.querySelector('#status').textContent=address?'Wallet connected.':'Wallet disconnected.';
 window.dispatchEvent(new CustomEvent('spark-wallet-change',{detail:{address}}));
}
async function connectWallet(){
 if(connecting)return connecting;
 const provider=window.phantom?.solana;
 if(!provider?.isPhantom){document.querySelector('#wallet-help')?.showModal();return false;}
 if(walletAddress&&provider.isConnected)return true;
 if(walletButton)walletButton.disabled=true;
 connecting=(async()=>{try{const response=await provider.connect();walletState(response.publicKey.toString());return true;}catch{document.querySelector('#status').textContent='Wallet connection cancelled. You can try again.';return false;}finally{if(walletButton)walletButton.disabled=false;connecting=null;}})();
 return connecting;
}
window.sparkWallet={address:'',connect:connectWallet};
walletButton?.addEventListener('click',connectWallet);
const provider=window.phantom?.solana;
provider?.on?.('accountChanged',publicKey=>walletState(publicKey?.toString()||''));
provider?.on?.('disconnect',()=>walletState());
if(provider?.isConnected&&provider.publicKey)walletState(provider.publicKey.toString());
