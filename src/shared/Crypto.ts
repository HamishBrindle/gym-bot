import crypto, { CipherGCMTypes, CipherCCMTypes } from 'crypto';

/**
 * Crypto class can excrypt/decrypt text using a key, IV, and text
 */
export class Crypto {
  private readonly algorithm: (string | CipherGCMTypes | CipherCCMTypes);

  private readonly key: string;

  private readonly iv: string;

  constructor(
    key: string,
    iv: string,
    algorithm: (string | CipherGCMTypes | CipherCCMTypes) = 'aes-256-cbc',
  ) {
    this.key = key;
    this.iv = iv;
    this.algorithm = algorithm;
  }

  /**
   * Encrypt text and return encrypted data
   *
   * @param text Text to be excrypted
   */
  encrypt(text: string): string {
    const iv = Buffer.from(this.iv).toString('hex').slice(0, 16);
    const key = Buffer.from(this.key);
    const cipher = crypto.createCipheriv(this.algorithm, key, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return encrypted.toString('hex');
  }

  /**
   * Get the original text from encrypted data
   *
   * @param cryptoData
   */
  decrypt(cryptoData: string): string {
    const iv = Buffer.from(this.iv).toString('hex').slice(0, 16);
    const key = Buffer.from(this.key);
    const encryptedText = Buffer.from(cryptoData, 'hex');
    const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return decrypted.toString();
  }
}
