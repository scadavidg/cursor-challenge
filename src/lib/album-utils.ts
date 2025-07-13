import type { Album } from "@/lib/types";

export function removeDuplicateAlbums(albums: Album[]): Album[] {
  return Array.from(new Map(albums.map(album => [album.id, album])).values());
}

export function filterAlbumsByQuery(albums: Album[], query: string): Album[] {
  if (!query.trim()) return albums;
  
  const searchQuery = query.toLowerCase();
  return albums.filter(
    (album) =>
      album.title.toLowerCase().includes(searchQuery) ||
      album.artist.toLowerCase().includes(searchQuery)
  );
}

export function sortAlbums(
  albums: Album[], 
  sortField: "dateAdded" | "title" | "artist", 
  sortOrder: "asc" | "desc"
): Album[] {
  const sorted = [...albums];
  
  sorted.sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case "title":
        comparison = a.title.localeCompare(b.title);
        break;
      case "artist":
        comparison = a.artist.localeCompare(b.artist);
        break;
      case "dateAdded":
      default:
        // No hay fecha, así que usamos el id como proxy
        comparison = a.id.localeCompare(b.id);
        break;
    }
    
    return sortOrder === "asc" ? comparison : -comparison;
  });
  
  return sorted;
}

export function createAlbumLoadFunction(endpoint: string) {
  return async (page: number) => {
    const res = await fetch(`${endpoint}?page=${page}&limit=12`);
    if (!res.ok) throw new Error('Error al cargar álbumes');
    const result = await res.json();
    return {
      data: result.albums as Album[],
      hasMore: result.albums.length === 12,
      page: result.page
    };
  };
} 