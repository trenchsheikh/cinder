document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', event => { if(event.target === dialog){ const r=dialog.getBoundingClientRect(); if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close(); } }));
const walletButton = document.querySelector('[data-wallet]');
walletButton?.addEventListener('click', async () => {
 const provider = window.phantom?.solana;
 const help = document.querySelector('#wallet-help');
 if(!provider?.isPhantom){help?.showModal();return;}
 walletButton.disabled=true;
 try{const response=await provider.connect();const address=response.publicKey.toString();walletButton.textContent=`${address.slice(0,4)}…${address.slice(-4)}`;document.querySelector('#status').textContent='Wallet connected.';}
 catch{document.querySelector('#status').textContent='Wallet connection cancelled. You can try again.';}
 finally{walletButton.disabled=false;}
});
const terminalView=document.querySelector('[data-terminal-view]');
if(terminalView){const names={explore:'Discover coins',launch:'Create a coin',portfolio:'Your portfolio',rewards:'Holder rewards'};const view=new URLSearchParams(location.search).get('view')||'explore';terminalView.textContent=names[view]||names.explore;document.querySelector(`[data-view="${Object.hasOwn(names,view)?view:'explore'}"]`)?.setAttribute('aria-current','page');}
