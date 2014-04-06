(function () {
    'use strict';

    var serviceId = 'mockTipsService';

    angular.module('app')
        .factory(serviceId, [mockTipsService]);

    function mockTipsService() {
        var service = {
            getAllParks: getAllParks
        };

        return service;

        function getAllParks() {
            return
                [
                    {
                        "Name": "Disneyland Park",
                        "ShortName": "DL",
                        "Attraction": [
                            {
                                "Id": "924",
                                "Name": "Star Tours - The Adventures Continue",
                                "Status": "Operating",
                                "StandbyWaitTime": "20",
                                "FPDistributionTime": "12:40pm - 1:40pm"
                            },
                            {
                                "Id": "933",
                                "Name": "Finding Nemo Submarine Voyage",
                                "Status": "Closed",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "939",
                                "Name": "\"Captain EO\"",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "903",
                                "Name": "Autopia",
                                "Status": "Operating",
                                "StandbyWaitTime": "25",
                                "FPDistributionTime": "FASTPASS is Not Available"
                            },
                            {
                                "Id": "905",
                                "Name": "Buzz Lightyear Astro Blasters",
                                "Status": "Operating",
                                "StandbyWaitTime": "10",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "908",
                                "Name": "Space Mountain",
                                "Status": "Operating",
                                "StandbyWaitTime": "15",
                                "FPDistributionTime": "11:45am - 12:45pm"
                            },
                            {
                                "Id": "918",
                                "Name": "Astro Orbitor",
                                "Status": "Operating",
                                "StandbyWaitTime": "5",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "919",
                                "Name": "Disneyland® Monorail",
                                "Status": "Operating",
                                "StandbyWaitTime": "5",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "1426",
                                "Name": "Big Thunder Ranch Petting Farm",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "941",
                                "Name": "Mark Twain Riverboat",
                                "Status": "Operating",
                                "StandbyWaitTime": "10",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "942",
                                "Name": "Sailing Ship Columbia",
                                "Status": "Closed",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "943",
                                "Name": "Pirate's Lair on Tom Sawyer Island",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "904",
                                "Name": "Big Thunder Mountain Railroad",
                                "Status": "Closed",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "938",
                                "Name": "Enchanted Tiki Room",
                                "Status": "Operating",
                                "StandbyWaitTime": "5",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "950",
                                "Name": "Tarzan's Treehouse",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "906",
                                "Name": "Indiana Jones Adventure",
                                "Status": "Operating",
                                "StandbyWaitTime": "10",
                                "FPDistributionTime": "12:05pm - 1:05pm"
                            },
                            {
                                "Id": "921",
                                "Name": "Jungle Cruise",
                                "Status": "Operating",
                                "StandbyWaitTime": "20",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "1452",
                                "Name": "Meet Minnie at Her House",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "935",
                                "Name": "Mickey's House and Meet Mickey",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "907",
                                "Name": "Roger Rabbit's Car Toon Spin",
                                "Status": "Operating",
                                "StandbyWaitTime": "10",
                                "FPDistributionTime": "11:45am - 12:45pm"
                            },
                            {
                                "Id": "920",
                                "Name": "Gadget's Go Coaster",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "1453",
                                "Name": "Winnie The Pooh and Friends Meet and Greet",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "926",
                                "Name": "The Many Adventures of Winnie the Pooh",
                                "Status": "Operating",
                                "StandbyWaitTime": "5",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "928",
                                "Name": "Davy Crockett's Explorer Canoes",
                                "Status": "Closed",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "909",
                                "Name": "Splash Mountain",
                                "Status": "Closed",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": "11:45am - 12:45pm"
                            },
                            {
                                "Id": "937",
                                "Name": "Pirates of the Caribbean",
                                "Status": "Operating",
                                "StandbyWaitTime": "10",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "915",
                                "Name": "Haunted Mansion",
                                "Status": "Operating",
                                "StandbyWaitTime": "5",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "1427",
                                "Name": "Pixie Hollow",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "1443",
                                "Name": "Meet the Disney Princesses at the Royal Hall",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "1507",
                                "Name": "Mickey and the Magical Map",
                                "Status": "Closed",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "925",
                                "Name": "Storybook Land Canal Boats",
                                "Status": "Operating",
                                "StandbyWaitTime": "25",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "927",
                                "Name": "Casey Jr. Circus Train",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "929",
                                "Name": "King Arthur Carrousel",
                                "Status": "Operating",
                                "StandbyWaitTime": "5",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "930",
                                "Name": "Pinocchio's Daring Journey",
                                "Status": "Operating",
                                "StandbyWaitTime": "5",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "931",
                                "Name": "Snow White's Scary Adventures",
                                "Status": "Operating",
                                "StandbyWaitTime": "5",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "932",
                                "Name": "Dumbo the Flying Elephant",
                                "Status": "Operating",
                                "StandbyWaitTime": "25",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "934",
                                "Name": "Matterhorn Bobsleds",
                                "Status": "Operating",
                                "StandbyWaitTime": "40",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "936",
                                "Name": "Peter Pan's Flight",
                                "Status": "Operating",
                                "StandbyWaitTime": "35",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "916",
                                "Name": "\"it's a small world\"",
                                "Status": "Closed",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "917",
                                "Name": "Alice in Wonderland",
                                "Status": "Operating",
                                "StandbyWaitTime": "30",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "922",
                                "Name": "Mad Tea Party",
                                "Status": "Operating",
                                "StandbyWaitTime": "5",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "923",
                                "Name": "Mr. Toad's Wild Ride",
                                "Status": "Operating",
                                "StandbyWaitTime": "10",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "944",
                                "Name": "Disneyland Railroad - Main Street, U.S.A.",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "945",
                                "Name": "Fire Engine, presented by National Car Rental",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "946",
                                "Name": "Horse-Drawn Streetcars, presented by National Car Rental",
                                "Status": "Down",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "947",
                                "Name": "Horseless Carriage, presented by National Car Rental",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "948",
                                "Name": "Main Street Cinema",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "949",
                                "Name": "Omnibus, presented by National Car Rental",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "978",
                                "Name": "Disneyland Railroad - New Orleans Square",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "979",
                                "Name": "Disneyland Railroad - Mickey's Toontown",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "980",
                                "Name": "Disneyland Railroad: Tomorrowland Station",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            }
                        ]
                    },
                    {
                        "Name": "Disney California Adventure Park",
                        "ShortName": "CA",
                        "Attraction": [
                            {
                                "Id": "1123",
                                "Name": "The Little Mermaid - Ariel's Undersea Adventure",
                                "Status": "Operating",
                                "StandbyWaitTime": "5",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "1455",
                                "Name": "Character Greetings at Paradise Pier",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "1469",
                                "Name": "Mickey's Fun Wheel",
                                "Status": "See Times Guide",
                                "StandbyWaitTime": "5",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "1489",
                                "Name": "Duffy M&G at Paradise Pier",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "953",
                                "Name": "Silly Symphony Swings",
                                "Status": "Operating",
                                "StandbyWaitTime": "5",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "954",
                                "Name": "Golden Zephyr",
                                "Status": "Operating",
                                "StandbyWaitTime": "5",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "955",
                                "Name": "Jumpin' Jellyfish",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "956",
                                "Name": "King Triton's Carousel",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "959",
                                "Name": "Toy Story Midway Mania!",
                                "Status": "Operating",
                                "StandbyWaitTime": "30",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "910",
                                "Name": "California Screamin'",
                                "Status": "Operating",
                                "StandbyWaitTime": "10",
                                "FPDistributionTime": "11:45am - 12:45pm"
                            },
                            {
                                "Id": "912",
                                "Name": "Goofy's Sky School",
                                "Status": "Operating",
                                "StandbyWaitTime": "5",
                                "FPDistributionTime": "11:45am - 12:45pm"
                            },
                            {
                                "Id": "1868",
                                "Name": "Cable Slides inside RCCT",
                                "Status": "Closed",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "967",
                                "Name": "Redwood Creek Challenge Trail",
                                "Status": "Closed",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "911",
                                "Name": "Grizzly River Run",
                                "Status": "Operating",
                                "StandbyWaitTime": "5",
                                "FPDistributionTime": "11:45am - 12:45pm"
                            },
                            {
                                "Id": "1124",
                                "Name": "Disney Animation",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "957",
                                "Name": "Monsters, Inc. Mike & Sulley to the Rescue!",
                                "Status": "Operating",
                                "StandbyWaitTime": "5",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "960",
                                "Name": "Animation Academy",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "961",
                                "Name": "Muppet*Vision 3D",
                                "Status": "Operating",
                                "StandbyWaitTime": "5",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "962",
                                "Name": "Turtle Talk With Crush",
                                "Status": "Operating",
                                "StandbyWaitTime": "5",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "963",
                                "Name": "Disney Junior - Live on Stage!",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "964",
                                "Name": "Hyperion Theater",
                                "Status": "Closed",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "968",
                                "Name": "Sorcerer's Workshop",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "914",
                                "Name": "The Twilight Zone Tower of Terror™",
                                "Status": "Operating",
                                "StandbyWaitTime": "13",
                                "FPDistributionTime": "11:45am - 12:45pm"
                            },
                            {
                                "Id": "969",
                                "Name": "Flik's Flyers",
                                "Status": "Operating",
                                "StandbyWaitTime": "5",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "970",
                                "Name": "Francis' Ladybug Boogie",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "971",
                                "Name": "Heimlich's Chew Chew Train",
                                "Status": "Operating",
                                "StandbyWaitTime": "5",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "972",
                                "Name": "Tuck and Roll's Drive'Em Buggies",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "973",
                                "Name": "It's Tough to be a Bug!",
                                "Status": "Operating",
                                "StandbyWaitTime": "5",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "1456",
                                "Name": "Character Greetings at Condor Flats",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "913",
                                "Name": "Soarin' Over California",
                                "Status": "Operating",
                                "StandbyWaitTime": "45",
                                "FPDistributionTime": "12:45pm - 1:45pm"
                            },
                            {
                                "Id": "1145",
                                "Name": "Luigi's Flying Tires, presented by Alamo",
                                "Status": "Operating",
                                "StandbyWaitTime": "15",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "1148",
                                "Name": "Radiator Springs Racers",
                                "Status": "Operating",
                                "StandbyWaitTime": "45",
                                "FPDistributionTime": "5:25pm - 6:25pm"
                            },
                            {
                                "Id": "1147",
                                "Name": "Mater's Junkyard Jamboree",
                                "Status": "Operating",
                                "StandbyWaitTime": "60",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "1454",
                                "Name": "Stars of Cars in Cars Land Meet and Greet",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "966",
                                "Name": "Blue Sky Cellar",
                                "Status": "Closed",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            }
                        ]
                    },
                    {
                        "Name": "Magic Kingdom Park",
                        "ShortName": "MK",
                        "Attraction": [
                            {
                                "Id": "1121",
                                "Name": "Backstage Magic With Mickey Mouse",
                                "Status": "Operating",
                                "StandbyWaitTime": "15",
                                "FPDistributionTime": "FASTPASS is Not Available"
                            },
                            {
                                "Id": "1177",
                                "Name": "Sorcerers of the Magic Kingdom",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "301",
                                "Name": "Big Thunder Mountain Railroad",
                                "Status": "Operating",
                                "StandbyWaitTime": "30",
                                "FPDistributionTime": "FASTPASS is Not Available"
                            },
                            {
                                "Id": "263",
                                "Name": "Country Bear Jamboree",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "302",
                                "Name": "Splash Mountain",
                                "Status": "Closed",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": "FASTPASS is Not Available"
                            },
                            {
                                "Id": "300",
                                "Name": "Tom Sawyer Island",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "1185",
                                "Name": "Enchanted Tales with Belle",
                                "Status": "Operating",
                                "StandbyWaitTime": "60",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "1183",
                                "Name": "Under the Sea - Journey of The Little Mermaid",
                                "Status": "Operating",
                                "StandbyWaitTime": "35",
                                "FPDistributionTime": "FASTPASS is Not Available"
                            },
                            {
                                "Id": "1187",
                                "Name": "Ariel's Meet & Greet",
                                "Status": "Operating",
                                "StandbyWaitTime": "40",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "1518",
                                "Name": "Meet Cinderella and a Princess Friend at Princess Fairytale",
                                "Status": "Operating",
                                "StandbyWaitTime": "30",
                                "FPDistributionTime": "FASTPASS is Not Available"
                            },
                            {
                                "Id": "1517",
                                "Name": "Meet Rapunzel and a Princess Friend at Princess Fairytale Hall",
                                "Status": "Operating",
                                "StandbyWaitTime": "85",
                                "FPDistributionTime": "FASTPASS is Not Available"
                            },
                            {
                                "Id": "290",
                                "Name": "Prince Charming Regal Carrousel",
                                "Status": "Operating",
                                "StandbyWaitTime": "0",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "291",
                                "Name": "\"it's a small world\"",
                                "Status": "Operating",
                                "StandbyWaitTime": "15",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "299",
                                "Name": "Mickey's PhilharMagic",
                                "Status": "Operating",
                                "StandbyWaitTime": "5",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "295",
                                "Name": "Mad Tea Party",
                                "Status": "Operating",
                                "StandbyWaitTime": "10",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "296",
                                "Name": "The Many Adventures of Winnie the Pooh",
                                "Status": "Down",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": "FASTPASS is Not Available"
                            },
                            {
                                "Id": "294",
                                "Name": "Peter Pan's Flight",
                                "Status": "Operating",
                                "StandbyWaitTime": "60",
                                "FPDistributionTime": "FASTPASS is Not Available"
                            },
                            {
                                "Id": "1127",
                                "Name": "MK Fairies Meet and Greet at Veranda",
                                "Status": "Operating",
                                "StandbyWaitTime": "10",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "1477",
                                "Name": "A Pirate's Adventure - Treasures of the Seven Seas",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "286",
                                "Name": "The Magic Carpets of Aladdin",
                                "Status": "Operating",
                                "StandbyWaitTime": "20",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "287",
                                "Name": "Walt Disney's Enchanted Tiki Room",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "285",
                                "Name": "Pirates of the Caribbean",
                                "Status": "Operating",
                                "StandbyWaitTime": "20",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "284",
                                "Name": "Jungle Cruise",
                                "Status": "Operating",
                                "StandbyWaitTime": "35",
                                "FPDistributionTime": "FASTPASS is Not Available"
                            },
                            {
                                "Id": "283",
                                "Name": "Swiss Family Treehouse",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "304",
                                "Name": "Haunted Mansion",
                                "Status": "Operating",
                                "StandbyWaitTime": "20",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "305",
                                "Name": "Liberty Square Riverboat",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "306",
                                "Name": "The Hall of Presidents",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "327",
                                "Name": "Buzz Lightyear's Space Ranger Spin",
                                "Status": "Operating",
                                "StandbyWaitTime": "25",
                                "FPDistributionTime": "FASTPASS is Not Available"
                            },
                            {
                                "Id": "329",
                                "Name": "Stitch's Great Escape!",
                                "Status": "Operating",
                                "StandbyWaitTime": "10",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "324",
                                "Name": "Astro Orbiter",
                                "Status": "Operating",
                                "StandbyWaitTime": "20",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "328",
                                "Name": "Walt Disney's Carousel of Progress",
                                "Status": "Operating",
                                "StandbyWaitTime": "5",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "322",
                                "Name": "Tomorrowland Speedway",
                                "Status": "Operating",
                                "StandbyWaitTime": "20",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "323",
                                "Name": "Space Mountain",
                                "Status": "Operating",
                                "StandbyWaitTime": "30",
                                "FPDistributionTime": "FASTPASS is Not Available"
                            },
                            {
                                "Id": "330",
                                "Name": "Monsters, Inc. Laugh Floor",
                                "Status": "Operating",
                                "StandbyWaitTime": "10",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "325",
                                "Name": "Tomorrowland Transit Authority PeopleMover",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "320",
                                "Name": "The Barnstormer",
                                "Status": "Operating",
                                "StandbyWaitTime": "30",
                                "FPDistributionTime": "FASTPASS is Not Available"
                            },
                            {
                                "Id": "1180",
                                "Name": "Dumbo the Flying Elephant",
                                "Status": "Operating",
                                "StandbyWaitTime": "40",
                                "FPDistributionTime": "FASTPASS is Not Available"
                            },
                            {
                                "Id": "1348",
                                "Name": "Pete’s Silly Sideshow – Goofy/Donald",
                                "Status": "Operating",
                                "StandbyWaitTime": "20",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "1347",
                                "Name": "Pete’s Silly Sideshow – Minnie/Daisy",
                                "Status": "Operating",
                                "StandbyWaitTime": "20",
                                "FPDistributionTime": []
                            }
                        ]
                    },
                    {
                        "Name": "Epcot",
                        "ShortName": "EC",
                        "Attraction": [
                            {
                                "Id": "135",
                                "Name": "The American Adventure",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "262",
                                "Name": "Impressions de France",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "338",
                                "Name": "Gran Fiesta Tour Starring The Three Caballeros",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "340",
                                "Name": "Maelstrom",
                                "Status": "Operating",
                                "StandbyWaitTime": "20",
                                "FPDistributionTime": "FASTPASS is Not Available"
                            },
                            {
                                "Id": "153",
                                "Name": "O Canada!",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "156",
                                "Name": "Reflections of China",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "360",
                                "Name": "Test Track Presented by Chevrolet",
                                "Status": "Operating",
                                "StandbyWaitTime": "30",
                                "FPDistributionTime": "FASTPASS is Not Available"
                            },
                            {
                                "Id": "782",
                                "Name": "Mission:Space - Orange",
                                "Status": "Operating",
                                "StandbyWaitTime": "10",
                                "FPDistributionTime": "FASTPASS is Not Available"
                            },
                            {
                                "Id": "974",
                                "Name": "The Sum of All Thrills",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "275",
                                "Name": "Soarin'",
                                "Status": "Operating",
                                "StandbyWaitTime": "50",
                                "FPDistributionTime": "FASTPASS is Not Available"
                            },
                            {
                                "Id": "282",
                                "Name": "Turtle Talk With Crush",
                                "Status": "Operating",
                                "StandbyWaitTime": "10",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "871",
                                "Name": "Epcot Character Spot",
                                "Status": "Operating",
                                "StandbyWaitTime": "5",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "276",
                                "Name": "The Circle of Life",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "270",
                                "Name": "Captain EO",
                                "Status": "Operating",
                                "StandbyWaitTime": "5",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "267",
                                "Name": "Journey Into Imagination With Figment",
                                "Status": "Operating",
                                "StandbyWaitTime": "5",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "274",
                                "Name": "Living with the Land",
                                "Status": "Operating",
                                "StandbyWaitTime": "10",
                                "FPDistributionTime": "FASTPASS is Not Available"
                            },
                            {
                                "Id": "343",
                                "Name": "Spaceship Earth",
                                "Status": "Operating",
                                "StandbyWaitTime": "5",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "281",
                                "Name": "The Seas with Nemo & Friends",
                                "Status": "Operating",
                                "StandbyWaitTime": "10",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "361",
                                "Name": "Ellen's Energy Adventure",
                                "Status": "Operating",
                                "StandbyWaitTime": "10",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "879",
                                "Name": "Mission:Space - Green",
                                "Status": "Operating",
                                "StandbyWaitTime": "5",
                                "FPDistributionTime": []
                            }
                        ]
                    },
                    {
                        "Name": "Disney's Hollywood Studios",
                        "ShortName": "ST",
                        "Attraction": [
                            {
                                "Id": "184",
                                "Name": "Walt Disney: One Man's Dream",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "1150",
                                "Name": "Holiday Comedy Improv",
                                "Status": "Closed",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "190",
                                "Name": "Lights, Motors, Action! Extreme Stunt Show",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "188",
                                "Name": "Honey, I Shrunk the Kids Movie Set Adventure",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "189",
                                "Name": "Studio Backlot Tour",
                                "Status": "Closed",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "191",
                                "Name": "Muppet*Vision 3D",
                                "Status": "Operating",
                                "StandbyWaitTime": "5",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "179",
                                "Name": "Disney Junior-Live on Stage!",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "177",
                                "Name": "The Magic of Disney Animation",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "178",
                                "Name": "Voyage of The Little Mermaid",
                                "Status": "Operating",
                                "StandbyWaitTime": "0",
                                "FPDistributionTime": "FASTPASS is Not Available"
                            },
                            {
                                "Id": "187",
                                "Name": "Toy Story Mania!",
                                "Status": "Operating",
                                "StandbyWaitTime": "50",
                                "FPDistributionTime": "FASTPASS is Not Available"
                            },
                            {
                                "Id": "193",
                                "Name": "Rock 'n' Roller Coaster Starring Aerosmith",
                                "Status": "Operating",
                                "StandbyWaitTime": "30",
                                "FPDistributionTime": "FASTPASS is Not Available"
                            },
                            {
                                "Id": "358",
                                "Name": "Beauty and the Beast-Live on Stage",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "192",
                                "Name": "The Twilight Zone Tower of Terror",
                                "Status": "Operating",
                                "StandbyWaitTime": "10",
                                "FPDistributionTime": "FASTPASS is Not Available"
                            },
                            {
                                "Id": "740",
                                "Name": "Fantasmic!",
                                "Status": "Closed",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "1076",
                                "Name": "Holiday Movies Shown Continously",
                                "Status": "Closed",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "1511",
                                "Name": "Lone Ranger Sneak Preview",
                                "Status": "Closed",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "261",
                                "Name": "Indiana Jones Epic Stunt Spectacular!",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "181",
                                "Name": "Star Tours® - The Adventures Continue",
                                "Status": "Operating",
                                "StandbyWaitTime": "20",
                                "FPDistributionTime": "FASTPASS is Not Available"
                            },
                            {
                                "Id": "344",
                                "Name": "The American Idol Experience",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "902",
                                "Name": "The American Idol® Experience Finale Show",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "183",
                                "Name": "The Great Movie Ride",
                                "Status": "Operating",
                                "StandbyWaitTime": "5",
                                "FPDistributionTime": []
                            }
                        ]
                    },
                    {
                        "Name": "Disney's Animal Kingdom Theme Park",
                        "ShortName": "AK",
                        "Attraction": [
                            {
                                "Id": "158",
                                "Name": "Pangani Forest Exploration Trail",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "160",
                                "Name": "Kilimanjaro Safaris",
                                "Status": "Operating",
                                "StandbyWaitTime": "10",
                                "FPDistributionTime": "FASTPASS is Not Available"
                            },
                            {
                                "Id": "175",
                                "Name": "Wildlife Express Train",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "1501",
                                "Name": "Meet Favorite Disney Pals at Adventurers Outpost",
                                "Status": "Operating",
                                "StandbyWaitTime": "15",
                                "FPDistributionTime": "FASTPASS is Not Available"
                            },
                            {
                                "Id": "169",
                                "Name": "It's Tough to be a Bug!",
                                "Status": "Operating",
                                "StandbyWaitTime": "5",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "157",
                                "Name": "Flights of Wonder",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "161",
                                "Name": "Maharajah Jungle Trek",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "162",
                                "Name": "Kali River Rapids",
                                "Status": "Operating",
                                "StandbyWaitTime": "20",
                                "FPDistributionTime": "FASTPASS is Not Available"
                            },
                            {
                                "Id": "164",
                                "Name": "Expedition Everest - Legend of the Forbidden Mountain®",
                                "Status": "Operating",
                                "StandbyWaitTime": "15",
                                "FPDistributionTime": "FASTPASS is Not Available"
                            },
                            {
                                "Id": "346",
                                "Name": "Finding Nemo - The Musical",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": "N/A"
                            },
                            {
                                "Id": "165",
                                "Name": "TriceraTop Spin",
                                "Status": "Operating",
                                "StandbyWaitTime": "5",
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "166",
                                "Name": "Primeval Whirl",
                                "Status": "Operating",
                                "StandbyWaitTime": "10",
                                "FPDistributionTime": "FASTPASS is Not Available"
                            },
                            {
                                "Id": "171",
                                "Name": "The Boneyard",
                                "Status": "Operating",
                                "StandbyWaitTime": [],
                                "FPDistributionTime": []
                            },
                            {
                                "Id": "194",
                                "Name": "DINOSAUR",
                                "Status": "Operating",
                                "StandbyWaitTime": "30",
                                "FPDistributionTime": "FASTPASS is Not Available"
                            }
                        ]
                    }
                ]
        }
    }
})();