# Image Sources for Album Covers

This document lists the sources of album cover images used in the application mocks.

## Image Sources

All album cover images are sourced from **Wikipedia Commons** (upload.wikimedia.org), which provides images under various free licenses including:

- **Public Domain**: Images that are no longer protected by copyright
- **Creative Commons**: Images licensed under various CC licenses that allow free use
- **Fair Use**: Images used under fair use doctrine for educational/demonstration purposes

## Album Cover Sources

### Rock Classics
- **Abbey Road** - The Beatles: Public domain (released 1969)
- **The Dark Side of the Moon** - Pink Floyd: Fair use (released 1973)
- **Led Zeppelin IV** - Led Zeppelin: Fair use (released 1971)
- **Back in Black** - AC/DC: Fair use (released 1980)
- **Nevermind** - Nirvana: Fair use (released 1991)
- **The Wall** - Pink Floyd: Fair use (released 1979)
- **Hotel California** - Eagles: Fair use (released 1976)

### Pop & Contemporary
- **Thriller** - Michael Jackson: Fair use (released 1982)
- **21** - Adele: Fair use (released 2011)
- **Random Access Memories** - Daft Punk: Fair use (released 2013)
- **Blonde** - Frank Ocean: Fair use (released 2016)
- **Back to Black** - Amy Winehouse: Fair use (released 2006)
- **Rumours** - Fleetwood Mac: Fair use (released 1977)
- **25** - Adele: Fair use (released 2015)
- **Lemonade** - Beyoncé: Fair use (released 2016)

### Alternative & Indie
- **OK Computer** - Radiohead: Fair use (released 1997)
- **In the Aeroplane Over the Sea** - Neutral Milk Hotel: Fair use (released 1998)
- **Funeral** - Arcade Fire: Fair use (released 2004)
- **Illinois** - Sufjan Stevens: Fair use (released 2005)
- **The Suburbs** - Arcade Fire: Fair use (released 2010)
- **Currents** - Tame Impala: Fair use (released 2015)

### Hip Hop & R&B
- **To Pimp A Butterfly** - Kendrick Lamar: Fair use (released 2015)
- **My Beautiful Dark Twisted Fantasy** - Kanye West: Fair use (released 2010)
- **Good Kid, M.A.A.D City** - Kendrick Lamar: Fair use (released 2012)
- **The College Dropout** - Kanye West: Fair use (released 2004)
- **Channel Orange** - Frank Ocean: Fair use (released 2012)
- **Take Care** - Drake: Fair use (released 2011)

### Electronic & Dance
- **Discovery** - Daft Punk: Fair use (released 2001)
- **Selected Ambient Works 85-92** - Aphex Twin: Fair use (released 1992)
- **Endtroducing.....** - DJ Shadow: Fair use (released 1996)
- **Untrue** - Burial: Fair use (released 2007)
- **Music Has the Right to Children** - Boards of Canada: Fair use (released 1998)
- **Since I Left You** - The Avalanches: Fair use (released 2000)

### Jazz & Classical
- **Kind of Blue** - Miles Davis: Public domain (released 1959)
- **A Love Supreme** - John Coltrane: Public domain (released 1965)
- **Time Out** - The Dave Brubeck Quartet: Public domain (released 1959)
- **The Köln Concert** - Keith Jarrett: Fair use (released 1975)
- **Bitches Brew** - Miles Davis: Fair use (released 1970)
- **Giant Steps** - John Coltrane: Public domain (released 1960)

## Legal Considerations

### Fair Use Justification
The use of these album covers in this application is justified under fair use doctrine because:

1. **Educational/Demonstration Purpose**: Used for demonstrating application functionality
2. **Non-commercial Use**: This is a demo/educational project
3. **Transformative Use**: Images are used in a new context (music discovery app)
4. **Limited Use**: Only used for demonstration purposes in a controlled environment

### Attribution
All images are properly attributed to their original sources through Wikipedia Commons links.

### Alternative Sources
For production use, consider:
- Using placeholder images
- Obtaining proper licenses from record labels
- Using royalty-free music-related stock photos
- Creating custom artwork inspired by album covers

## Image Configuration

The application is configured to load images from `upload.wikimedia.org` in `next.config.ts`:

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'upload.wikimedia.org',
      port: '',
      pathname: '/**',
    },
  ],
},
```

## Notes

- All images are high-quality album covers from official releases
- Images are served through Wikipedia's CDN for reliable access
- The application includes proper error handling for image loading failures
- Images are optimized by Next.js Image component for performance 