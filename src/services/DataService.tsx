import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { AuthService } from './AuthService';
//@ts-ignore
import outputs from 'outputs.json';
import { SpaceEntry } from '../components/model/model';

const spacesUrl = outputs.ApiStack.SpacesApiEndpoint36C4F3B6 + 'spaces';

export class DataService {

  private authService: AuthService;
  private s3Client: S3Client | undefined;
  private awsRegion = 'eu-west-1';

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public async getSpaces(): Promise<SpaceEntry[]> {
    const getSpaces = await fetch(spacesUrl, {
      method: 'GET',
      headers: {
        'Authorization' : `Bearer ${this.authService.jwtToken!}`,
      }
    })
    const getSpacesResultJSON = await getSpaces.json()
    return getSpacesResultJSON;
  }

  public async reserveSpace(spaceId: string) {
    return '123';
  }

  public async createSpace(name: string, location:string, photo?: File){
    const space = {} as any;
    space.name = name;
    space.location = location;

    if(photo) {
      const uploadUrl = await this.uploadPublicFile(photo);
      space.photoUrl = uploadUrl;
    }
   
    const postResult = await fetch(spacesUrl, {
      method: 'POST',
      body: JSON.stringify(space),
      headers: {
        'Authorization' : `Bearer ${this.authService.jwtToken!}`
      }
    });

    const postResultJSON = await postResult.json();
    return postResultJSON.id;
  }

  public async uploadPublicFile(file: File) {
    const credentials = await this.authService.getTemporaryCredentials();
    if(!this.s3Client) {
      this.s3Client = new S3Client({
        credentials: credentials as any,
        region: this.awsRegion,
      })
    }

    const command = new PutObjectCommand({
      Bucket: outputs.DataStack.SpaceFinderPhotosBucketName,
      Key: file.name,
      ACL: 'public-read',
      Body: file,
    })

    await this.s3Client.send(command);
    return `https://${command.input.Bucket}.s3.${this.awsRegion}.amazonaws.com/${command.input.Key}`
  }

  public isAuthorized(){
      console.log(this.authService.isAuthorized());
      return this.authService.isAuthorized();
  }
}