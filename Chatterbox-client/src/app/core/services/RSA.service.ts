import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as forgeLib from 'node-forge';
import { firstValueFrom, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EncryptionModel } from '../models/EncryptionModel';

@Injectable({
  providedIn: 'root'
})
export class RSAService {
    httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'body' as 'body',
      params: new HttpParams(),
    withCredentials:true
  }
  private forge: any = forgeLib; 
  
  constructor(private http: HttpClient) { }

  getPublicKey(userId:string, chatId:string) : string{
    return localStorage.getItem(`publicRsaKey-${userId}-${chatId}`) || "";
  }
  setPublicKey (userId:string, chatId:string, key: string) : void {
    localStorage.setItem(`publicRsaKey-${userId}-${chatId}`, key);
  }

  private getPrivateKey (userId:string, chatId:string) {
    return localStorage.getItem(`privateRsaKey-${userId}-${chatId}`) || "";
  }
  private setPrivateKey (userId:string, chatId:string, key: string) {
    localStorage.setItem(`privateRsaKey-${userId}-${chatId}`, key);
  }

  async initChatKey(userId:string, companionId:string, chatId: string) {
    this.initRsaKeys(userId, chatId);
    const encryptionModel = {
      _id:'',
      chatId: chatId,
      userFrom: companionId,
      userTo: userId,
      publicKey: this.getPublicKey(userId, chatId)
    } 
    debugger;
    await firstValueFrom(this.http.post(`${environment.apiEncryptionUrl}keys/setEncKey`, encryptionModel, this.httpOptions).pipe(map(res => res)));      
    
  }

  async importCompanionKey(userId:string, companionId:string, chatId: string): Promise<string>{
    await firstValueFrom(this.http.get<EncryptionModel>(`${environment.apiEncryptionUrl}keys/getEncKey?userTo=${companionId}&userFrom=${userId}&chatId=${chatId}`, this.httpOptions)
        .pipe(map((model:EncryptionModel)=>{
          this.setPublicKey(companionId, chatId, model.publicKey);
          return model.publicKey;
        }))); 
    return '';
  }

  async getCompanionKey(userId:string, companionId:string, chatId: string) : Promise<string>{
    let pk = this.getPublicKey(companionId, chatId);
    if(!pk){
      await this.importCompanionKey(userId, companionId, chatId)
      pk = this.getPublicKey(companionId, chatId);
    }
    return pk;
  }

  initRsaKeys(userId:string, chatId:string) {
    let pki = this.forge.pki;
    let rsa = this.forge.pki.rsa;
    let keypair = rsa.generateKeyPair({bits: 2048, e: 0x10001});
    let publicKeyPEM = pki.publicKeyToPem(keypair.publicKey);
    let privateKeyPEM = pki.privateKeyToPem(keypair.privateKey);
    
    this.setPublicKey(userId, chatId, publicKeyPEM);
    this.setPrivateKey(userId, chatId, privateKeyPEM);
  }

  decrypt(encrypted: string, userId:string, chatId:string) : string {
    const privateKey = this.forge.pki.privateKeyFromPem(this.getPrivateKey(userId, chatId));
    return privateKey.decrypt(encrypted, 'RSA-OAEP');
  } 

  encrypt(message: string, companionId:string, chatId:string) : string {
    const publicKey = this.forge.pki.publicKeyFromPem(this.getPublicKey(companionId, chatId));
    return publicKey.encrypt(message, 'RSA-OAEP');
  }
}
