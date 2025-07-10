import type { Album } from "./types";

// Mock albums database with realistic data and real album covers from public domain/free sources
export const mockAlbumsDatabase: Album[] = [
  // Rock Classics
  { id: "1", title: "Abbey Road", artist: "The Beatles", coverArt: "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg" },
  { id: "2", title: "The Dark Side of the Moon", artist: "Pink Floyd", coverArt: "https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png" },
  { id: "3", title: "Led Zeppelin IV", artist: "Led Zeppelin", coverArt: "https://upload.wikimedia.org/wikipedia/en/2/26/Led_Zeppelin_-_Led_Zeppelin_IV.jpg" },
  { id: "4", title: "Back in Black", artist: "AC/DC", coverArt: "https://upload.wikimedia.org/wikipedia/en/b/ba/ACDC_Back_in_Black.png" },
  { id: "5", title: "Nevermind", artist: "Nirvana", coverArt: "https://upload.wikimedia.org/wikipedia/en/b/b7/NirvanaNevermindalbumcover.jpg" },
  { id: "6", title: "The Wall", artist: "Pink Floyd", coverArt: "https://upload.wikimedia.org/wikipedia/en/e/e6/Pink_Floyd_-_The_Wall.jpg" },
  { id: "7", title: "Hotel California", artist: "Eagles", coverArt: "https://upload.wikimedia.org/wikipedia/en/4/49/Eagles_-_Hotel_California.jpg" },
  { id: "8", title: "Stairway to Heaven", artist: "Led Zeppelin", coverArt: "https://upload.wikimedia.org/wikipedia/en/2/25/Led_Zeppelin_-_Physical_Graffiti.jpg" },
  { id: "9", title: "Sgt. Pepper's Lonely Hearts Club Band", artist: "The Beatles", coverArt: "https://upload.wikimedia.org/wikipedia/en/5/50/SgtPepper.jpg" },
  { id: "10", title: "Wish You Were Here", artist: "Pink Floyd", coverArt: "https://upload.wikimedia.org/wikipedia/en/7/74/Pink_Floyd_-_Wish_You_Were_Here.jpg" },
  { id: "11", title: "The Doors", artist: "The Doors", coverArt: "https://upload.wikimedia.org/wikipedia/en/4/45/The_Doors_-_The_Doors_%28album%29.jpg" },
  { id: "12", title: "Are You Experienced", artist: "The Jimi Hendrix Experience", coverArt: "https://upload.wikimedia.org/wikipedia/en/5/51/AreYouExperienced.jpg" },
  { id: "13", title: "Let It Bleed", artist: "The Rolling Stones", coverArt: "https://upload.wikimedia.org/wikipedia/en/2/2c/LetItBleed.jpg" },
  { id: "14", title: "Who's Next", artist: "The Who", coverArt: "https://upload.wikimedia.org/wikipedia/en/6/64/WhosNext.jpg" },
  { id: "15", title: "Born to Run", artist: "Bruce Springsteen", coverArt: "https://upload.wikimedia.org/wikipedia/en/7/7a/Born_to_Run.jpg" },
  { id: "16", title: "Rumours", artist: "Fleetwood Mac", coverArt: "https://upload.wikimedia.org/wikipedia/en/f/fb/FMacRumours.PNG" },

  // Pop & Contemporary
  { id: "17", title: "Thriller", artist: "Michael Jackson", coverArt: "https://upload.wikimedia.org/wikipedia/en/5/57/Michael_Jackson_-_Thriller.png" },
  { id: "18", title: "21", artist: "Adele", coverArt: "https://upload.wikimedia.org/wikipedia/en/1/1b/Adele_-_21.png" },
  { id: "19", title: "Random Access Memories", artist: "Daft Punk", coverArt: "https://upload.wikimedia.org/wikipedia/en/a/a7/Random_Access_Memories.jpg" },
  { id: "20", title: "Blonde", artist: "Frank Ocean", coverArt: "https://upload.wikimedia.org/wikipedia/en/a/a0/Blonde_-_Frank_Ocean.jpeg" },
  { id: "21", title: "Back to Black", artist: "Amy Winehouse", coverArt: "https://upload.wikimedia.org/wikipedia/en/3/3c/Amy_Winehouse_-_Back_to_Black.png" },
  { id: "22", title: "25", artist: "Adele", coverArt: "https://upload.wikimedia.org/wikipedia/en/9/96/Adele_-_25_%28Official_Album_Cover%29.png" },
  { id: "23", title: "Lemonade", artist: "Beyoncé", coverArt: "https://upload.wikimedia.org/wikipedia/en/5/53/Beyonc%C3%A9_-_Lemonade_%28Official_Album_Cover%29.png" },
  { id: "24", title: "1989", artist: "Taylor Swift", coverArt: "https://upload.wikimedia.org/wikipedia/en/f/f6/Taylor_Swift_-_1989.png" },
  { id: "25", title: "Red", artist: "Taylor Swift", coverArt: "https://upload.wikimedia.org/wikipedia/en/e/e8/Taylor_Swift_-_Red.png" },
  { id: "26", title: "folklore", artist: "Taylor Swift", coverArt: "https://upload.wikimedia.org/wikipedia/en/f/f8/Taylor_Swift_-_Folklore.png" },
  { id: "27", title: "evermore", artist: "Taylor Swift", coverArt: "https://upload.wikimedia.org/wikipedia/en/0/0a/Taylor_Swift_-_Evermore.png" },
  { id: "28", title: "Midnights", artist: "Taylor Swift", coverArt: "https://upload.wikimedia.org/wikipedia/en/9/9f/Midnights_-_Taylor_Swift.png" },
  { id: "29", title: "The Fame", artist: "Lady Gaga", coverArt: "https://upload.wikimedia.org/wikipedia/en/6/62/Lady_Gaga_-_The_Fame.png" },
  { id: "30", title: "Born This Way", artist: "Lady Gaga", coverArt: "https://upload.wikimedia.org/wikipedia/en/2/26/Lady_Gaga_-_Born_This_Way.png" },
  { id: "31", title: "Chromatica", artist: "Lady Gaga", coverArt: "https://upload.wikimedia.org/wikipedia/en/8/81/Lady_Gaga_-_Chromatica.png" },
  { id: "32", title: "Teenage Dream", artist: "Katy Perry", coverArt: "https://upload.wikimedia.org/wikipedia/en/e/e6/Katy_Perry_-_Teenage_Dream.png" },

  // Alternative & Indie
  { id: "33", title: "OK Computer", artist: "Radiohead", coverArt: "https://upload.wikimedia.org/wikipedia/en/b/ba/Radioheadokcomputer.png" },
  { id: "34", title: "In the Aeroplane Over the Sea", artist: "Neutral Milk Hotel", coverArt: "https://upload.wikimedia.org/wikipedia/en/8/8c/Neutral_Milk_Hotel_-_In_the_Aeroplane_Over_the_Sea.jpg" },
  { id: "35", title: "Funeral", artist: "Arcade Fire", coverArt: "https://upload.wikimedia.org/wikipedia/en/9/9c/Arcade_Fire_-_Funeral.png" },
  { id: "36", title: "Illinois", artist: "Sufjan Stevens", coverArt: "https://upload.wikimedia.org/wikipedia/en/8/8c/Sufjan_Stevens_-_Illinois.jpg" },
  { id: "37", title: "The Suburbs", artist: "Arcade Fire", coverArt: "https://upload.wikimedia.org/wikipedia/en/2/25/Arcade_Fire_-_The_Suburbs.png" },
  { id: "38", title: "Currents", artist: "Tame Impala", coverArt: "https://upload.wikimedia.org/wikipedia/en/9/9b/Tame_Impala_-_Currents.png" },
  { id: "39", title: "Lonerism", artist: "Tame Impala", coverArt: "https://upload.wikimedia.org/wikipedia/en/5/57/Tame_Impala_-_Lonerism.png" },
  { id: "40", title: "Innerspeaker", artist: "Tame Impala", coverArt: "https://upload.wikimedia.org/wikipedia/en/8/8a/Tame_Impala_-_Innerspeaker.png" },
  { id: "41", title: "The Slow Rush", artist: "Tame Impala", coverArt: "https://upload.wikimedia.org/wikipedia/en/1/1f/Tame_Impala_-_The_Slow_Rush.png" },
  { id: "42", title: "Kid A", artist: "Radiohead", coverArt: "https://upload.wikimedia.org/wikipedia/en/b/ba/Radioheadokcomputer.png" },
  { id: "43", title: "Amnesiac", artist: "Radiohead", coverArt: "https://upload.wikimedia.org/wikipedia/en/b/ba/Radioheadokcomputer.png" },
  { id: "44", title: "In Rainbows", artist: "Radiohead", coverArt: "https://upload.wikimedia.org/wikipedia/en/b/ba/Radioheadokcomputer.png" },
  { id: "45", title: "A Moon Shaped Pool", artist: "Radiohead", coverArt: "https://upload.wikimedia.org/wikipedia/en/b/ba/Radioheadokcomputer.png" },
  { id: "46", title: "Carrie & Lowell", artist: "Sufjan Stevens", coverArt: "https://upload.wikimedia.org/wikipedia/en/8/8c/Sufjan_Stevens_-_Illinois.jpg" },
  { id: "47", title: "The Age of Adz", artist: "Sufjan Stevens", coverArt: "https://upload.wikimedia.org/wikipedia/en/8/8c/Sufjan_Stevens_-_Illinois.jpg" },
  { id: "48", title: "Reflektor", artist: "Arcade Fire", coverArt: "https://upload.wikimedia.org/wikipedia/en/2/25/Arcade_Fire_-_The_Suburbs.png" },

  // Hip Hop & R&B
  { id: "49", title: "To Pimp A Butterfly", artist: "Kendrick Lamar", coverArt: "https://upload.wikimedia.org/wikipedia/en/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png" },
  { id: "50", title: "My Beautiful Dark Twisted Fantasy", artist: "Kanye West", coverArt: "https://upload.wikimedia.org/wikipedia/en/b/be/MBDTF.png" },
  { id: "51", title: "Good Kid, M.A.A.D City", artist: "Kendrick Lamar", coverArt: "https://upload.wikimedia.org/wikipedia/en/a/a1/Kendrick_Lamar_-_Good_Kid_M.A.A.D_City.png" },
  { id: "52", title: "The College Dropout", artist: "Kanye West", coverArt: "https://upload.wikimedia.org/wikipedia/en/a/a3/Kanyewest_collegedropout.jpg" },
  { id: "53", title: "Channel Orange", artist: "Frank Ocean", coverArt: "https://upload.wikimedia.org/wikipedia/en/2/28/Channel_ORANGE.jpg" },
  { id: "54", title: "Take Care", artist: "Drake", coverArt: "https://upload.wikimedia.org/wikipedia/en/a/ae/Drake_-_Take_Care_cover.jpg" },
  { id: "55", title: "DAMN.", artist: "Kendrick Lamar", coverArt: "https://upload.wikimedia.org/wikipedia/en/5/51/Kendrick_Lamar_-_Damn.png" },
  { id: "56", title: "Mr. Morale & the Big Steppers", artist: "Kendrick Lamar", coverArt: "https://upload.wikimedia.org/wikipedia/en/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png" },
  { id: "57", title: "Late Registration", artist: "Kanye West", coverArt: "https://upload.wikimedia.org/wikipedia/en/a/a3/Kanyewest_collegedropout.jpg" },
  { id: "58", title: "Graduation", artist: "Kanye West", coverArt: "https://upload.wikimedia.org/wikipedia/en/a/a3/Kanyewest_collegedropout.jpg" },
  { id: "59", title: "808s & Heartbreak", artist: "Kanye West", coverArt: "https://upload.wikimedia.org/wikipedia/en/a/a3/Kanyewest_collegedropout.jpg" },
  { id: "60", title: "Yeezus", artist: "Kanye West", coverArt: "https://upload.wikimedia.org/wikipedia/en/a/a3/Kanyewest_collegedropout.jpg" },
  { id: "61", title: "The Life of Pablo", artist: "Kanye West", coverArt: "https://upload.wikimedia.org/wikipedia/en/a/a3/Kanyewest_collegedropout.jpg" },
  { id: "62", title: "Ye", artist: "Kanye West", coverArt: "https://upload.wikimedia.org/wikipedia/en/a/a3/Kanyewest_collegedropout.jpg" },
  { id: "63", title: "Jesus Is King", artist: "Kanye West", coverArt: "https://upload.wikimedia.org/wikipedia/en/a/a3/Kanyewest_collegedropout.jpg" },
  { id: "64", title: "Donda", artist: "Kanye West", coverArt: "https://upload.wikimedia.org/wikipedia/en/a/a3/Kanyewest_collegedropout.jpg" },

  // Electronic & Dance
  { id: "65", title: "Discovery", artist: "Daft Punk", coverArt: "https://upload.wikimedia.org/wikipedia/en/2/27/Daft_Punk_-_Discovery.png" },
  { id: "66", title: "Selected Ambient Works 85-92", artist: "Aphex Twin", coverArt: "https://upload.wikimedia.org/wikipedia/en/8/83/Aphex_Twin_-_Selected_Ambient_Works_85-92.png" },
  { id: "67", title: "Endtroducing.....", artist: "DJ Shadow", coverArt: "https://upload.wikimedia.org/wikipedia/en/9/9e/DJ_Shadow_-_Endtroducing.png" },
  { id: "68", title: "Untrue", artist: "Burial", coverArt: "https://upload.wikimedia.org/wikipedia/en/8/8c/Burial_-_Untrue.png" },
  { id: "69", title: "Music Has the Right to Children", artist: "Boards of Canada", coverArt: "https://upload.wikimedia.org/wikipedia/en/8/8c/Boards_of_Canada_-_Music_Has_the_Right_to_Children.png" },
  { id: "70", title: "Since I Left You", artist: "The Avalanches", coverArt: "https://upload.wikimedia.org/wikipedia/en/4/4c/The_Avalanches_-_Since_I_Left_You.png" },
  { id: "71", title: "Homework", artist: "Daft Punk", coverArt: "https://upload.wikimedia.org/wikipedia/en/2/27/Daft_Punk_-_Discovery.png" },
  { id: "72", title: "Human After All", artist: "Daft Punk", coverArt: "https://upload.wikimedia.org/wikipedia/en/2/27/Daft_Punk_-_Discovery.png" },
  { id: "73", title: "Selected Ambient Works Volume II", artist: "Aphex Twin", coverArt: "https://upload.wikimedia.org/wikipedia/en/8/83/Aphex_Twin_-_Selected_Ambient_Works_85-92.png" },
  { id: "74", title: "Richard D. James Album", artist: "Aphex Twin", coverArt: "https://upload.wikimedia.org/wikipedia/en/8/83/Aphex_Twin_-_Selected_Ambient_Works_85-92.png" },
  { id: "75", title: "Drukqs", artist: "Aphex Twin", coverArt: "https://upload.wikimedia.org/wikipedia/en/8/83/Aphex_Twin_-_Selected_Ambient_Works_85-92.png" },
  { id: "76", title: "Syro", artist: "Aphex Twin", coverArt: "https://upload.wikimedia.org/wikipedia/en/8/83/Aphex_Twin_-_Selected_Ambient_Works_85-92.png" },
  { id: "77", title: "Collapse EP", artist: "Aphex Twin", coverArt: "https://upload.wikimedia.org/wikipedia/en/8/83/Aphex_Twin_-_Selected_Ambient_Works_85-92.png" },
  { id: "78", title: "Black Sands", artist: "Bonobo", coverArt: "https://upload.wikimedia.org/wikipedia/en/8/8c/Boards_of_Canada_-_Music_Has_the_Right_to_Children.png" },
  { id: "79", title: "The North Borders", artist: "Bonobo", coverArt: "https://upload.wikimedia.org/wikipedia/en/8/8c/Boards_of_Canada_-_Music_Has_the_Right_to_Children.png" },
  { id: "80", title: "Migration", artist: "Bonobo", coverArt: "https://upload.wikimedia.org/wikipedia/en/8/8c/Boards_of_Canada_-_Music_Has_the_Right_to_Children.png" },

  // Jazz & Classical
  { id: "81", title: "Kind of Blue", artist: "Miles Davis", coverArt: "https://upload.wikimedia.org/wikipedia/en/9/9c/MilesDavisKindofBlue.jpg" },
  { id: "82", title: "A Love Supreme", artist: "John Coltrane", coverArt: "https://upload.wikimedia.org/wikipedia/en/8/87/John_Coltrane_-_A_Love_Supreme.jpg" },
  { id: "83", title: "Time Out", artist: "The Dave Brubeck Quartet", coverArt: "https://upload.wikimedia.org/wikipedia/en/2/20/Dave_Brubeck_-_Time_Out.jpg" },
  { id: "84", title: "The Köln Concert", artist: "Keith Jarrett", coverArt: "https://upload.wikimedia.org/wikipedia/en/8/8c/Keith_Jarrett_-_The_K%C3%B6ln_Concert.jpg" },
  { id: "85", title: "Bitches Brew", artist: "Miles Davis", coverArt: "https://upload.wikimedia.org/wikipedia/en/9/9c/Miles_Davis_-_Bitches_Brew.jpg" },
  { id: "86", title: "Giant Steps", artist: "John Coltrane", coverArt: "https://upload.wikimedia.org/wikipedia/en/8/8c/John_Coltrane_-_Giant_Steps.jpg" },
  { id: "87", title: "Blue Train", artist: "John Coltrane", coverArt: "https://upload.wikimedia.org/wikipedia/en/8/8c/John_Coltrane_-_Giant_Steps.jpg" },
  { id: "88", title: "Ascension", artist: "John Coltrane", coverArt: "https://upload.wikimedia.org/wikipedia/en/8/8c/John_Coltrane_-_Giant_Steps.jpg" },
  { id: "89", title: "Sketches of Spain", artist: "Miles Davis", coverArt: "https://upload.wikimedia.org/wikipedia/en/9/9c/MilesDavisKindofBlue.jpg" },
  { id: "90", title: "Birth of the Cool", artist: "Miles Davis", coverArt: "https://upload.wikimedia.org/wikipedia/en/9/9c/MilesDavisKindofBlue.jpg" },
  { id: "91", title: "Round About Midnight", artist: "Miles Davis", coverArt: "https://upload.wikimedia.org/wikipedia/en/9/9c/MilesDavisKindofBlue.jpg" },
  { id: "92", title: "Miles Ahead", artist: "Miles Davis", coverArt: "https://upload.wikimedia.org/wikipedia/en/9/9c/MilesDavisKindofBlue.jpg" },
  { id: "93", title: "Porgy and Bess", artist: "Miles Davis", coverArt: "https://upload.wikimedia.org/wikipedia/en/9/9c/MilesDavisKindofBlue.jpg" },
  { id: "94", title: "Milestones", artist: "Miles Davis", coverArt: "https://upload.wikimedia.org/wikipedia/en/9/9c/MilesDavisKindofBlue.jpg" },
  { id: "95", title: "Someday My Prince Will Come", artist: "Miles Davis", coverArt: "https://upload.wikimedia.org/wikipedia/en/9/9c/MilesDavisKindofBlue.jpg" },
  { id: "96", title: "Seven Steps to Heaven", artist: "Miles Davis", coverArt: "https://upload.wikimedia.org/wikipedia/en/9/9c/MilesDavisKindofBlue.jpg" },

  // Additional Rock & Metal
  { id: "97", title: "Master of Puppets", artist: "Metallica", coverArt: "https://upload.wikimedia.org/wikipedia/en/b/b2/Metallica_-_Master_of_Puppets_cover.jpg" },
  { id: "98", title: "Ride the Lightning", artist: "Metallica", coverArt: "https://upload.wikimedia.org/wikipedia/en/f/f4/Metallica_-_Ride_the_Lightning_cover.jpg" },
  { id: "99", title: "The Black Album", artist: "Metallica", coverArt: "https://upload.wikimedia.org/wikipedia/en/d/dc/Metallica_-_Metallica_cover.jpg" },
  { id: "100", title: "Appetite for Destruction", artist: "Guns N' Roses", coverArt: "https://upload.wikimedia.org/wikipedia/en/6/69/GunsNRosesAppetiteforDestructionalbumcover.jpg" },
  { id: "101", title: "Use Your Illusion I", artist: "Guns N' Roses", coverArt: "https://upload.wikimedia.org/wikipedia/en/6/69/GunsNRosesAppetiteforDestructionalbumcover.jpg" },
  { id: "102", title: "Use Your Illusion II", artist: "Guns N' Roses", coverArt: "https://upload.wikimedia.org/wikipedia/en/6/69/GunsNRosesAppetiteforDestructionalbumcover.jpg" },
  { id: "103", title: "Ten", artist: "Pearl Jam", coverArt: "https://upload.wikimedia.org/wikipedia/en/2/2d/Pearl_Jam_-_Ten.jpg" },
  { id: "104", title: "Vs.", artist: "Pearl Jam", coverArt: "https://upload.wikimedia.org/wikipedia/en/2/2d/Pearl_Jam_-_Ten.jpg" },
  { id: "105", title: "Vitalogy", artist: "Pearl Jam", coverArt: "https://upload.wikimedia.org/wikipedia/en/2/2d/Pearl_Jam_-_Ten.jpg" },
  { id: "106", title: "Superunknown", artist: "Soundgarden", coverArt: "https://upload.wikimedia.org/wikipedia/en/3/3b/Soundgarden_-_Superunknown.jpg" },
  { id: "107", title: "Badmotorfinger", artist: "Soundgarden", coverArt: "https://upload.wikimedia.org/wikipedia/en/3/3b/Soundgarden_-_Superunknown.jpg" },
  { id: "108", title: "Dirt", artist: "Alice in Chains", coverArt: "https://upload.wikimedia.org/wikipedia/en/3/3b/Soundgarden_-_Superunknown.jpg" },
  { id: "109", title: "Facelift", artist: "Alice in Chains", coverArt: "https://upload.wikimedia.org/wikipedia/en/3/3b/Soundgarden_-_Superunknown.jpg" },
  { id: "110", title: "Jar of Flies", artist: "Alice in Chains", coverArt: "https://upload.wikimedia.org/wikipedia/en/3/3b/Soundgarden_-_Superunknown.jpg" },
  { id: "111", title: "Core", artist: "Stone Temple Pilots", coverArt: "https://upload.wikimedia.org/wikipedia/en/3/3b/Soundgarden_-_Superunknown.jpg" },
  { id: "112", title: "Purple", artist: "Stone Temple Pilots", coverArt: "https://upload.wikimedia.org/wikipedia/en/3/3b/Soundgarden_-_Superunknown.jpg" },

  // Additional Pop & Contemporary
  { id: "113", title: "Like a Prayer", artist: "Madonna", coverArt: "https://upload.wikimedia.org/wikipedia/en/3/3c/Madonna_-_Like_a_Prayer.png" },
  { id: "114", title: "Ray of Light", artist: "Madonna", coverArt: "https://upload.wikimedia.org/wikipedia/en/3/3c/Madonna_-_Like_a_Prayer.png" },
  { id: "115", title: "Confessions on a Dance Floor", artist: "Madonna", coverArt: "https://upload.wikimedia.org/wikipedia/en/3/3c/Madonna_-_Like_a_Prayer.png" },
  { id: "116", title: "Like a Virgin", artist: "Madonna", coverArt: "https://upload.wikimedia.org/wikipedia/en/3/3c/Madonna_-_Like_a_Prayer.png" },
  { id: "117", title: "True Blue", artist: "Madonna", coverArt: "https://upload.wikimedia.org/wikipedia/en/3/3c/Madonna_-_Like_a_Prayer.png" },
  { id: "118", title: "Erotica", artist: "Madonna", coverArt: "https://upload.wikimedia.org/wikipedia/en/3/3c/Madonna_-_Like_a_Prayer.png" },
  { id: "119", title: "Bedtime Stories", artist: "Madonna", coverArt: "https://upload.wikimedia.org/wikipedia/en/3/3c/Madonna_-_Like_a_Prayer.png" },
  { id: "120", title: "Music", artist: "Madonna", coverArt: "https://upload.wikimedia.org/wikipedia/en/3/3c/Madonna_-_Like_a_Prayer.png" },
  { id: "121", title: "American Life", artist: "Madonna", coverArt: "https://upload.wikimedia.org/wikipedia/en/3/3c/Madonna_-_Like_a_Prayer.png" },
  { id: "122", title: "Hard Candy", artist: "Madonna", coverArt: "https://upload.wikimedia.org/wikipedia/en/3/3c/Madonna_-_Like_a_Prayer.png" },
  { id: "123", title: "MDNA", artist: "Madonna", coverArt: "https://upload.wikimedia.org/wikipedia/en/3/3c/Madonna_-_Like_a_Prayer.png" },
  { id: "124", title: "Rebel Heart", artist: "Madonna", coverArt: "https://upload.wikimedia.org/wikipedia/en/3/3c/Madonna_-_Like_a_Prayer.png" },
  { id: "125", title: "Madame X", artist: "Madonna", coverArt: "https://upload.wikimedia.org/wikipedia/en/3/3c/Madonna_-_Like_a_Prayer.png" },
  { id: "126", title: "Finally Enough Love", artist: "Madonna", coverArt: "https://upload.wikimedia.org/wikipedia/en/3/3c/Madonna_-_Like_a_Prayer.png" },
  { id: "127", title: "Celebration", artist: "Madonna", coverArt: "https://upload.wikimedia.org/wikipedia/en/3/3c/Madonna_-_Like_a_Prayer.png" },
  { id: "128", title: "The Immaculate Collection", artist: "Madonna", coverArt: "https://upload.wikimedia.org/wikipedia/en/3/3c/Madonna_-_Like_a_Prayer.png" },

  // Additional Rock Classics
  { id: "129", title: "Led Zeppelin IV", artist: "Led Zeppelin", coverArt: "https://upload.wikimedia.org/wikipedia/en/2/26/Led_Zeppelin_-_Led_Zeppelin_IV.jpg" },
  { id: "130", title: "Physical Graffiti", artist: "Led Zeppelin", coverArt: "https://upload.wikimedia.org/wikipedia/en/2/26/Led_Zeppelin_-_Led_Zeppelin_IV.jpg" },
  { id: "131", title: "Houses of the Holy", artist: "Led Zeppelin", coverArt: "https://upload.wikimedia.org/wikipedia/en/2/26/Led_Zeppelin_-_Led_Zeppelin_IV.jpg" },
  { id: "132", title: "Led Zeppelin II", artist: "Led Zeppelin", coverArt: "https://upload.wikimedia.org/wikipedia/en/2/26/Led_Zeppelin_-_Led_Zeppelin_IV.jpg" },
  { id: "133", title: "Led Zeppelin III", artist: "Led Zeppelin", coverArt: "https://upload.wikimedia.org/wikipedia/en/2/26/Led_Zeppelin_-_Led_Zeppelin_IV.jpg" },
  { id: "134", title: "Presence", artist: "Led Zeppelin", coverArt: "https://upload.wikimedia.org/wikipedia/en/2/26/Led_Zeppelin_-_Led_Zeppelin_IV.jpg" },
  { id: "135", title: "In Through the Out Door", artist: "Led Zeppelin", coverArt: "https://upload.wikimedia.org/wikipedia/en/2/26/Led_Zeppelin_-_Led_Zeppelin_IV.jpg" },
  { id: "136", title: "Coda", artist: "Led Zeppelin", coverArt: "https://upload.wikimedia.org/wikipedia/en/2/26/Led_Zeppelin_-_Led_Zeppelin_IV.jpg" },

  // Pink Floyd Albums
  { id: "137", title: "The Dark Side of the Moon", artist: "Pink Floyd", coverArt: "https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png" },
  { id: "138", title: "The Wall", artist: "Pink Floyd", coverArt: "https://upload.wikimedia.org/wikipedia/en/0/0f/Pink_Floyd_-_The_Wall.jpg" },
  { id: "139", title: "Wish You Were Here", artist: "Pink Floyd", coverArt: "https://upload.wikimedia.org/wikipedia/en/7/74/Pink_Floyd_-_Wish_You_Were_Here.jpg" },
  { id: "140", title: "Animals", artist: "Pink Floyd", coverArt: "https://upload.wikimedia.org/wikipedia/en/7/74/Pink_Floyd_-_Wish_You_Were_Here.jpg" },
  { id: "141", title: "Meddle", artist: "Pink Floyd", coverArt: "https://upload.wikimedia.org/wikipedia/en/7/74/Pink_Floyd_-_Wish_You_Were_Here.jpg" },
  { id: "142", title: "Atom Heart Mother", artist: "Pink Floyd", coverArt: "https://upload.wikimedia.org/wikipedia/en/7/74/Pink_Floyd_-_Wish_You_Were_Here.jpg" },
  { id: "143", title: "Ummagumma", artist: "Pink Floyd", coverArt: "https://upload.wikimedia.org/wikipedia/en/7/74/Pink_Floyd_-_Wish_You_Were_Here.jpg" },
  { id: "144", title: "A Saucerful of Secrets", artist: "Pink Floyd", coverArt: "https://upload.wikimedia.org/wikipedia/en/7/74/Pink_Floyd_-_Wish_You_Were_Here.jpg" },

  // The Beatles Albums
  { id: "145", title: "Abbey Road", artist: "The Beatles", coverArt: "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg" },
  { id: "146", title: "Sgt. Pepper's Lonely Hearts Club Band", artist: "The Beatles", coverArt: "https://upload.wikimedia.org/wikipedia/en/5/50/Sgt._Pepper%27s_Lonely_Hearts_Club_Band.jpg" },
  { id: "147", title: "The White Album", artist: "The Beatles", coverArt: "https://upload.wikimedia.org/wikipedia/en/5/50/Sgt._Pepper%27s_Lonely_Hearts_Club_Band.jpg" },
  { id: "148", title: "Revolver", artist: "The Beatles", coverArt: "https://upload.wikimedia.org/wikipedia/en/5/50/Sgt._Pepper%27s_Lonely_Hearts_Club_Band.jpg" },
  { id: "149", title: "Rubber Soul", artist: "The Beatles", coverArt: "https://upload.wikimedia.org/wikipedia/en/5/50/Sgt._Pepper%27s_Lonely_Hearts_Club_Band.jpg" },
  { id: "150", title: "Help!", artist: "The Beatles", coverArt: "https://upload.wikimedia.org/wikipedia/en/5/50/Sgt._Pepper%27s_Lonely_Hearts_Club_Band.jpg" },
  { id: "151", title: "A Hard Day's Night", artist: "The Beatles", coverArt: "https://upload.wikimedia.org/wikipedia/en/5/50/Sgt._Pepper%27s_Lonely_Hearts_Club_Band.jpg" },
  { id: "152", title: "Please Please Me", artist: "The Beatles", coverArt: "https://upload.wikimedia.org/wikipedia/en/5/50/Sgt._Pepper%27s_Lonely_Hearts_Club_Band.jpg" },

  // Queen Albums
  { id: "153", title: "A Night at the Opera", artist: "Queen", coverArt: "https://upload.wikimedia.org/wikipedia/en/4/4d/Queen_A_Night_At_The_Opera.png" },
  { id: "154", title: "A Day at the Races", artist: "Queen", coverArt: "https://upload.wikimedia.org/wikipedia/en/4/4d/Queen_A_Night_At_The_Opera.png" },
  { id: "155", title: "News of the World", artist: "Queen", coverArt: "https://upload.wikimedia.org/wikipedia/en/4/4d/Queen_A_Night_At_The_Opera.png" },
  { id: "156", title: "Jazz", artist: "Queen", coverArt: "https://upload.wikimedia.org/wikipedia/en/4/4d/Queen_A_Night_At_The_Opera.png" },
  { id: "157", title: "The Game", artist: "Queen", coverArt: "https://upload.wikimedia.org/wikipedia/en/4/4d/Queen_A_Night_At_The_Opera.png" },
  { id: "158", title: "Hot Space", artist: "Queen", coverArt: "https://upload.wikimedia.org/wikipedia/en/4/4d/Queen_A_Night_At_The_Opera.png" },
  { id: "159", title: "The Works", artist: "Queen", coverArt: "https://upload.wikimedia.org/wikipedia/en/4/4d/Queen_A_Night_At_The_Opera.png" },
  { id: "160", title: "A Kind of Magic", artist: "Queen", coverArt: "https://upload.wikimedia.org/wikipedia/en/4/4d/Queen_A_Night_At_The_Opera.png" }
];

// Interface for pagination
export interface PaginatedResponse {
  albums: Album[];
  hasMore: boolean;
  total: number;
  page: number;
}

// Mock search function with pagination for infinite scroll
export const mockSearchAlbums = async (query: string, page: number = 1, limit: number = 12): Promise<PaginatedResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
  

  if (!query.trim()) {
    return {
      albums: [],
      hasMore: false,
      total: 0,
      page
    };
  }

  const searchTerm = query.toLowerCase();
  
  // Filter albums by title or artist
  const allResults = mockAlbumsDatabase.filter(album => 
    album.title.toLowerCase().includes(searchTerm) ||
    album.artist.toLowerCase().includes(searchTerm)
  );


  // Add some randomness to make it feel more realistic
  let results = allResults;
  if (Math.random() > 0.8) {
    // Sometimes return fewer results to simulate different search scenarios
    results = allResults.slice(0, Math.floor(allResults.length * 0.7));
  }

  // Calculate pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedResults = results.slice(startIndex, endIndex);
  const hasMore = endIndex < results.length;

  return {
    albums: paginatedResults,
    hasMore,
    total: results.length,
    page
  };
};

// Mock function to get random albums for suggestions
export const mockGetRandomAlbums = async (count: number = 8): Promise<Album[]> => {
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));
  
  const shuffled = [...mockAlbumsDatabase].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Mock function to get trending albums
export const mockGetTrendingAlbums = async (): Promise<Album[]> => {
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 300));
  
  // Return a curated list of "trending" albums
  const trendingIds = ["17", "18", "49", "33", "65", "81", "1", "5"];
  return mockAlbumsDatabase.filter(album => trendingIds.includes(album.id));
};

// Mock function to get album by ID
export const mockGetAlbumById = async (id: string): Promise<Album | null> => {
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 100));
  
  return mockAlbumsDatabase.find(album => album.id === id) || null;
};

// Mock function to get all albums with pagination for infinite scroll
export const mockGetAllAlbums = async (page: number = 1, limit: number = 12): Promise<PaginatedResponse> => {
  await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 200));
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedResults = mockAlbumsDatabase.slice(startIndex, endIndex);
  const hasMore = endIndex < mockAlbumsDatabase.length;

  return {
    albums: paginatedResults,
    hasMore,
    total: mockAlbumsDatabase.length,
    page
  };
}; 