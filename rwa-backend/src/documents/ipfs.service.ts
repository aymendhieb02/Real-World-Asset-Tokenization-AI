import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class IpfsService {
  private ipfs: any = null;

  constructor(private configService: ConfigService) {
    const projectId = this.configService.get('IPFS_PROJECT_ID');
    const projectSecret = this.configService.get('IPFS_PROJECT_SECRET');

    if (projectId && projectSecret) {
      try {
        const { create } = require('ipfs-http-client');
        const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
        
        this.ipfs = create({
          host: 'ipfs.infura.io',
          port: 5001,
          protocol: 'https',
          headers: {
            authorization: auth,
          },
        });
      } catch (error) {
        console.warn('Failed to initialize IPFS client:', error.message);
      }
    }
  }

  async upload(buffer: Buffer, filename: string): Promise<string> {
    if (!this.ipfs) {
      const mockHash = `Qm${Buffer.from(filename + Date.now()).toString('base64').substring(0, 44)}`;
      console.warn('IPFS not configured, using mock hash:', mockHash);
      return mockHash;
    }

    try {
      const result = await this.ipfs.add({
        path: filename,
        content: buffer,
      });

      return result.cid.toString();
    } catch (error) {
      throw new Error(`Failed to upload to IPFS: ${error.message}`);
    }
  }

  async get(hash: string): Promise<Buffer> {
    if (!this.ipfs) {
      throw new Error('IPFS not configured');
    }

    try {
      const chunks: Uint8Array[] = [];
      for await (const chunk of this.ipfs.cat(hash)) {
        chunks.push(chunk);
      }
      return Buffer.concat(chunks);
    } catch (error) {
      throw new Error(`Failed to retrieve from IPFS: ${error.message}`);
    }
  }

  getGatewayUrl(hash: string): string {
    return `https://ipfs.io/ipfs/${hash}`;
  }
}