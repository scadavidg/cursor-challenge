export class Album {
  constructor(
    public id: string,
    public title: string,
    public artist: string,
    public coverArt: string
  ) {}

  static fromSpotify(item: any): Album {
    return new Album(
      item.id,
      item.name,
      item.artists?.map((a: any) => a.name).join(", ") || "",
      item.images?.[0]?.url || ""
    );
  }
} 