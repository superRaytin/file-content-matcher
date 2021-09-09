import type { Options } from 'micromatch'

export interface FileMatcherOptionsI {
    path?: string;
    recursiveDepth?: number;
    readFileConcurrency?: number;
    micromatchOptions?: Options;
    filter?: {
      namePatterns?: string[];
      contentRegExp?: string;
      readOptions?: string;
    };
}

export default class FileContentMatcher {
    /**
     * Search files
     * @param options File search options
     */
    public match(options: FileMatcherOptionsI): void;
}