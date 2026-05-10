export class UploadCommand {
  constructor(
    public readonly file: Buffer,
    public readonly name: string,
    public readonly contentType: string,
  ) {}
}
