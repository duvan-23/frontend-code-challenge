import * as CryptoJS from 'crypto-js';
import { environment } from '@enviroment';

const secretKey =  environment.SECRET_KEY;
export class Crypto{
    static encrypt(text: string){
        return CryptoJS.AES.encrypt(text, secretKey).toString();
    }

    static decrypt(encrypted: string){
        return CryptoJS.AES.decrypt(encrypted, secretKey).toString(CryptoJS.enc.Utf8);
    }
}