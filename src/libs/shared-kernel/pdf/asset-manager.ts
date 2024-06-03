import { promises as fs, readFileSync } from 'fs';
import * as path from 'path';

export type AssetPath = string;
export type FsPath = string;

export class AssetManager{
    static getFsPath(assetPath: AssetPath): FsPath {
        const pathParts = [__dirname, 'assets'];
        assetPath.split('/').forEach((part) => pathParts.push(part));
        return path.join(...pathParts);
    }
    static async load(assetPath: AssetPath): Promise<Buffer> {
        return fs.readFile(AssetManager.getFsPath(assetPath));
    }
    static loadSync(assetPath: AssetPath): Buffer {
        return readFileSync(AssetManager.getFsPath(assetPath));
    }
    static fontPath(fontFile: string): FsPath {
        return AssetManager.getFsPath(`fonts/${fontFile}`);
    }
    static HelveticaNeue(): FsPath {
        return AssetManager.fontPath('HelveticaNeueLTPro-Bd_0.otf');
    }
    static imagePath(fontFile: string): FsPath {
        return AssetManager.getFsPath(`images/${fontFile}`);
    }
}