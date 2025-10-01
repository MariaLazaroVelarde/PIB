import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

declare global {
  interface Window {
    ethereum?: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class MetamaskService {
  private accountSubject = new BehaviorSubject<string | null>(null);
  private balanceSubject = new BehaviorSubject<string>('0');
  private connectedSubject = new BehaviorSubject<boolean>(false);

  public account$ = this.accountSubject.asObservable();
  public balance$ = this.balanceSubject.asObservable();
  public connected$ = this.connectedSubject.asObservable();

  constructor() {
    this.checkConnection();
  }

  async checkConnection() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          this.accountSubject.next(accounts[0]);
          this.connectedSubject.next(true);
          await this.getBalance(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  }

  async connectWallet(): Promise<boolean> {
    if (typeof window.ethereum === 'undefined') {
      alert('MetaMask no está instalado. Por favor instala MetaMask para continuar.');
      return false;
    }

    try {
      console.log('🔗 Conectando a MetaMask...');

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      console.log('👤 Cuentas obtenidas:', accounts);

      if (accounts.length > 0) {
        this.accountSubject.next(accounts[0]);
        this.connectedSubject.next(true);
        console.log('✅ Wallet conectada:', accounts[0]);
        await this.getBalance(accounts[0]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Error connecting to MetaMask:', error);
      return false;
    }
  }

  async getBalance(account: string) {
    try {
      console.log('🔍 Obteniendo balance para cuenta:', account);

      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [account, 'latest']
      });

      console.log('💰 Balance raw (hex):', balance);

      // Convertir de Wei a ETH
      const ethBalance = parseInt(balance, 16) / Math.pow(10, 18);
      console.log('💰 Balance convertido (ETH):', ethBalance);

      this.balanceSubject.next(ethBalance.toFixed(4));
    } catch (error) {
      console.error('❌ Error getting balance:', error);
      // En caso de error, mantener el balance en 0
      this.balanceSubject.next('0.0000');
    }
  }

  disconnect() {
    this.accountSubject.next(null);
    this.balanceSubject.next('0');
    this.connectedSubject.next(false);
    localStorage.removeItem('metamask_connected');
  }

  async refreshBalance() {
    const currentAccount = this.accountSubject.value;
    if (currentAccount) {
      await this.getBalance(currentAccount);
    }
  }

  async getCurrentNetwork() {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      console.log('🌐 Red actual (chainId):', chainId);
      return chainId;
    } catch (error) {
      console.error('❌ Error obteniendo red:', error);
      return null;
    }
  }

  getShortAddress(address: string): string {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }
}
