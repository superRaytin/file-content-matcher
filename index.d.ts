export interface FileMatcherOptionsI {
  path?: string;
  recursiveDepth?: number;
  readFileConcurrency?: number;
  micromatchOptions?: any;
  filter?: {
    namePatterns?: string[];
    contentRegExp?: RegExp;
    readOptions?: Record<string, unknown>;
  };
}

export default class FileContentMatcher {
  /**
   * Search files
   * @param options File search options
   */
  public match(options: FileMatcherOptionsI): Promise<string[]>;
}
