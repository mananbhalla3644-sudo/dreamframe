export interface LoadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface AssetLoaderOptions {
  onProgress?: (progress: LoadProgress) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export class AssetLoader {
  private assets: string[] = [];
  private loaded = 0;
  private options: AssetLoaderOptions;
  private abortController = new AbortController();

  constructor(options: AssetLoaderOptions = {}) {
    this.options = options;
  }

  add(asset: string) {
    this.assets.push(asset);
  }

  addMultiple(assets: string[]) {
    this.assets.push(...assets);
  }

  async load(): Promise<void> {
    this.loaded = 0;
    this.abortController = new AbortController();

    const total = this.assets.length;
    if (total === 0) {
      this.options.onComplete?.();
      return;
    }

    const loadPromises = this.assets.map(async (asset) => {
      if (this.abortController.signal.aborted) return;
      
      try {
        const response = await fetch(asset, { signal: this.abortController.signal });
        if (!response.ok) throw new Error(`Failed to load ${asset}: ${response.status}`);
        await response.blob(); // Consume the response
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          this.options.onError?.(error);
        }
        throw error;
      } finally {
        this.loaded++;
        this.options.onProgress?.({
          loaded: this.loaded,
          total,
          percentage: (this.loaded / total) * 100,
        });
      }
    });

    try {
      await Promise.all(loadPromises);
      this.options.onComplete?.();
    } catch {
      // Errors handled in individual promises
    }
  }

  abort() {
    this.abortController.abort();
  }

  getProgress(): LoadProgress {
    return {
      loaded: this.loaded,
      total: this.assets.length,
      percentage: this.assets.length > 0 ? (this.loaded / this.assets.length) * 100 : 0,
    };
  }
}

export async function preloadImages(urls: string[]): Promise<HTMLImageElement[]> {
  return Promise.all(
    urls.map((url) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      })
    )
  );
}

export async function createImageBitmapFromUrl(url: string): Promise<ImageBitmap> {
  const response = await fetch(url);
  const blob = await response.blob();
  return createImageBitmap(blob);
}

export function createTextureFromImageBitmap(bitmap: ImageBitmap, options: Record<string, any> = {}): any {
  // This would need THREE.Texture but we avoid importing THREE here
  // Use this in components that have THREE available
  return null;
}