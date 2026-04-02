# Dungeon Dive
A browser-based management game that incorporates auto-battling/idle game elements with RPG elements.  
This isn't complete by any means, but for now some things work, at least.
# 
I primarily started this just to learn React, and what better way than to make a basic browser-based game? Honestly, it'll just be a project made out of love, but I intend to host it as a free game one day with a non-localized data source.  
For what works at the moment (3/28):
- There is some sort of auto-tick for the "dungeon". This requires having at least one party member to enable it, then every 3 seconds it'll call an endpoint that leads to a random event.
- The party system works, or at least a very basic form of it.  
- You can also recruit and retire adventurers. Right now, there's no benefit since I haven't implemented the experience gain and leveling, but you can recruit as many as you want. I intend to cap that at some point.
- There is a basic battle system implemented. Right now, the only function is to do a simple attack that's based on the str stat for an adventurer. The system utilizes a readiness counter up to 100, and any enemy or adventurer with a readiness >= 100 will take a turn. To counteract possible overlapping, I have every unit's initial readiness staggered, and readiness is saved as a float value rather than an integer.
# 
Current plan(s) for the near future:  
- There are still things I'll need to do afterwards, like adding the leveling and stats/skills system, UI tweaking, etcetera. Unfortunately, I don't have funds due to the lack of a job, so I can't pay for sprites or anything of the sort. We'll have to make do with simple Tailwind+DaisyUI windows and Lucide icons for now.
- The next phase would be to remake the Guild Hall, primarily the roster. The current iteration of it, while functional, is quite problematic at least for me, and I want to expand on what information is displayed when we check the roster. The modal kind of works when we want to display an adventurer's information, but it would probably not be the best fit once skills and equipment come into play.
- Another thing for TownView is a uniform UI design. Currently, I have borders everywhere and this is especially a visual issue with the current roster.
- When I implement leveling and stats/skills, I'll need to flesh out the overall class system as well. It'll be basic at the beginning, but I'll start with recruitment letting you choose which class you want to recruit, and then the backend will supply a new adventurer of said class with specific initial stats (each randomized within a range) that cater to that class, possibly a skill or two as well. For now, the main goal will be to have the leveling system and a basic class system.
